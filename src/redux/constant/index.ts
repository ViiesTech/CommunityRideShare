export const baseUrl: string = 'https://communityrideshare.apiforapp.link/';

export const GOOGLE_MAPS_API_KEY: string = 'AIzaSyBo9dxkNGicZXZnwVMNVqkmye720rzmMRQ';

interface Endpoints {
  register: string;
  verifyAccount: string;
  login: string;
  forgetPassword: string;
  createCommunity: string;
  getCommunityById: string;
  getMe: string;
  verifyResetOtp: string;
  resendResetOtp: string;
  resetPassword: string;
  updateProfile: string;
  browsePublicCommunities: string;
  joinCommunityRequest: string;
  cancelCommunityRequest: string;
  joinCommunityByCode: string;
  manageJoinRequest: string;
  searchRides: string;
  offerRide: string;
  getMyRides: string;
  bookRide: string;
}

export const endpoints: Endpoints = {
  register: 'api/v1/auth/register',
  verifyAccount: 'api/v1/auth/verify',
  login: 'api/v1/auth/login',
  forgetPassword: 'api/v1/auth/forgot-password',
  verifyResetOtp: 'api/v1/auth/verify-reset-otp',
  resendResetOtp: 'api/v1/auth/resend-otp',
  resetPassword: 'api/v1/auth/reset-password',
  updateProfile: 'api/v1/auth/profile',
  createCommunity: 'api/v1/community',
  getCommunityById: 'api/v1/community',
  browsePublicCommunities: 'api/v1/community/public',
  getMe: 'api/v1/auth/me',
  joinCommunityRequest: 'api/v1/community/:communityId/request',
  cancelCommunityRequest: 'api/v1/community/:communityId/request',
  joinCommunityByCode: 'api/v1/community/join',
  manageJoinRequest: 'api/v1/community/:communityId/requests/:targetUserId',
  searchRides: 'api/v1/rides/search',
  offerRide: 'api/v1/rides',
  getMyRides: 'api/v1/rides/my',
  bookRide: 'api/v1/rides/:rideId/book',
};
