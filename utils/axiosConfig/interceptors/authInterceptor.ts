// "use server";
import {AxiosRequestHeaders} from 'axios';
import {cookies as nextCookies} from 'next/headers';

interface HeadersDefaults {
  headers: AxiosRequestHeaders;
  url: string;
}

const authInterceptor = async (config: HeadersDefaults) => {
  const token = (await nextCookies()).get('token')?.value;
  const refreshToken = (await nextCookies()).get('refresh_token')?.value;
  const accessToken = (await nextCookies()).get('access_token')?.value;
  if (token) {
    if (config?.url === 'auth/refreshToken') {
      config.headers['x-refreshtoken'] = `${refreshToken}`;
    } else if (config?.url === 'auth/changePassword') {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
};
export default authInterceptor;
