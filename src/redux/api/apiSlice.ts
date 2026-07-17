import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl, endpoints } from '../constant';

// Official RTK Query setup
export const apiSlice = createApi({
  reducerPath: 'api',
  // 🔥 cache behavior
  refetchOnFocus: true,
  refetchOnReconnect: true,
  keepUnusedDataFor: 60 * 60, // 1 hour

  tagTypes: ['Community', 'Profile'],
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    // prepareHeaders is useful for adding the authorization token automatically
    prepareHeaders: (headers, { getState }) => {
      // Access the token from the root state
      const state = getState() as any;
      const token = state.auth?.authToken;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // This is where all endpoints will be defined
  endpoints: (builder) => ({
    // login mutation
    login: builder.mutation<any, any>({
      query: (credentials) => ({
        url: endpoints.login,
        method: 'POST',
        body: credentials,
      }),
    }),
    // verify mutation
    verifyAccount: builder.mutation<any, any>({
      query: (data) => ({
        url: endpoints.verifyAccount,
        method: 'POST',
        body: data,
      }),
    }),
    // register mutation
    register: builder.mutation<any, any>({
      query: (credentials) => ({
        url: endpoints.register,
        method: 'POST',
        body: credentials,
      }),
    }),
    // createCommunity mutation
    createCommunity: builder.mutation<any, any>({
      query: (data) => ({
        url: endpoints.createCommunity,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Community'],
    }),
    // forgetPassword mutation
    forgetPassword: builder.mutation<any, { email: string }>({
      query: (data) => ({
        url: endpoints.forgetPassword,
        method: 'POST',
        body: data,
      }),
    }),
    verifyResetOtp: builder.mutation<any, { email: string }>({
      query: (data) => ({
        url: endpoints.verifyResetOtp,
        method: 'POST',
        body: data,
      }),
    }),
    resendResetOtp: builder.mutation<any, { email: string, type: string }>({
      query: (data) => ({
        url: endpoints.resendResetOtp,
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<any, { email: string, newPassword: string, confirmPassword: string }>({
      query: (data) => ({
        url: endpoints.resetPassword,
        method: 'POST',
        body: data,
      }),
    }),
    updateProfile: builder.mutation<any, FormData>({
      query: (data) => ({
        url: endpoints.updateProfile,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    getCommunityById: builder.query<any, string>({
      query: (id) => `${endpoints.getCommunityById}/${id}`,
      transformResponse: (response: any) => {
        // console.log('getCommunityById response:', response);
        return response.data.community;
      },
      providesTags: ['Community'],
    }),
    browsePublicCommunities: builder.query<any, { limit?: number; cursor?: string }>({
      query: ({ limit = 20, cursor }) => ({
        url: endpoints.browsePublicCommunities,
        params: {
          limit,
          ...(cursor ? { cursor } : {}),
        },
      }),
    }),
    getMe: builder.query<any, void>({
      query: () => endpoints.getMe,
      transformResponse: (response: any) => {
        return response.data.user;
      },
      providesTags: ['Profile'],
    }),
    joinCommunityRequest: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: endpoints.joinCommunityRequest.replace(':communityId', id),
        method: 'POST',
      }),
      invalidatesTags: ['Community'],
    }),
    cancelCommunityRequest: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: endpoints.cancelCommunityRequest.replace(':communityId', id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Community'],
    }),
    joinCommunityByCode: builder.mutation<any, { inviteCode: string }>({
      query: (body) => ({
        url: endpoints.joinCommunityByCode,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Community', 'Profile'],
    }),
    manageJoinRequest: builder.mutation<any, { communityId: string; targetUserId: string; action: 'approve' | 'reject' }>({
      query: ({ communityId, targetUserId, action }) => ({
        url: endpoints.manageJoinRequest
          .replace(':communityId', communityId)
          .replace(':targetUserId', targetUserId),
        method: 'PATCH',
        body: { action },
      }),
      invalidatesTags: ['Community'],
    }),
  }),
});

// Export the auto-generated hooks
export const { useRegisterMutation,
  useLoginMutation, useVerifyAccountMutation,
  useCreateCommunityMutation, useGetCommunityByIdQuery,
  useForgetPasswordMutation, useVerifyResetOtpMutation,
  useResendResetOtpMutation, useResetPasswordMutation,
  useUpdateProfileMutation, useGetMeQuery,
  useBrowsePublicCommunitiesQuery,
  useJoinCommunityRequestMutation,
  useCancelCommunityRequestMutation,
  useJoinCommunityByCodeMutation,
  useManageJoinRequestMutation
} = apiSlice;
