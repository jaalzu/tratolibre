import dynamic from "next/dynamic";

const WhoWeAreContent = dynamic(
  () => import("@/shared/components/layout/footer/WhoWeAreContent"),
  {
    ssr: true,
    loading: () => (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--chakra-colors-neutral-400)", fontSize: "0.875rem" }}>
          Cargando información...
        </p>
      </div>
    ),
  },
);

export const metadata = {
  title: "Quiénes somos | TratoLibre",
  description:
    "Conocé la historia y los valores detrás de TratoLibre, el marketplace argentino de objetos usados.",
};

export default function WhoWeArePage() {
  return <WhoWeAreContent />;
}
