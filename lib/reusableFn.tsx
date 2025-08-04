import {Eye, EyeOff, Loader2} from 'lucide-react';

export const submitBtnContentFn = (
  btnLoader: any,
  defaultText: string,
  loadingText: string
) => {
  if (btnLoader) {
    return (
      <>
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        {loadingText}
      </>
    );
  } else {
    return defaultText;
  }
};

export const showPasswordFn = (showFlag: any) => {
  if (showFlag) {
    return 'text';
  } else {
    return 'password';
  }
};

export const toggleIconFn = (toggleFlag: any) => {
  if (toggleFlag) {
    return <EyeOff size={18} />;
  } else {
    return <Eye size={18} />;
  }
};
