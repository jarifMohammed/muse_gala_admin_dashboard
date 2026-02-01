import { Booking } from "../bookings-modal";

const BookingSummery = ({ bookingDetails }: { bookingDetails?: Booking }) => {
  return (
    <div className="mt-5">
      <div className="border border-gray-200 p-5 rounded-lg shadow-sm">
        <h1 className="text-xl mb-4">Booking Summary</h1>

        <div className="text-sm space-y-2">
          <h3>Booking ID: {bookingDetails?._id}</h3>
          <h3>
            Customer Name: {bookingDetails?.customer?.firstName}{" "}
            {bookingDetails?.customer?.lastName}
          </h3>
          <h3>
            Lender Name: {bookingDetails?.allocatedLender?.lenderId?.firstName}{" "}
             {bookingDetails?.allocatedLender?.lenderId?.lastName}
          </h3>
          <h3>Dress Name: {bookingDetails?.dressName}</h3>
          {bookingDetails?.createdAt && (
            <h3>
              Booking Date:
              {new Date(bookingDetails.createdAt).toLocaleDateString()}
            </h3>
          )}
          <h3>
            <span>Status: </span>
            {bookingDetails?.statusHistory?.map((status) => (
              <span
                key={status?._id}
                className={`${
                  status?.status === "Pending" && "text-orange-600"
                }`}
              >
                {status?.status}
              </span>
            ))}
          </h3>
          <h3>Amount: $ {bookingDetails?.totalAmount}</h3>
        </div>
      </div>
    </div>
  );
};

export default BookingSummery;
