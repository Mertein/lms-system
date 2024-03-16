import { NavbarRoutes } from "@/components/navbar-routes";
import { MobileSidebar } from "./mobile-sidebar";

export const Navbar = () => {
  return (
    <div className="border-b shadow-sm bg-white flex h-full p-4 items-center">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
};
