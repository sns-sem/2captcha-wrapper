import { pollOutRequest, sendInRequest } from "../index";
import { BaseInOptions, CaptchaResponse } from "../types/captcha";

export interface ReCaptchaV2Options extends BaseInOptions {
  googlekey: string;
  pageurl: string;
  invisible?: boolean;
}

const reCaptchaV2 = async (
  apiKey: string,
  poll: number,
  options: ReCaptchaV2Options
): Promise<CaptchaResponse> => {
  const requestId = await sendInRequest(apiKey, { ...options, method: "userrecaptcha" });
  const response = await pollOutRequest(apiKey, requestId, options.polling || poll);
  const error = response.includes("ERROR");

  if (error && options.retry) return reCaptchaV2(apiKey, poll, options);

  return {
    success: !error,
    token: response,
  };
};

export default reCaptchaV2;
