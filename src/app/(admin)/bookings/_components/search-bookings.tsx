"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";
import { useFilterBooking } from "./states/useFilterBooking";

const SearchBookings = () => {
  const { setSearch, setDate } = useFilterBooking();

  return (
    <div className="bg-white p-5 rounded-lg mt-8 shadow-[0px_4px_10px_0px_#0000001A] h-[100px] flex flex-col justify-center">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Input
            className="w-[264px] pl-7 focus-visible:ring-0"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="h-4 w-4 opacity-75 absolute top-1/4 left-2" />
        </div>

        <div className="flex items-center gap-5">
          <div>
            <input
              type="date"
              className="w-[180px] focus-visible:ring-0 border border-input h-9 rounded-md text-base shadow-sm px-3 py-1"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBookings;
