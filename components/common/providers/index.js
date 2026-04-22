import { TBMToaster } from "@/components/shared/toast";
import LoadingScreen from "@/components/common/loading-screen";
import QueryProvider from "./QueryProvider";

export default function Providers({ children }) {
  return (
    <QueryProvider>
      <LoadingScreen />
      {children}
      <TBMToaster />
    </QueryProvider>
  );
}
