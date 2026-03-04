// hooks/use-project.js
import { useQuery } from "@tanstack/react-query";

// ── Mock data ──────────────────────────────────────────────────────────────────
const MOCK_PROJECT = {
  id: "1",
  name: "Modern Penthouse Renovation",
  address: "128 Skyview Heights, North District",
  status: "in-progress",
  createdAt: "Sept 12, 2023",
  estCompletion: "Dec 15, 2023",
  progress: 65,
  budget: "$428,500.00",
  milestones: [
    {
      id: 1,
      title: "Initial Design Concept",
      description:
        "Full architectural blueprints and mood boards approved by client.",
      status: "completed",
      date: "Completed Oct 05",
    },
    {
      id: 2,
      title: "Material Sourcing",
      description:
        "Finalizing selection for kitchen marble and custom floor tiling.",
      status: "in-progress",
      date: null,
    },
    {
      id: 3,
      title: "Structural Work",
      description:
        "Wall demolition and HVAC rerouting scheduled for next month.",
      status: "pending",
      date: null,
    },
    {
      id: 4,
      title: "Interior Finishing",
      description:
        "Paint, lighting fixtures, and custom cabinetry installation.",
      status: "pending",
      date: null,
    },
  ],
  documents: [
    {
      id: 1,
      name: "Master_Contract_V2.pdf",
      meta: "Signed Sep 15, 2023 · 2.4MB",
      type: "pdf",
      color: "#3b5bdb",
    },
    {
      id: 2,
      name: "Blueprints_Approved.dwg",
      meta: "Updated Oct 31, 2023 · 18MB",
      type: "dwg",
      color: "#e67e22",
    },
    {
      id: 3,
      name: "Budget_Report_Q4.xlsx",
      meta: "Updated Oct 28, 2023 · 1MB",
      type: "xlsx",
      color: "#27ae60",
    },
  ],
  updates: [
    {
      id: 1,
      text: "Electrical inspection passed yesterday morning. No issues found.",
      active: true,
    },
    {
      id: 2,
      text: "Flooring delivery rescheduled for Nov 2nd due to freight delays.",
      active: true,
    },
    {
      id: 3,
      text: "Client meeting scheduled for Friday 3PM via Zoom.",
      active: false,
    },
  ],
  photos: [
    {
      id: 1,
      title: "Main Living Area Framing",
      subtitle: "Updated 2 days ago · Site A",
      placeholder: "#4a7c6a",
    },
    {
      id: 2,
      title: "Kitchen Material Selection",
      subtitle: "Updated Oct 24 · Site B",
      placeholder: "#3d5a6e",
    },
  ],
  office: {
    name: "Regional Office: Pacific Northwest",
    contact: "support@tbmdigital.com",
    imageSrc: null,
  },
};

// ── API function (swap mock with real fetch when ready) ────────────────────────
async function fetchProject(id) {
  // TODO: replace with real API call
  // const res = await fetch(`/api/projects/${id}`);
  // if (!res.ok) throw new Error("Failed to fetch project");
  // return res.json();

  await new Promise((r) => setTimeout(r, 700)); // simulate network delay
  return MOCK_PROJECT;
}

// ── Query keys ─────────────────────────────────────────────────────────────────
export const projectKeys = {
  all: ["projects"],
  detail: (id) => ["projects", id],
};

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useProject(id) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => fetchProject(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 min
  });
}
