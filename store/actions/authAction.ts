/* eslint-disable no-unreachable */
import { AppDispatch } from "../store";
import * as auth from "../reducers/authReducer";
import * as authApi from '../apiActions/authApi'
import { ROUTES_PATH } from "../../utils/constant";
import Cookies from "js-cookie";
import { forSuccess } from "../../utils/CommonService";

export const refreshToken = async (dispatch: AppDispatch) => {
  try {
    // let res: any = await Api.getToken();
    // if (res) {
    //   dispatch(
    //     auth.login({
    //       access_token: res.token,
    //       refresh_token: "asdasdasd",
    //     })
    //   );
    // }
    // return res;
  } catch (err) {
    console.log(err);
  }
}

export const getLoginToken = (body: any) => async (dispatch: AppDispatch) => {
  try {
    localStorage.removeItem('isPhoneVerified');
    let res: any = await authApi.getToken(body);
    if (res) {
      const { token, ...rest } = res;
    }
    return res;
  } catch (err) {
    console.log(err);
  }
}

export const logout = () => async (dispatch: AppDispatch) => {
  try {
    localStorage.removeItem('isPhoneVerified');
    let res: any = await authApi.logoutApi()

    if (res) {
      dispatch(auth.logout());
      window.location.href= ROUTES_PATH.LOGIN
      // forSuccess("Logout successfully.", undefined);
    }
    return true;
  } catch (err) {
    console.log(err);

  }
};




export const forgotPassword = (body: any) => async () => {
  try {
    let res: any = await authApi.forgotPasswordApi(body);
    if (res) {
      return res;
    }
  } catch (err) {
    // forError("We couldn't find an account associated with this email address.", "error");
    console.log(err);
  }
}


export const resetPassword = (body: any) => async () => {
  try {
    let res: any = await authApi.resetPasswordApi(body);
    if (res) {
      return res;
    }
  } catch (err) {
    console.log(err);
  }
}

export const getUserDetails = (params: any) => async () => {
  try {
    let res: any = await authApi.getUserDetailsApi(params);
    if (res.success) {
      return res.data;
    }
  } catch (err) {
    console.log(err);
  }
}
export const getSetupAccount = (body: any) => async () => {
  try {
    let res: any = await authApi.getSetupAccountApi(body);
    if (res) {
      return res;
    }
  } catch (err) {
    console.log(err);
  }
}


export const ChangePassword = (body: any) => async () => {
  ;
  try {
    let res: any = await authApi.ChangePasswordApi(body);
    if (res) {
      return res;
    }
  } catch (err) {
    console.log(err);
  }
}

export const getProfilePic = (body: any, id: number, user: any) => async (dispatch: AppDispatch) => {
  try {
    let res: any = await authApi.getProfilePicApi(body, id);
    if (res) {
      const sessionData = Cookies.get("__session");
      const sessionObj = sessionData ? JSON.parse(sessionData) : null;
      const user = sessionObj?.user;
      const token = sessionObj?.token
      const updatedUser = { ...user, avatar_urls: res?.data?.avatar_urls }
       Cookies.set("__session", JSON.stringify({ token, user: updatedUser }))
      return res;
    }
  } catch (err) {
    console.log(err);
  }
}


export const retrieveMe = () => async (dispatch: AppDispatch) => {
  try {
    let res: any = await authApi.retrieveMeApi();
    if (res) {
    }
    return res;
  } catch (err) {
    console.log(err);
  }
}


export const getTermsCondition = () => async (dispatch: AppDispatch) => {
  try {
    let res: any = await authApi.getAllCondition("terms_conditions");
    return res;
  } catch (err) {
    console.log(err);
  }
}

export const getPrivacyPolicy = () => async (dispatch: AppDispatch) => {
  try {
    let res: any = await authApi.getAllCondition("privacy_policy");
    return res;
  } catch (err) {
    console.log(err);
  }
}

export const getCookies = () => async () => {
  try {
    let res: any = await authApi.getAllCondition('cookies');
    return res;
  } catch (err) {
    console.log(err);
  }
}

export const AcceptTermsPolicy = (body: any,id:any) => async (dispatch: AppDispatch) => {
  ;
  try {
    let res: any = await authApi.AcceptTermsApi(body,id);
    if (res?.success) {
      const session = Cookies.get("__session");
      let sessionUpdate = session ? JSON.parse(session) : ""
      sessionUpdate.user.accepted_terms_policy = true
      Cookies.set("__session", JSON.stringify(sessionUpdate));
      return res;
    }
  } catch (err) {
    console.log(err);
  }
}

export const sendOtp = async(body:any) => {
  try{
    let res:any =  await authApi.sendOtpApi(body);
    if(res?.sms_res?.status) {
      return res;
    }
  } catch(err) {
    console.log(err);
  }
};

export const verifyOtpOnProfile = (body: any) => async (dispatch: AppDispatch) => {
  try {
    let res: any = await authApi.verifyOtpApi(body);
    if (res?.verified) {
          forSuccess(res?.message,'1');
          const session = Cookies.get('__session');
        const sessionUpdate = session ? JSON.parse(session) : "";
        sessionUpdate.user.is_phone_verified = true;
        sessionUpdate.user.user_phone = body.user_phone;
        Cookies.set('__session', JSON.stringify(sessionUpdate));
        return res;
    }
  } catch (err) {
    console.log(err);
  }
};

export const verifyOtpOnSetup = async(body:any,navigateToLogin:any,setupAccBody:any) => {
  try{
    const res:any = await authApi.verifyOtpApi(body);
    if(res?.verified){
      try {
        const setupAccRes: any = await authApi.getSetupAccountApi(setupAccBody);
        forSuccess(res?.message,'1');
        navigateToLogin('/login');
        return setupAccRes;
      } catch (err) {
        console.log(err);
      }
      return res;
    }
  } catch(err) {
    console.log(err);
  }
};


