"use client";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export const SidebarItem = ({ href, icon: Icon, label }: SidebarItemProps) => {
  const pathName = usePathname();
  const route = useRouter();

  const isActive = pathName === href;
  const onClick = () => {
    route.push(href);
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full gap-x-2 items-center text-sm text-slate-500 font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700",
      )}
    >
      <div className="flex gap-x-2 py-4 items-center">
        <Icon
          size={22}
          className={cn("text-slate-500", isActive && "text-sky-700")}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto border-2  border-sky-700 h-full transition-all opacity-0",
          isActive && "opacity-100",
        )}
      />
    </button>
  );
};
