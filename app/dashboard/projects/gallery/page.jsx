// app/dashboard/projects/[id]/gallery/page.jsx
import DashboardLayout from "@/components/shared/dashboard/layout";
import SiteGallery from "@/components/shared/dashboard/projects/site-gallery";

export default function GalleryPage({ params }) {
  return (
    <DashboardLayout>
      <div className="pt-12 md:pt-0">
        <SiteGallery projectId={params.id} />
      </div>
    </DashboardLayout>
  );
}
