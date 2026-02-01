import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const BookingTimeline = () => {
  return (
    <div className="mt-5">
      <div>
        <h1 className="mb-2 font-medium">Activity Timeline</h1>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="dispute">Dispute</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="border border-gray-200 p-5 rounded-lg shadow-sm mt-5">
        <h1 className="text-xl mb-4">Time Line</h1>

        <div className="text-sm space-y-2">
          <h3>Apr 15, 2025: Booked ######</h3>
          <h3>Apr 12, 2025: Submitted dispute ######</h3>
          <h3>Apr 10, 2025: Status changed to Active</h3>

          <div className="mt-5">
            <Button>Load More</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingTimeline;
