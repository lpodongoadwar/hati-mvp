"use client";

import dynamic from "next/dynamic";

// This tells Next.js to skip prerendering the admin page on the server
const AdminClient = dynamic(
  () => import("./AdminClient").then((mod) => mod.AdminClient),
  { ssr: false }
);

export default function AdminPage() {
  return <AdminClient />;
}