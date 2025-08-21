import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ResultItem = { name: string; emoji: string; slot: number; angle: number };

interface LuckyTimeState {
  isOpen: boolean;
  isSpinning: boolean;
  betAmount: number;
  minBetAmount?: number;
  maxBetAmount?: number;
  luckyTimeResults?: string[];
  winKey?: string;
  spinId: number;
  durationMs: number;
  forceIndex?: number | null;
  results: string[];
  last?: ResultItem | null;
}

const initialState: LuckyTimeState = {
  isOpen: false,
  isSpinning: false,
  betAmount: 0,
  minBetAmount: 1, // Example minimum bet amount
  maxBetAmount: 500, // Example maximum bet amount
  luckyTimeResults: [],
  winKey: undefined, // This can be used to force re-rendering of components when
  spinId: 0,
  durationMs: 6000,
  forceIndex: null,
  results: [],
  last: null,
};

const luckyTimeSlice = createSlice({
  name: "luckyTime",
  initialState,
  reducers: {
    requestSpin: (
      state,
      action: PayloadAction<
        { durationMs?: number; forceIndex?: number | null } | undefined
      >
    ) => {
      // external caller will dispatch this to start a spin
      state.spinId += 1;
      if (action?.payload?.durationMs)
        state.durationMs = action.payload.durationMs;
      state.forceIndex =
        typeof action?.payload?.forceIndex === "number"
          ? action.payload.forceIndex
          : null;
    },
    spinStarted: (state) => {
      state.isSpinning = true;
    },
    spinFinished: (state, action: PayloadAction<ResultItem>) => {
      state.isSpinning = false;
      state.last = action.payload;
      state.results = [
        `${action.payload.emoji} ${action.payload.name}`,
        ...state.results,
      ];
    },

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

    setWinKey: (state, action) => {
      state.winKey = action.payload;
    },

    // kept for backward-compat if other parts use it:
    setLuckyTimeResults: (state, action: PayloadAction<string[]>) => {
      state.results = action.payload;
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
  requestSpin,
  spinStarted,
  spinFinished,
} = luckyTimeSlice.actions;

export default luckyTimeSlice.reducer;
