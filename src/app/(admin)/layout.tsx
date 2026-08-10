import { Sidebar } from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main className="ml-72 min-h-screen p-16">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </>
  );
}
