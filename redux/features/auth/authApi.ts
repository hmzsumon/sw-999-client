import { apiSlice } from '../api/apiSlice';
import { setUser, logoutUser, loadUser } from './authSlice';
export interface IUser {
	user: any;
	token: string;
	success: boolean;
	data: {
		_id: string;
		name: string;
		email: string;
		role: string;
		createdAt: string;
		updatedAt: string;
	};
}
export const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// get users from api with typescript
		getUsers: builder.query<any, void>({
			query: () => '/users',
			providesTags: ['Users'],
		}),

		// get verify code for register
		getVerifyCodeForRegister: builder.mutation<any, any>({
			query: (body) => ({
				url: '/get-verify-code-for-register',
				method: 'POST',
				body,
			}),
		}),

		// verify code for registration
		verifyCodeForRegister: builder.mutation<any, any>({
			query: (body) => ({
				url: '/verify-code-for-register',
				method: 'POST',
				body,
			}),
		}),

		// register user
		registerUser: builder.mutation<IUser, any>({
			query: (body) => ({
				url: '/register',
				method: 'POST',
				body,
			}),
		}),

		// verify email
		verifyEmail: builder.mutation<any, any>({
			query: (body) => ({
				url: '/verify-email',
				method: 'POST',
				body,
				delay: 30000,
			}),
			invalidatesTags: ['User'],
		}),

		// login user
		loginUser: builder.mutation<IUser, any>({
			query: (body) => ({
				url: '/login',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['User'],
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;
					dispatch(setUser(result.data));
				} catch (error) {
					error as any;
				}
			},
		}),

		// get user by token._id from cookie
		loadUser: builder.query<any, void>({
			query: () => ({
				url: '/load-user',
				method: 'GET',
			}),
			providesTags: ['User'],
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;
					dispatch(loadUser(result.data));
				} catch (error) {
					// diclear error type
					error as any;
				}
			},
		}),

		// logout user
		logoutUser: builder.mutation({
			query: () => ({
				url: `/logout`,
				method: 'POST',
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;
					dispatch(logoutUser());
				} catch (error) {
					console.log(error);
				}
			},
		}),

		// resend verification email
		resendVerificationEmail: builder.mutation<IUser, any>({
			query: (body) => ({
				url: '/resend-email-verification',
				method: 'POST',
				body,
			}),
		}),

		// check if user is exist by email
		checkUserByEmail: builder.mutation<IUser, any>({
			query: (body) => ({
				url: '/check-user-by-email',
				method: 'POST',
				body,
			}),
		}),

		// change email
		changeEmail: builder.mutation<IUser, any>({
			query: (body) => ({
				url: '/change-email',
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['User'],
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;
					dispatch(logoutUser());
				} catch (error) {
					console.log(error);
				}
			},
		}),

		// verify code for change email
		verifyCodeForChangeEmail: builder.mutation<IUser, any>({
			query: (body) => ({
				url: '/verify-code-for-change-email',
				method: 'POST',
				body,
			}),
		}),

		// get members by level
		getMembersByLevel: builder.query<any, string>({
			query: (level) => `/members-by-level/${level}`,
		}),

		// get 13 level tree
		get13LevelTree: builder.query<any, any>({
			query: () => `/13-level-tree-node`,
		}),

		// find user by email or username
		findUserByEmailOrUsername: builder.mutation<any, any>({
			query: (emailOrUserName) => ({
				url: `/find-user-by-email-username?emailOrUsername=${emailOrUserName}`,
				method: 'PUT',
			}),
		}),

		// get user by partner id
		getUserByPartnerId: builder.query<any, any>({
			query: (partnerId) => ({
				url: `/get-user-by-partner-id/${partnerId}`,
				method: 'GET',
			}),
		}),

		// check email exist or not post request
		checkEmailExistOrNot: builder.mutation<any, any>({
			query: (body) => ({
				url: `/check-email-exist`,
				method: 'POST',
				body,
			}),
		}),

		// my address
		myAddress: builder.query<any, any>({
			query: () => ({
				url: `/my-address`,
				method: 'GET',
			}),
		}),

		// security verify
		securityVerify: builder.mutation<any, any>({
			query: (body) => ({
				url: `/security-verify`,
				method: 'POST',
				body,
			}),
		}),

		// reset password
		resetPassword: builder.mutation<any, any>({
			query: (body) => ({
				url: `/reset-password`,
				method: 'POST',
				body,
			}),
		}),

		// my wallet
		myWallet: builder.query<any, any>({
			query: () => ({
				url: `/my-wallet`,
				method: 'GET',
			}),
		}),

		// get 3 level team data
		get3LevelTeam: builder.query<any, any>({
			query: () => ({
				url: `/get-3-level-user`,
				method: 'GET',
			}),
		}),

		/// get 5 level team data
		get5LevelTeam: builder.query<any, any>({
			query: () => ({
				url: `/get-5-level-user`,
				method: 'GET',
			}),
		}),

		// get my tree node by partner id
		getTreeNode: builder.query<any, any>({
			query: (id) => ({
				url: `/get-tree-node/${id}`,
				method: 'GET',
			}),
		}),

		// find descendants
		findDescendants: builder.query<any, any>({
			query: () => ({
				url: `/find-descendants`,
				method: 'GET',
			}),
		}),

		// get dashboard data
		getDashboard: builder.query<any, any>({
			query: () => ({
				url: `/dashboard-data`,
				method: 'GET',
			}),
		}),

		// security verify
		securityVerify2: builder.mutation<any, any>({
			query: (body) => ({
				url: `/security-verification`,
				method: 'POST',
				body,
			}),
		}),

		// check agent name
		checkAgentName: builder.mutation<any, any>({
			query: (body) => ({
				url: `/check-agent-name`,
				method: 'POST',
				body,
			}),
		}),

		// update mobile number
		updateMobileNumber: builder.mutation<any, any>({
			query: (body) => ({
				url: `/update-mobile`,
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['User'],
		}),

		// update address
		updateAddress: builder.mutation<any, any>({
			query: (body) => ({
				url: `/update-address`,
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['User'],
		}),

		// check old password
		checkOldPassword: builder.mutation<any, any>({
			query: (body) => ({
				url: `/check-old-password`,
				method: 'POST',
				body,
			}),
		}),

		// check old pin
		checkOldPin: builder.mutation<any, any>({
			query: (body) => ({
				url: `/check-old-pass-code`,
				method: 'POST',
				body,
			}),
		}),

		// update pin
		updatePin: builder.mutation<any, any>({
			query: (body) => ({
				url: `/update-pass-code`,
				method: 'PATCH',
				body,
			}),
			invalidatesTags: ['User'],
		}),

		// send new pin email
		sendNewPinEmail: builder.mutation<any, any>({
			query: (body) => ({
				url: `/send-pass-code`,
				method: 'POST',
				body,
			}),
		}),

		// check user by custom id
		checkUserByCustomId: builder.query<any, any>({
			query: (id) => ({
				url: `/check-user-by-customer-id/${id}`,
				method: 'GET',
			}),
		}),
		/* ────────── add user payment method ────────── */
		addUserPaymentMethod: builder.mutation<any, any>({
			query: (body) => ({
				url: `/add-user-payment-method`,
				method: 'POST',
				body,
			}),

			invalidatesTags: ['User'],
		}),

		/* ────────── get user payment methods ────────── */
		getUserPaymentMethods: builder.query<any, any>({
			query: () => ({
				url: `/get-user-payment-methods`,
				method: 'GET',
			}),
		}),
	}),
});

export const {
	useGetVerifyCodeForRegisterMutation,
	useVerifyCodeForRegisterMutation,
	useGetUsersQuery,
	useRegisterUserMutation,
	useVerifyEmailMutation,
	useLoginUserMutation,
	useLogoutUserMutation,
	useResendVerificationEmailMutation,
	useCheckUserByEmailMutation,
	useLoadUserQuery,
	useChangeEmailMutation,
	useVerifyCodeForChangeEmailMutation,
	useGetMembersByLevelQuery,
	useGet13LevelTreeQuery,
	useFindUserByEmailOrUsernameMutation,
	useGetUserByPartnerIdQuery,
	useCheckEmailExistOrNotMutation,
	useMyAddressQuery,
	useSecurityVerifyMutation,
	useResetPasswordMutation,
	useMyWalletQuery,
	useGet3LevelTeamQuery,
	useGet5LevelTeamQuery,
	useGetTreeNodeQuery,
	useFindDescendantsQuery,
	useGetDashboardQuery,
	useSecurityVerify2Mutation,
	useCheckAgentNameMutation,
	useUpdateMobileNumberMutation,
	useUpdateAddressMutation,
	useCheckOldPasswordMutation,
	useCheckOldPinMutation,
	useUpdatePinMutation,
	useSendNewPinEmailMutation,
	useLazyCheckUserByCustomIdQuery,
	useAddUserPaymentMethodMutation,
	useGetUserPaymentMethodsQuery,
} = authApi;
