import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  GitBranch,
  MapPinned,
  Building,
  Users,
  Plus,
  TrendingUp,
  Clock,
} from "lucide-react";
import api from "../../services/api.js";

export default function Overview({ onNavigateSection }) {
  const [counts, setCounts] = useState({
    branches: 0,
    territories: 0,
    departments: 0,
    teams: 0,
    employees: 0,
  });
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", isActive: true });

  const stats = useMemo(
    () => [
      {
        title: "Branches",
        value: counts.branches,
        icon: <GitBranch size={28} />,
        color: "bg-green-100 text-green-600",
      },
      {
        title: "Territories",
        value: counts.territories,
        icon: <MapPinned size={28} />,
        color: "bg-orange-100 text-orange-600",
      },
      {
        title: "Departments",
        value: counts.departments,
        icon: <Building size={28} />,
        color: "bg-purple-100 text-purple-600",
      },
      {
        title: "Teams",
        value: counts.teams,
        icon: <Users size={28} />,
        color: "bg-pink-100 text-pink-600",
      },
      {
        title: "Employees",
        value: counts.employees,
        icon: <Building2 size={28} />,
        color: "bg-blue-100 text-blue-600",
      },
    ],
    [counts]
  );

  const refresh = async () => {
    setLoading(true);
    try {
      const orgRes = await api.get("/organization/");
      const orgPayload = orgRes?.data?.data ?? orgRes?.data;
      setOrganization(orgPayload);

      const orgId = orgPayload?.id;
      if (orgId) {
        const statsRes = await api.get(
          `/organization/organizations/${orgId}/statistics`
        );
        const statsPayload = statsRes?.data?.data ?? statsRes?.data;

        setCounts({
          branches: statsPayload?.branches ?? 0,
          territories: statsPayload?.territories ?? 0,
          departments: statsPayload?.departments ?? 0,
          teams: statsPayload?.teams ?? 0,
          employees: statsPayload?.employees ?? 0,
        });
      }
    } catch {
      setOrganization(null);
      setCounts({ branches: 0, territories: 0, departments: 0, teams: 0, employees: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!organization) return;
    setEditForm({
      name: organization?.name ?? "",
      isActive: organization?.isActive ?? true,
    });
  }, [organization]);

  const handleSaveOrg = async () => {
    try {
      await api.put("/organization/", {
        name: editForm.name,
        isActive: editForm.isActive,
      });
      setEditOpen(false);
      await refresh();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to update organization");
    }
  };

  const org = organization || {};

  return (
    <div className="space-y-8">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        {stats.map((item) => (
          <div key={item.title} className="bg-white rounded-2xl shadow-sm p-6">
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center ${item.color}`}
            >
              {item.icon}
            </div>
            <h3 className="text-gray-500 mt-5">{item.title}</h3>
            <h2 className="text-3xl font-bold mt-2">
              {loading ? "--" : item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Organization Information */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex justify-between items-start flex-wrap gap-6">
          <div>
            <h2 className="text-2xl font-bold">{loading ? "Loading..." : org.name ?? "-"}</h2>
            <span className="inline-block mt-3 px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium">
              {org.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
            onClick={() => setEditOpen(true)}
            disabled={loading}
          >
            <Plus size={18} />
            Edit Organization
          </button>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">
          <div>
            <p className="text-gray-500">Organization ID</p>
            <h3 className="font-semibold mt-2">{org.id ?? "-"}</h3>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <h3 className="font-semibold mt-2">{org.isActive ? "Active" : "Inactive"}</h3>
          </div>
          <div>
            <p className="text-gray-500">Name</p>
            <h3 className="font-semibold mt-2">{org.name ?? "-"}</h3>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Edit Organization</h2>
                <p className="text-sm text-slate-500 mt-1">Update organization name/status.</p>
              </div>
              <button
                type="button"
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
                onClick={() => setEditOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Organization Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Status</label>
                <select
                  value={editForm.isActive ? "active" : "inactive"}
                  onChange={(e) => setEditForm((p) => ({ ...p, isActive: e.target.value === "active" }))}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-5 py-3 border rounded-xl hover:bg-gray-100 transition"
                  onClick={() => setEditOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
                  onClick={handleSaveOrg}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-5">Quick Actions</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-6 text-left transition"
            onClick={() => onNavigateSection?.("branches")}
          >
            <GitBranch size={35} />
            <h3 className="text-xl font-bold mt-5">Add Branch</h3>
            <p className="text-blue-100 mt-2">Create and manage branches.</p>
          </button>

          <button
            type="button"
            className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-6 text-left transition"
            onClick={() => onNavigateSection?.("territories")}
          >
            <MapPinned size={35} />
            <h3 className="text-xl font-bold mt-5">Add Territory</h3>
            <p className="text-green-100 mt-2">Create new territories.</p>
          </button>

          <button
            type="button"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl p-6 text-left transition"
            onClick={() => onNavigateSection?.("departments")}
          >
            <Building size={35} />
            <h3 className="text-xl font-bold mt-5">Add Department</h3>
            <p className="text-purple-100 mt-2">Manage departments.</p>
          </button>

          <button
            type="button"
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl p-6 text-left transition"
          >
            <Users size={35} />
            <h3 className="text-xl font-bold mt-5">Add Team</h3>
            <p className="text-orange-100 mt-2">Create new sales teams.</p>
          </button>
        </div>
      </div>

      {/* Summary & Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-green-600" />
            <h2 className="text-xl font-bold">Organization Summary</h2>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between">
              <span>Total Branches</span>
              <span className="font-bold">{counts.branches}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Territories</span>
              <span className="font-bold">{counts.territories}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Departments</span>
              <span className="font-bold">{counts.departments}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Teams</span>
              <span className="font-bold">{counts.teams}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Employees</span>
              <span className="font-bold">{counts.employees}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="text-blue-600" />
            <h2 className="text-xl font-bold">Recent Activities</h2>
          </div>

          <div className="space-y-5">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-semibold">New Branch Added</h3>
              <p className="text-sm text-gray-500">Recent branch creation activity.</p>
            </div>
            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="font-semibold">Territory Updated</h3>
              <p className="text-sm text-gray-500">Recent territory update activity.</p>
            </div>
            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="font-semibold">Department Created</h3>
              <p className="text-sm text-gray-500">Recent department creation activity.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

