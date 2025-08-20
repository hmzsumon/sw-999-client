import { createSlice } from "@reduxjs/toolkit";

interface FruitLoopsState {
  isOpen: boolean;
  isSpinning: boolean;
  betAmount: number;
  minBetAmount?: number;
  maxBetAmount?: number;
  fruitLoopsResults?: string[];
  winKey?: string;
}

const initialState: FruitLoopsState = {
  isOpen: false,
  isSpinning: false,
  betAmount: 0,
  minBetAmount: 1, // Example minimum bet amount
  maxBetAmount: 500, // Example maximum bet amount
  fruitLoopsResults: [],
  winKey: undefined, // This can be used to force re-rendering of components when
};

const fruitLoopsSlice = createSlice({
  name: "fruitLoops",
  initialState,
  reducers: {
    openFruitLoops: (state) => {
      state.isOpen = true;
    },
    closeFruitLoops: (state) => {
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

    setFruitLoopsResults: (state, action) => {
      state.fruitLoopsResults = action.payload;
    },
    setWinKey: (state, action) => {
      state.winKey = action.payload;
    },
  },
});

export const {
  openFruitLoops,
  closeFruitLoops,
  startSpinning,
  stopSpinning,
  setBetAmount,
  setMinBetAmount,
  setMaxBetAmount,
  setFruitLoopsResults,
  setWinKey,
} = fruitLoopsSlice.actions;
export default fruitLoopsSlice.reducer;
