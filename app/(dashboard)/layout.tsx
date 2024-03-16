import { UserButton } from "@clerk/nextjs";
import Sidebar from "./_componentes/sidebar";
import { Navbar } from "./_componentes/navbar";

export default function LayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="h-[88px] md:pl-56 inset-y-0">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full flex-col w-56 transition-all z-50 fixed inset-y-0 ">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
}
