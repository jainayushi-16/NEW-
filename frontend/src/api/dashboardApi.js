import api from "../services/api";

// Get Dashboard Data
export const getDashboardData = async () => {
  try {
    const [
      organizations,
      companies,
      branches,
      territories,
      departments,
      users,
    ] = await Promise.all([
      api.get("/organization/organizations"),
      api.get("/organization/companies"),
      api.get("/organization/branches"),
      api.get("/organization/territories"),
      api.get("/organization/departments"),
      api.get("/users"),
    ]);

    const pickData = (r) => r?.data?.data ?? r?.data;

    return {
      organizations: pickData(organizations),
      companies: pickData(companies),
      branches: pickData(branches),
      territories: pickData(territories),
      departments: pickData(departments),
      users: pickData(users),
    };
  } catch (error) {
    console.error("Dashboard API Error:", error);
    throw error;
  }
};

// ==================== CREATE ====================

export const createOrganization = (data) =>
  api.post("/organization/organizations", data);

export const createCompany = (data) =>
  api.post("/organization/companies", data);

export const createBranch = (data) =>
  api.post("/organization/branches", data);

export const createTerritory = (data) =>
  api.post("/organization/territories", data);

export const createDepartment = (data) =>
  api.post("/organization/departments", data);

export const createUser = (data) =>
  api.post("/users", data);

// ==================== UPDATE ====================

export const updateOrganization = (id, data) =>
  api.put(`/organization/organizations/${id}`, data);

export const updateCompany = (id, data) =>
  api.put(`/organization/companies/${id}`, data);

export const updateBranch = (id, data) =>
  api.put(`/organization/branches/${id}`, data);

export const updateTerritory = (id, data) =>
  api.put(`/organization/territories/${id}`, data);

export const updateDepartment = (id, data) =>
  api.put(`/organization/departments/${id}`, data);

export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data);

// ==================== DELETE ====================

export const deleteOrganization = (id) =>
  api.delete(`/organization/organizations/${id}`);

export const deleteCompany = (id) =>
  api.delete(`/organization/companies/${id}`);

export const deleteBranch = (id) =>
  api.delete(`/organization/branches/${id}`);

export const deleteTerritory = (id) =>
  api.delete(`/organization/territories/${id}`);

export const deleteDepartment = (id) =>
  api.delete(`/organization/departments/${id}`);

export const deleteUser = (id) =>
  api.delete(`/users/${id}`);