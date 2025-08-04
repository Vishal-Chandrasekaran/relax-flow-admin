'use client';
import {forError} from '../../CommonService';

interface ErrorType {
  message: string;
  status: number;
  success: boolean;
}

export default function clientErrorHandler(error: ErrorType) {
  const message = error?.message
    ? error.message
    : 'Seems like something went wrong!';
  switch (error.status) {
    case 400:
      forError(message);
      break;
    case 401:
      forError(message);
      break;
    case 500:
      forError(message);
      break;
    case 504:
      forError(
        'Sorry, could not access the external resource to refine the data for your request, please try again later!'
      );
      break;
    case 700:
      forError(message);
      break;
    default:
      forError(message ? message : 'something went wrong');
      break;
  }
  return error;
}
