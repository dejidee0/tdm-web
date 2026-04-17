// app/dashboard/projects/[id]/page.jsx
"use client";

import { motion } from "framer-motion";
import DashboardLayout from "@/components/shared/dashboard/layout";

import { useProject } from "@/hooks/use-project";
import ProjectHeader from "@/components/shared/dashboard/projects/header";
import SiteProgressPhotos from "@/components/shared/dashboard/projects/site-progress";
import LiveUpdates from "@/components/shared/dashboard/projects/live-updates";
import RegionalOfficeCard from "@/components/shared/dashboard/projects/regional-card";
import ProjectMilestones from "@/components/shared/dashboard/projects/milestones";
import ProjectDocuments from "@/components/shared/dashboard/projects/project-documents";

export default function ProjectDetailPage({ params }) {
  const { data: project, isLoading, isError } = useProject(params.id);

  return (
    <DashboardLayout>
      <div className="space-y-6 pt-12 md:pt-0 w-full">
        {/* Page Header */}
        <ProjectHeader project={project} isLoading={isLoading} />

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] lg:grid-cols-[1fr_300px] gap-6 items-start">
          {/* Left column */}
          <div className="space-y-6">
            <ProjectMilestones
              milestones={project?.milestones}
              isLoading={isLoading}
            />
            <SiteProgressPhotos
              photos={project?.photos}
              isLoading={isLoading}
            />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <ProjectDocuments
              documents={project?.documents}
              isLoading={isLoading}
            />
            <LiveUpdates
              updates={project?.updates}
              budget={project?.budget}
              isLoading={isLoading}
            />
            <RegionalOfficeCard
              office={project?.office}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
