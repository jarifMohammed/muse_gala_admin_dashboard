import { create } from "zustand";

interface IFilterBooking {
  search: string;
  setSearch: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
}

const initialStates = {
  search: "",
  date: "",
};

export const useFilterBooking = create<IFilterBooking>((set) => ({
  ...initialStates,
  setSearch: (value: string) => set({ search: value }),
  setDate: (value: string) => set({ date: value }),
}));
