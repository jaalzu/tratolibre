"use client";

import dynamic from "next/dynamic";

const FormSkeleton = () => (
  <div className="animate-pulse space-y-6">
    {/* Título */}
    <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-8"></div>

    {/* Inputs del formulario */}
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-12 bg-gray-100 rounded-lg w-full border border-gray-100"></div>
      </div>
    ))}

    {/* Área de texto/descripción */}
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
      <div className="h-32 bg-gray-100 rounded-lg w-full"></div>
    </div>

    {/* Botón */}
    <div className="h-12 bg-gray-200 rounded-full w-full mt-10"></div>
  </div>
);

export const DynamicNewItemForm = dynamic(
  () => import("./NewItemForm").then((mod) => mod.NewItemForm),
  {
    ssr: true,
    loading: () => <FormSkeleton />,
  },
);
