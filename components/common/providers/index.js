import { TBMToaster } from "@/components/shared/toast";
import QueryProvider from "./QueryProvider";

export default function Providers({ children }) {
  return (
    <QueryProvider>
      {children}
      <TBMToaster />
    </QueryProvider>
  );
}
