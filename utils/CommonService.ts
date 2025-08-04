/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'react-toastify';
import { BehaviorSubject } from 'rx';

export const forSuccess = (message: string, id?: string) =>
  toast.success(message, { autoClose: 3000, toastId: id ?? 1 });

export const forError = (message: string, id?: string) =>
  toast.error(message, { autoClose: 3000, toastId: id ?? 1 });

export const forWarning = (message: string, id?: string) =>
  toast.warning(message, { autoClose: 3000, toastId: id ?? 1 });

export const isDialogOpen = new BehaviorSubject<any>({
  open: false,
  data: { message: 'Are you Sure?', title: '' },
  cancelText: 'Cancel',
  confirmText: 'Okay',
  onConfirm: () => { },
});

export function ternaryFunction (conditionParameter:any,ifParameter:any,elseParameter:any) {
  if(conditionParameter){
    return ifParameter;
  } else {
    return elseParameter;
  }
}

export const  generateUUID = () => {
  let dt = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (ternaryFunction(c === 'x',r,(r&0x3|0x8))).toString(16);
  });
};

const ninetySeven = 97;
export const indexToLetter = (index: number) => String.fromCharCode(ninetySeven + index);

export function generateUniqueId(prefix = 'id') {
  // Generate a random number and convert it to a base36 string
  const thirtySix = 36;
  const randomString = Math.random().toString(thirtySix).substring(2);
  // Create a unique ID by combining the prefix and random string
  return `${prefix}-${randomString}`;
}

export function generateUniqueNumber() {
  // Gets the current time in milliseconds
  const timestamp = Date.now();
  // Generates a random decimal number between 0 and 1
  const randomComponent = Math.random();
  // Combines and converts them into a unique number
  return Number(`${timestamp}${Math.floor(randomComponent * 1000)}`);
}

export const randomNumber = Math.floor((Math.random() * 1000) + 1);

export const validateFile = (file: File) => {
  if (!(file.type.startsWith('image/') || file.type === 'application/pdf' || file.type.startsWith('video/'))) {
    forError('Unsupported file type.', 'error');
    return false;
  }
  if (file.type.startsWith('video/') && file.size > 10 * 1024 * 1024) {
    forError('Media size exceeds 10MB limit.', 'error');
    return false;
  }
  if (file.type === 'application/pdf' && file.size > 1 * 1024 * 1024) {
    forError('PDF size exceeds 1MB limit.', 'error');
    return false;
  }
  return true;
};

export const readFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
      reader.onload = () => resolve({ type: file.type, url: reader.result, file });
       reader.onerror = () => reject(new Error('Error occurred while reading the file.'));
    reader.readAsDataURL(file);
  });
};
