// src/store/slices/licenseSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LicenseType } from "../types/Worker";

interface LicenseState {
  licenseTypes: LicenseType[];
}

const initialState: LicenseState = {
  licenseTypes: [],
};

const licenseSlice = createSlice({
  name: "license",
  initialState,
  reducers: {
    setLicenseTypes(state, action: PayloadAction<LicenseType[]>) {
      state.licenseTypes = action.payload;
    },
    addLicenseType(state, action: PayloadAction<LicenseType>) {
      state.licenseTypes.push(action.payload);
    },
    updateLicenseType(state, action: PayloadAction<LicenseType>) {
      state.licenseTypes = state.licenseTypes.map((lt) =>
        lt.id === action.payload.id ? action.payload : lt
      );
    },
    deleteLicenseType(state, action: PayloadAction<number>) {
      state.licenseTypes = state.licenseTypes.filter(
        (lt) => lt.id !== action.payload
      );
    },
  },
});

export const {
  setLicenseTypes,
  addLicenseType,
  updateLicenseType,
  deleteLicenseType,
} = licenseSlice.actions;
export default licenseSlice.reducer;
