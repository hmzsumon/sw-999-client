import { apiSlice } from '../api/apiSlice';

export const tradeApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getTrades: builder.query({
			query: () => '/trades',
			providesTags: ['Trade'],
		}),

		// create trade
		createTrade: builder.mutation({
			query: (body) => ({
				url: '/trade',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Trade', 'User'],
		}),

		// update trade
		updateTrade: builder.mutation({
			query: (body) => ({
				url: '/update/trade',
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['Trade', 'User'],
		}),

		// my trades
		myTrades: builder.query({
			query: () => '/my/trades',
			providesTags: ['Trade'],
		}),

		// get trade round history
		getTradeRoundHistory: builder.query({
			query: () => '/trade-round-history',
			providesTags: ['Trade'],
		}),

		// place prediction
		placePrediction: builder.mutation<void, any>({
			query: (body) => ({
				url: '/place-prediction',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Trade', 'User'],
		}),

		// get trade round history by symbol and time period
		getTradeRoundHistoryBySymbol: builder.query({
			query: ({ symbol, timePeriod, page = 1, limit = 10 }) =>
				`/trade-round-history-by-symbol?symbol=${symbol}&timePeriod=${timePeriod}&page=${page}&limit=${limit}`,
			providesTags: ['Trades'],
		}),

		// get active trade round by symbol and time period
		getActiveTradeRoundBySymbol: builder.query({
			query: ({ symbol, timePeriod }) =>
				`/active-trade-round?symbol=${symbol}&timePeriod=${timePeriod}`,
			providesTags: ['Trade'],
		}),

		// get my trade round history by symbol and time period
		getMyTradeRoundHistory: builder.query({
			query: () => `/my-trade-history`,
			providesTags: ['Trade'],
		}),
	}),
});

export const {
	useGetTradesQuery,
	useCreateTradeMutation,
	useUpdateTradeMutation,
	useMyTradesQuery,
	useGetTradeRoundHistoryQuery,
	usePlacePredictionMutation,
	useGetTradeRoundHistoryBySymbolQuery,
	useGetActiveTradeRoundBySymbolQuery,
	useGetMyTradeRoundHistoryQuery,
} = tradeApi;
