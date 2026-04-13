import dynamic from "next/dynamic";

const TermsContent = dynamic(
  () => import("@/components/layout/footer/TermsContent"),
  {
    ssr: true, // Importante para que el contenido legal sea indexable
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
          Cargando términos legales...
        </p>
      </div>
    ),
  },
);

export const metadata = {
  title: "Términos y Condiciones | TratoLibre",
  description: "Leé los términos y condiciones de uso de TratoLibre.",
};

export default function TermsAndConditionsPage() {
  return <TermsContent />;
}
