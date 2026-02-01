import { Button } from "@/components/ui/button";
import React from "react";

const PlatformPolicyFlags = () => {
  return (
    <div className="mt-5">
      <div className="border border-gray-200 p-5 rounded-lg shadow-sm">
        <div className="text-sm space-y-2">
          <h3>Insurance Applied: Yes</h3>
          <h3>Eligible for Auto Payout: Yes</h3>

          <div className="bg-black text-white p-4 rounded-lg">
            <h1 className="font-semibold">
              Dispute qualifies for minor damage under insurance. $30 payout
              recommended.
            </h1>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 p-5 rounded-lg shadow-sm mt-10">
        <h1 className="text-xl font-semibold mb-4">Actions</h1>

        <div className="text-sm flex items-center gap-5">
          <Button>Save Changes</Button>
          <Button variant="outline">Submit Resolution</Button>
          <Button variant="outline">Download Report</Button>
          <Button variant="outline">Refund</Button>
        </div>
      </div>
    </div>
  );
};

export default PlatformPolicyFlags;
