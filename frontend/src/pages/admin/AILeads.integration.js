// This file intentionally does NOT alter routing or UI.
// It only provides the exact integration-layer fetch/state/render mapping logic
// extracted from `AILeads.jsx` so you can copy/paste safely elsewhere.

import { useEffect, useMemo, useState } from "react";
import { listProspects, listCampaigns, listTemplates } from "../../api/aiLeadEngineApi.js";
import { showError } from "../../context/ToastContext.jsx";
import { useStorage } from "../../hooks/useLocalStorage.js";

const stages = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

export function useAILeadsIntegration() {
  const { data: mockLeads, update } = useStorage("leads");
  const [filter, setFilter] = useState("all");

  const [backendProspects, setBackendProspects] = useState([]);
  const [backendCampaigns, setBackendCampaigns] = useState([]);
  const [backendTemplates, setBackendTemplates] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setError(null);
      try {
        setLoading(true);

        const [prospectsRes, campaignsRes, templatesRes] = await Promise.all([
          listProspects({}),
          listCampaigns({}),
          listTemplates(),
        ]);

        // Normalize axios shape: { data: { data: [...] } } OR { data: [...] }
        const prospects = prospectsRes?.data?.data ?? prospectsRes?.data ?? [];
        const campaigns = campaignsRes?.data?.data ?? campaignsRes?.data ?? [];
        const templates = templatesRes?.data?.data ?? templatesRes?.data ?? [];

        if (!mounted) return;

        setBackendProspects(Array.isArray(prospects) ? prospects : []);
        setBackendCampaigns(Array.isArray(campaigns) ? campaigns : []);
        setBackendTemplates(Array.isArray(templates) ? templates : []);
      } catch (e) {
        if (!mounted) return;
        console.error(e);
        setError(e);
        showError("Failed to load AI Lead Engine data. Using local mock leads.");
        setBackendProspects([]);
        setBackendCampaigns([]);
        setBackendTemplates([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const leads = (backendProspects && backendProspects.length ? backendProspects : mockLeads).map((lead) => ({
    // Normalize fields so existing UI doesn’t need large changes.
    id: lead.id ?? lead.prospectId ?? lead._id ?? `${lead.company ?? lead.name ?? "lead"}-${Math.random()}`,
    company: lead.company ?? lead.organization ?? lead.companyName,
    name: lead.name,
    contact: lead.contact ?? lead.email ?? lead.phone,
    owner: lead.owner ?? lead.assignedTo,
    amount: lead.amount ?? lead.expectedValue,
    priority: lead.priority ?? lead.priorityLabel,
    stage: lead.stage ?? lead.pipelineStage,
  }));

  const filteredLeads = useMemo(() => {
    if (filter === "all") return leads;
    return leads.filter((lead) => lead.priority === filter || lead.status === filter);
  }, [filter, leads]);

  const stats = useMemo(() => {
    const qualified = leads.filter((lead) => ["Qualified", "Proposal", "Negotiation"].includes(lead.stage)).length;
    const hot = leads.filter((lead) => lead.priority === "High").length;
    const won = leads.filter((lead) => lead.stage === "Won").length;
    return { qualified, hot, won };
  }, [leads]);

  const handleAdvance = (lead) => {
    const currentIndex = stages.indexOf(lead.stage || "New");
    const nextStage = stages[Math.min(currentIndex + 1, stages.length - 1)];
    update(lead.id, { stage: nextStage, status: nextStage === "Won" ? "Won" : lead.status });
  };

  const handlePriority = (lead) => {
    const nextPriority = lead.priority === "High" ? "Medium" : lead.priority === "Medium" ? "Low" : "High";
    update(lead.id, { priority: nextPriority });
  };

  const handleArchive = (lead) => {
    update(lead.id, { status: "Archived" });
  };

  return {
    filter,
    setFilter,
    filteredLeads,
    stats,
    loading,
    error,
    backendProspects,
    backendCampaigns,
    backendTemplates,
    handleAdvance,
    handlePriority,
    handleArchive,
  };
}

