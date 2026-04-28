import { PageContainer } from "@/components/ui/PageContainer";
import styles from "./SectionSkeleton.module.css";

function Bone({
  w = "100%",
  h = "16px",
  borderRadius = "4px", // md aproximado
}: {
  w?: string;
  h?: string;
  borderRadius?: string;
}) {
  return (
    <div
      className={styles.bone}
      style={{
        width: w,
        height: h,
        borderRadius: borderRadius,
      }}
    />
  );
}

export function SectionSkeleton() {
  return (
    <PageContainer pt={{ base: 4, md: 8 }} pb={4}>
      <div className={styles.card}>
        {/* Título */}
        <Bone w="200px" h="20px" borderRadius="4px" />

        <div className={styles.divider} />

        {/* Cards */}
        <div className={styles.flexContainer}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.cardWrapper}>
              <Bone h="240px" borderRadius="12px" /> {/* xl aproximado */}
              <div style={{ marginTop: "8px" }}>
                <Bone w="80%" h="14px" />
              </div>
              <div style={{ marginTop: "6px" }}>
                <Bone w="50%" h="14px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
