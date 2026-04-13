import dynamic from "next/dynamic";

const HowItWorksContent = dynamic(
  () => import("@/components/layout/footer/HowItWorksContent"),
  {
    ssr: true,
    loading: () => (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#958e8e", fontSize: "14px" }}>
          Cargando guía de uso...
        </p>
      </div>
    ),
  },
);

export const metadata = {
  title: "Cómo funciona | TratoLibre",
  description:
    "Aprendé cómo comprar, vender e intercambiar objetos usados en TratoLibre de forma simple y segura.",
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}
