import api from "../services/api";

// Base backend mount (from backend router): /api/v1/ai-lead-engine
// All functions in this file map 1:1 to engine.routes.js.

export const importProspectsFile = (file, extra = {}) => {
  // Backend expects: upload.single('file')
  const formData = new FormData();
  formData.append("file", file);

  Object.entries(extra).forEach(([k, v]) => {
    if (v !== undefined && v !== null) formData.append(k, v);
  });

  return api.post("/ai-lead-engine/imports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const importApiProspects = (payload) =>
  api.post("/ai-lead-engine/imports/api", payload);

export const importManualProspect = (payload) =>
  api.post("/ai-lead-engine/imports/manual", payload);

export const listImportJobs = () => api.get("/ai-lead-engine/imports/jobs");

export const getImportJob = (id) =>
  api.get(`/ai-lead-engine/imports/jobs/${id}`);

export const listProspects = (query = {}) => {
  return api.get("/ai-lead-engine/prospects", { params: query });
};

// Templates
export const createTemplate = (payload) =>
  api.post("/ai-lead-engine/templates", payload);

export const listTemplates = () => api.get("/ai-lead-engine/templates");

export const getTemplate = (id) =>
  api.get(`/ai-lead-engine/templates/${id}`);

export const updateTemplate = (id, payload) =>
  api.put(`/ai-lead-engine/templates/${id}`, payload);

export const deleteTemplate = (id) =>
  api.delete(`/ai-lead-engine/templates/${id}`);

// Campaigns
export const createCampaign = (payload) =>
  api.post("/ai-lead-engine/campaigns", payload);

export const listCampaigns = (query = {}) =>
  api.get("/ai-lead-engine/campaigns", { params: query });

export const getCampaign = (id) =>
  api.get(`/ai-lead-engine/campaigns/${id}`);

export const updateCampaign = (id, payload) =>
  api.put(`/ai-lead-engine/campaigns/${id}`, payload);

export const deleteCampaign = (id) =>
  api.delete(`/ai-lead-engine/campaigns/${id}`);

export const scheduleCampaign = (id, payload) =>
  api.post(`/ai-lead-engine/campaigns/${id}/schedule`, payload);

export const getCampaignStatistics = (id) =>
  api.get(`/ai-lead-engine/campaigns/${id}/statistics`);

export const sendTestEmail = (id, payload) =>
  api.post(`/ai-lead-engine/campaigns/${id}/test-email`, payload);

export const addProspectsToCampaign = (id, payload) =>
  api.post(`/ai-lead-engine/campaigns/${id}/prospects`, payload);

export const generateRecipients = (id, payload) =>
  api.post(`/ai-lead-engine/campaigns/${id}/recipients/generate`, payload);

