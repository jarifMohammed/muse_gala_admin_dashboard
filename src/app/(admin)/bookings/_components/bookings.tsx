"use client";
import BookingsHeader from "./BookingsHeader";
import SearchBookings from "./search-bookings";
import BookingsTable from "./bookings-table";
import { useState } from "react";
import { useFilterBooking } from "./states/useFilterBooking";
import { useQuery } from "@tanstack/react-query";

const Bookings = ({ token }: { token: string }) => {
  const [page, setPage] = useState(1);
  const { search, date } = useFilterBooking();

  const {
    data: bookingsData = {},
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["all-bookings", page, search, date],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/overview/dashboard/bookings/stats?page=${page}&search=${search}&date=${date}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      return json.data;
    },
    enabled: !!token,
  });

  const bookings = bookingsData.bookings || [];
  const paginationInfo = {
    currentPage: page,
    totalPages: Math.ceil(bookingsData.totalBookings / 10),
    totalData: bookingsData.totalBookings,
    hasPrevPage: page > 1,
    hasNextPage: bookings.length === 10,
  };

  return (
    <div>
      <BookingsHeader bookings={bookingsData} />
      <SearchBookings />
      <BookingsTable 
        token={token}
        bookings={bookings}
        paginationInfo={paginationInfo}
        isLoading={isLoading}
        isFetching={isFetching}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default Bookings;