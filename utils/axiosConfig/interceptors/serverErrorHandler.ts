/* eslint-disable @typescript-eslint/no-explicit-any */
export default function serverErrorHandler(error: any) {
  return {
    status: error?.response?.status,
    message: error?.response?.data?.message
      ? error?.response?.data?.message
      : error?.response?.statusText,
    success: false
  };
}
