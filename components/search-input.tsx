"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import qs from "query-string";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchInput = () => {
  const [value, setValue] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const debouncedValue = useDebounce(value);
  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathName,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true },
    );

    router.push(url);
  }, [debouncedValue, router, pathName, currentCategoryId]);

  return (
    <div className="relative">
      <Search className="w-4 h-4 absolute top-3 left-3 text-slate-600" />
      <Input
        className="bg-slate-100 w-full md:w-[300px] rounded-full pl-9 focus-visible:ring-slate-200 focus-visible:ring-2 focus-visible:ring-opacity-50"
        placeholder="Buscar un curso"
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    </div>
  );
};
