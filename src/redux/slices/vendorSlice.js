import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vendor: JSON.parse(localStorage.getItem("vendor")) || null, // Lấy vendor từ localStorage
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setVendor: (state, action) => {
      state.vendor = action.payload;
      localStorage.setItem("vendor", JSON.stringify(action.payload));
    },
    clearVendor: (state) => {
      state.vendor = null;
      localStorage.removeItem("vendor");
    },
  },
});

export const { setVendor, clearVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
