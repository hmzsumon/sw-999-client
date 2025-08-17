import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/redux/baseQueryWithReauth';

export const apiSlice = createApi({
	reducerPath: 'api',

	baseQuery: baseQueryWithReauth,
	tagTypes: [
		'Users',
		'Admin',
		'Pxc',
		'Wallet',
		'Transactions',
		'User',
		'Withdraw',
		'Withdraws',
		'MyWithdraws',
		'Mining',
		'Deposits',
		'Notification',
		'Notifications',
		'Package',
		'Transaction',
		'Trade',
		'Trades',
		'Transfer',
	],
	endpoints: (builder) => ({}),
});
