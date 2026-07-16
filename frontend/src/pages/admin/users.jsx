import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

import DataTable from "../../components/ui/DataTable.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { ConfirmDialog } from "../../components/ui/Modal.jsx";
import Button from "../../components/ui/Button.jsx";
import { Select } from "../../components/ui/Input.jsx";
import Input from "../../components/ui/Input.jsx";

import { useState, useEffect } from "react";
import api from "../../services/api.js";
import { showSuccess, showError } from "../../context/ToastContext.jsx";

const columns = [
  { key: "firstName", label: "Name", render: (r) => `${r.firstName || ""} ${r.lastName || ""}`.trim() },
  { key: "email", label: "Email" },
  { key: "role", label: "Role", render: (r) => (r.roles?.[0]?.role?.name || r.roles?.[0]?.role?.id || "-") },
  { key: "department", label: "Department", render: (r) => r.department?.name || "-" },
  { key: "territory", label: "Territory", render: (r) => r.territory?.name || "-" },
  { key: "status", label: "Status", render: (r) => (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{r.isActive ? "Active" : "Inactive"}</span>
  )},
];

const fields = [
  { name: "firstName", label: "First Name", required: true },
  { name: "lastName", label: "Last Name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", required: true },
  { name: "phoneNumber", label: "Phone" },
  { name: "roleIds", label: "Roles", type: "multiselect", required: true },
  { name: "departmentId", label: "Department ID" },
  { name: "teamId", label: "Team ID" },
  { name: "branchId", label: "Branch ID" },
  { name: "territoryId", label: "Territory ID" },
  { name: "managerId", label: "Manager ID" },
  { name: "isActive", label: "Status", type: "select", options: [true, false] },
];

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { status: "Active", roleIds: [], role: "SALES_PERSON", isActive: true },
  });


  const fetchRoles = async () => {
    const res = await api.get("/roles", { params: { limit: 1000, page: 1 } });
    const rolesPayload = res?.data?.data?.roles || res?.data?.data?.roles || res?.data?.roles || [];
    setRoles(rolesPayload);
    return rolesPayload;
  };

  const fetchUsers = async () => {
    const res = await api.get("/users", { params: { limit: 200, page: 1 } });
    const users = res?.data?.data?.users || res?.data?.data?.users || [];
    setData(users);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await fetchRoles();
        await fetchUsers();
      } catch (e) {
        showError("Failed to load roles/users");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const openCreate = () => {
    setEditItem(null);
    reset({ status: "Active", isActive: true, roleIds: [] });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    const roleIds = (item?.roles || []).map((r) => r.roleId || r.role?.id).filter(Boolean);
    reset({
      ...item,
      password: "",
      roleIds,
      isActive: item?.isActive ?? true,
      status: item?.isActive ? "Active" : "Inactive",
    });
    setModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber || formData.phone,
        type: formData.type || undefined,
        branchId: formData.branchId,
        departmentId: formData.departmentId,
        teamId: formData.teamId,
        territoryId: formData.territoryId,
        managerId: formData.managerId,
        roleIds: formData.roleIds,
        isActive: formData.isActive ?? true,
      };

      if (editItem) {
        // updateUser in backend validation doesn't accept password; handle only fields we have
        const updatePayload = {
          firstName: payload.firstName,
          lastName: payload.lastName,
          phoneNumber: payload.phoneNumber,
          branchId: payload.branchId,
          departmentId: payload.departmentId,
          teamId: payload.teamId,
          territoryId: payload.territoryId,
          managerId: payload.managerId,
          type: payload.type,
          isActive: payload.isActive,
        };

        await api.put(`/users/${editItem.id}`, updatePayload);
        if (payload.roleIds?.length) {
          await api.put(`/users/${editItem.id}/roles`, { roleIds: payload.roleIds });
        }

        showSuccess("User updated");
      } else {
        await api.post(`/users`, payload);
        showSuccess("User created");
      }

      setModalOpen(false);
      await fetchUsers();
    } catch (e) {
      console.error(e);
      showError(e?.response?.data?.message || "Failed to save user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Users</h1>
          <p className="text-sm text-slate-500">Manage platform users and roles</p>
        </div>
        <Button icon={Plus} onClick={openCreate}>Add User</Button>
      </div>

      {loading ? (
        <div className="text-slate-600">Loading users...</div>
      ) : (
        <DataTable
          data={data}
          columns={columns}
          searchKeys={["firstName", "lastName", "email", "department", "territory"]}
          filters={[
            { key: "status", label: "Status", options: ["Active", "Inactive"] },
          ]}
          onView={(r) => { setViewItem(r); setViewModal(true); }}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          onBulkDelete={undefined}
          onImport={undefined}
          exportFilename="users"
          exportTitle="Users"
          theme="indigo"
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit User" : "Add User"} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => {
            const rules = f.required && !editItem ? { required: `${f.label} required` } : {};
            if (f.name === "password" && editItem) return null;
            if (f.name === "roleIds") {
              const selectedRoleIds = watch("roleIds") || [];

              return (
                <div key={f.name}>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {f.label}
                  </label>
                  <select
                    multiple
                    className={`sfa-input ${errors[f.name]?.message ? "border-rose-400" : ""}`}
                    {...register(f.name, rules)}
                    value={selectedRoleIds}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
                      setValue(f.name, selected, { shouldValidate: true });
                    }}
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  {errors[f.name]?.message && <p className="mt-1 text-xs text-rose-500">{errors[f.name]?.message}</p>}
                </div>
              );
            }

            if (f.type === "select") {
              const opts = f.options?.map((v) => (typeof v === "boolean" ? (v ? "Active" : "Inactive") : v)) || [];
              return <Select key={f.name} label={f.label} options={opts} error={errors[f.name]?.message} {...register(f.name, rules)} />;
            }
            return <Input key={f.name} label={f.label} type={f.type || "text"} error={errors[f.name]?.message} {...register(f.name, { ...rules, ...(f.type === "email" ? { pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } } : {}) })} />;
          })}
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editItem ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={viewModal} onClose={() => setViewModal(false)} title="User Details">
        {viewItem && fields.filter((f) => f.name !== "password").map((f) => (
          <div key={f.name} className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-500">{f.label}</span>
            <span className="text-sm">{viewItem[f.name] ?? "-"}</span>
          </div>
        ))}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          try {
            // backend delete endpoint requires org + auth; handled by axios interceptor
            await api.delete(`/users/${deleteTarget.id}`);
            showSuccess("User deleted");
            setDeleteTarget(null);
            await fetchUsers();
          } catch (e) {
            console.error(e);
            showError(e?.response?.data?.message || "Failed to delete user");
          }
        }}
        title="Delete User"
        message="Remove this user permanently?"
      />
    </div>
  );
}
