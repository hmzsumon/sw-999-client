import { createSlice } from "@reduxjs/toolkit";

interface LuckyTimeState {
  isOpen: boolean;
  isSpinning: boolean;
  betAmount: number;
  minBetAmount?: number;
  maxBetAmount?: number;
  luckyTimeResults?: string[];
  winKey?: string;
}

const initialState: LuckyTimeState = {
  isOpen: false,
  isSpinning: false,
  betAmount: 0,
  minBetAmount: 1, // Example minimum bet amount
  maxBetAmount: 500, // Example maximum bet amount
  luckyTimeResults: [],
  winKey: undefined, // This can be used to force re-rendering of components when
};

const luckyTimeSlice = createSlice({
  name: "luckyTime",
  initialState,
  reducers: {
    openLuckyTime: (state) => {
      state.isOpen = true;
    },
    closeLuckyTime: (state) => {
      state.isOpen = false;
    },
    startSpinning: (state) => {
      state.isSpinning = true;
    },
    stopSpinning: (state) => {
      state.isSpinning = false;
    },
    setBetAmount: (state, action) => {
      state.betAmount = action.payload;
    },
    setMinBetAmount: (state, action) => {
      state.minBetAmount = action.payload;
    },
    setMaxBetAmount: (state, action) => {
      state.maxBetAmount = action.payload;
    },

    setLuckyTimeResults: (state, action) => {
      state.luckyTimeResults = action.payload;
    },
    setWinKey: (state, action) => {
      state.winKey = action.payload;
    },
  },
});

export const {
  openLuckyTime,
  closeLuckyTime,
  startSpinning,
  stopSpinning,
  setBetAmount,
  setMinBetAmount,
  setMaxBetAmount,
  setLuckyTimeResults,
  setWinKey,
} = luckyTimeSlice.actions;

export default luckyTimeSlice.reducer;
