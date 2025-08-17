import { createSlice } from '@reduxjs/toolkit';

interface TradeState {
	symbol: string;
	isTradeDrawerOpen: boolean;
	currentRound: any | null;
	predict?: string;
	tradeDuration: string;
	tradeLoading?: boolean;
	kline?: boolean;
	currentRounds: {
		[key: string]: {
			[symbol: string]: any;
		};
	};
}

const initialState: TradeState = {
	symbol: 'BTCUSDT',
	isTradeDrawerOpen: false,
	currentRound: null,
	predict: undefined,
	tradeDuration: '3m',
	tradeLoading: true,
	kline: true,
	currentRounds: {
		'1m': {},
		'3m': {},
		'5m': {},
		'15m': {},
		'30m': {},
	},
};

export const tradeSlice = createSlice({
	name: 'trade',
	initialState,
	reducers: {
		setSymbol: (state, action) => {
			state.symbol = action.payload;
		},
		setTradeDrawerOpen: (state, action) => {
			state.isTradeDrawerOpen = action.payload;
		},
		setCurrentRound: (state, action) => {
			state.currentRound = action.payload;
		},
		setPredict: (state, action) => {
			state.predict = action.payload;
		},
		setTradeDuration: (state, action) => {
			state.tradeDuration = action.payload;
		},
		setTradeLoading: (state, action) => {
			state.tradeLoading = action.payload;
		},
		setKline: (state) => {
			state.kline = !state.kline;
		},

		// ✅ NEW: Update by timePeriod + symbol
		setCurrentRoundByTimeAndSymbol: (state, action) => {
			const { timePeriod, symbol, round } = action.payload;

			if (!state.currentRounds) state.currentRounds = {};

			if (!state.currentRounds[timePeriod]) {
				state.currentRounds[timePeriod] = {};
			}

			state.currentRounds[timePeriod][symbol] = round;
		},
	},
});

export const {
	setSymbol,
	setTradeDrawerOpen,
	setCurrentRound,
	setPredict,
	setTradeDuration,
	setTradeLoading,
	setKline,
	setCurrentRoundByTimeAndSymbol, // export new action
} = tradeSlice.actions;

export default tradeSlice.reducer;
