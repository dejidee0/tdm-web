import CreateDesignView from "@/components/shared/dashboard/designs/create-design-view";

export const metadata = {
  title: "Create a New Design | TBM Building Services",
  description: "Upload your room, choose a style, and let Ziora render your redesigned space.",
};

export default function NewDesignPage() {
  return <CreateDesignView />;
}
