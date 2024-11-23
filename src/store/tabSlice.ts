import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Definicja typu dla zakładki
export type Tab =
  | "driving_license"
  | "payroll_details"
  | "driver_card"
  | "employment";

interface TabState {
  activeTab: Tab;
}

// Domyślny stan
const initialState: TabState = {
  activeTab: 'payroll_details',
};

const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<Tab>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = tabSlice.actions;
export default tabSlice.reducer;
