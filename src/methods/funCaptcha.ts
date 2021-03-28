import { BaseInOptions, CaptchaResponse } from "../types/captcha";
import { sendInRequest, pollOutRequest } from "..";

export interface FunCaptchaOptions extends BaseInOptions {
  publickey: string;
  pageurl: string;
  surl?: string;
}

const funCaptcha = async (
  apiKey: string,
  poll: number,
  options: FunCaptchaOptions
): Promise<CaptchaResponse> => {
  const requestId = await sendInRequest(apiKey, { ...options, method: "funcaptcha" });
  const response = await pollOutRequest(apiKey, requestId, options.polling || poll);
  const error = response.includes("ERROR");

  if (error && options.retry) return funCaptcha(apiKey, poll, options);

  return {
    success: !error,
    token: response,
  };
};

export default funCaptcha;
