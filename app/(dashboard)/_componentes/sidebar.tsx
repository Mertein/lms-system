import { Earth, Home } from "lucide-react";
import SidebarRoutes from "./sidebar-routes";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Logo } from "./logo";

const Sidebar = () => {
  return (
    <div className="bg-white h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-6 flex justify-center items-center">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};

export default Sidebar;
