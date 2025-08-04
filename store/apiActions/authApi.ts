import { generateUniqueId } from '../../utils/CommonService';
import axios from '../../utils/axiosConfig';

export const getToken = (body: any) => axios.post('/wp-json/jwt-auth/v1/token', body);

export const getSetupAccountApi = (body: any) => axios.post('/wp-json/wp/v2/users/setup-account', body);

export const logoutApi = () => axios.post('/wp-json/wp/v2/users/logout');

export const forgotPasswordApi = (body: any) => axios.post('/wp-json/wp/v2/users/reset-password', body);

export const resetPasswordApi = (body: any) => axios.post('/wp-json/wp/v2/users/change-password', body);

export const getUserDetailsApi = (params: any) => axios.get('/wp-json/wp/v2/users/setup-account', { params });

export const ChangePasswordApi = (body: any) => axios.post('/wp-json/wp/v2/users/change-password', body);

export const getProfilePicApi = (body: any, id: number) => axios.post(`/wp-json/wp/v2/users/profile-photo/${id}`, body);

export const retrieveMeApi = () => axios.get('/wp-json/wp/v2/users/me', { params: { cache: generateUniqueId() } });

export const getAllCondition = (data : any) => axios.get('/wp-json/wp/v2/static-page', { params: { page_name: data , cache : generateUniqueId() } });

export const AcceptTermsApi = (body: any,id:any) => axios.post(`/wp-json/wp/v2/user/accept-term-policy/${id}`, body);

export const sendOtpApi = (body:any) => axios.post(`/wp-json/wp/v2/send-otp/`,body);

export const verifyOtpApi = (body:any) => axios.post(`/wp-json/wp/v2/verify-otp/`,body);

