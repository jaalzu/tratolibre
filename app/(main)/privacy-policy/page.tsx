import dynamic from "next/dynamic";

const PrivacyContent = dynamic(
  () => import("@/components/layout/footer/PrivacyContent"),
  {
    ssr: true,
    loading: () => (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#958e8e", fontSize: "14px" }}>
          Cargando políticas de privacidad...
        </p>
      </div>
    ),
  },
);

export const metadata = {
  title: "Política de Privacidad | TratoLibre",
  description:
    "Conocé cómo TratoLibre recopila, usa y protege tu información personal.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyContent />;
}
