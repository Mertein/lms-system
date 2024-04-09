"use client";
import { Category } from "@prisma/client";
import { CategoryItem } from "./category-item";
import { IconType } from "react-icons";
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  "Ciencias de la Computación": FcMultipleDevices,
  Música: FcMusic,
  Fitness: FcSportsMode,
  Fotografía: FcOldTimeCamera,
  Contabilidad: FcSalesPerformance,
  Ingeniería: FcEngineering,
  Filmación: FcFilmReel,
};

export const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 pb-2 overflow-x-auto ">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          value={item.id}
          icon={iconMap[item.name]}
        />
      ))}
    </div>
  );
};
