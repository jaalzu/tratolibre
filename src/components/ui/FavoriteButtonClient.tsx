"use client";

import dynamic from "next/dynamic";

const FavoriteButton = dynamic(
  () =>
    import("@/components/ui/FavoriteButton").then((mod) => mod.FavoriteButton),
  {
    ssr: false,
    loading: () => <div style={{ width: 22, height: 22 }} />,
  },
);

export function FavoriteButtonClient(props: any) {
  return <FavoriteButton {...props} />;
}
