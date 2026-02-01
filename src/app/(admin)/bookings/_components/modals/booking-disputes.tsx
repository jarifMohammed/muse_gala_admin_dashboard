import { Button } from "@/components/ui/button";
import React from "react";

const BookingDisputes = () => {
  return (
    <div className="mt-5">
      <div className="border border-gray-200 p-5 rounded-lg shadow-sm">
        <h1 className="text-xl mb-4">Dispute Time Line</h1>

        <div className="text-sm space-y-2">
          <h3>Apr 12, 2025: Dispute Opened </h3>
          <h3>Apr 12, 2025: Action 1 </h3>
          <h3>Apr 12, 2025: Action 2</h3>

          <div className="mt-5">
            <Button>View</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDisputes;
