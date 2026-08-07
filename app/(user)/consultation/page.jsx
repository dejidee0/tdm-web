import ConsultationClient from "./client";

export const metadata = {
  title: "Book a Consultation | TBM Building Services",
  description:
    "Book a virtual consultation, site inspection, design session, renovation planning or estimate review with TBM Building Services. Abuja and Lagos, with nationwide coverage.",
  keywords: [
    "book renovation consultation Nigeria",
    "site inspection Abuja",
    "virtual design consultation Lagos",
    "renovation planning consultation",
    "construction estimate review Nigeria",
    "TBM Building Services consultation",
  ],
  openGraph: {
    title: "Book a Consultation | TBM Building Services",
    description:
      "Pick a consultation type, choose a date and time, describe your project and share photos. A TBM consultant confirms within 24 hours.",
    type: "website",
  },
  alternates: { canonical: "/consultation" },
};

export default function ConsultationPage() {
  return <ConsultationClient />;
}
