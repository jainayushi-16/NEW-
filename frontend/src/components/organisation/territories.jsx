import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  MapPinned,
  Building2,
  X,
  Save,
} from "lucide-react";

import {
  getDashboardData,
  createTerritory,
  updateTerritory,
  deleteTerritory as deleteTerritoryApi,
} from "../../api/dashboardApi";

export default function Territories() {
  const [territories, setTerritories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [editingTerritory, setEditingTerritory] = useState(null);
  const [deleteTerritory, setDeleteTerritory] = useState(null);
  const [viewTerritory, setViewTerritory] = useState(null);

  const emptyTerritory = {
    name: "",
    companyId: "",
    description: "",
  };

  const [formData, setFormData] = useState(emptyTerritory);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardData();
      setTerritories(data?.territories || []);
      setCompanies(data?.companies || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdd = () => {
    setEditingTerritory(null);
    setFormData(emptyTerritory);
    setShowModal(true);
  };

  const handleEdit = (territory) => {
    setEditingTerritory(territory);
    setFormData({
      name: territory.name || "",
      companyId: territory.companyId || "",
      description: territory.description || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Territory name is required");
      return;
    }

    const payload = {
      name: formData.name,
      companyId: formData.companyId || null,
      description: formData.description,
    };

    try {
      if (editingTerritory) {
        await updateTerritory(editingTerritory.id, payload);
      } else {
        await createTerritory(payload);
      }

      await loadData();
      setShowModal(false);
      setEditingTerritory(null);
      setFormData(emptyTerritory);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Unable to save territory");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteTerritoryApi(deleteTerritory.id);
      setDeleteTerritory(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const filteredTerritories = territories.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.name?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="p-8 text-gray-600 font-medium">Loading Territories...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Territory Management</h2>
          <p className="text-gray-500 mt-2">Manage all sales territories across your organization.</p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow transition"
        >
          <Plus size={20} />
          Add Territory
        </button>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <MapPinned className="text-blue-600" size={28} />
          </div>
          <div>
            <p className="text-gray-500">Total Territories</p>
            <h2 className="text-3xl font-bold mt-1">{territories.length}</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
            <Building2 className="text-green-600" size={28} />
          </div>
          <div>
            <p className="text-gray-500">Linked Companies</p>
            <h2 className="text-3xl font-bold mt-1">{territories.filter((t) => t.companyId).length}</h2>
          </div>
        </div>
      </div>

      {/* SEARCH CONTAINER */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search Territory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Territory
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Company ID
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredTerritories.length > 0 ? (
                filteredTerritories.map((territory) => (
                  <tr key={territory.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">{territory.name}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                      {territory.description || <span className="text-gray-400 italic">No description</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {territory.companyId || <span className="text-gray-400 italic">Unlinked</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setViewTerritory(territory);
                            setShowViewModal(true);
                          }}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(territory)}
                          className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTerritory(territory)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">
                    No matching territories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">{editingTerritory ? "Edit Territory" : "Add Territory"}</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingTerritory(null);
                  setFormData(emptyTerritory);
                }}
                className="p-2 rounded-lg hover:bg-slate-100"
                aria-label="Close"
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Territory Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

              <select
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value="">Select Company (optional)</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name || c.id}
                  </option>
                ))}
              </select>

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

              <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white rounded-lg p-3"
              >
                <Save className="inline mr-2" size={18} />
                {editingTerritory ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewTerritory && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">Territory Details</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setViewTerritory(null);
                }}
                className="p-2 rounded-lg hover:bg-slate-100"
                aria-label="Close"
              >
                <X />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <p>
                <b>Name:</b> {viewTerritory.name}
              </p>
              <p>
                <b>Description:</b> {viewTerritory.description || "-"}
              </p>
              <p>
                <b>Company:</b> {viewTerritory.company?.name || viewTerritory.companyId || "-"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTerritory && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-center">Delete Territory</h2>
            <p className="text-center mt-4">
              Delete <b>{deleteTerritory.name}</b> ?
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setDeleteTerritory(null)}
                className="border px-5 py-2 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

