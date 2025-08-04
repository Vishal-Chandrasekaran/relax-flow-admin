import {AxiosResponse} from 'axios';
import errorHandler from './clientErrorHandler';

const successHandler = (response: AxiosResponse) => {
  if (!response.data) {
    return errorHandler(response.data);
  }
  return response.data;
};

export default successHandler;
