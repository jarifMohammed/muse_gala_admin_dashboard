import { Button } from "@/components/ui/button";
import React from "react";

const BookingPayment = () => {
  return (
    <div className="mt-5 space-y-5">
      <div className="border border-gray-200 p-5 rounded-lg shadow-sm">
        <h1 className="text-xl mb-4">Customer Payment</h1>

        <div className="text-sm space-y-2">
          <h3>Method: Visa ending 1234</h3>
          <h3>Amount: $150</h3>
          <h3>Status: Paid</h3>
          <h3>Dress Name: Zimmermann Silk Gown</h3>
          <h3>Payout: Pending </h3>

          <div className="mt-5 space-x-5">
            <Button>View Payment History</Button>
            <Button variant="outline">Process Refund</Button>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 p-5 rounded-lg shadow-sm">
        <h1 className="text-xl mb-4">Lenders Payout</h1>

        <div className="text-sm space-y-2">
          <h3>Method: Visa ending 1234</h3>
          <h3>Amount: $150</h3>
          <h3>Status: Paid</h3>
          <h3>Dress Name: Zimmermann Silk Gown</h3>
          <h3>Payout: Pending </h3>

          <div className="mt-5 space-x-5">
            <Button>View Payment History</Button>
            <Button variant="outline">Process Refund</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPayment;
