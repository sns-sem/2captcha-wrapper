import { pollOutRequest, sendInRequest } from "./app";
import { CaptchaResponse } from "./types/captcha";

export interface ReCaptchaV2Options {
  googlekey: string;
  pageurl: string;
  invisible?: boolean;
  "data-s"?: string;
  cookies?: string;
  userAgent?: string;
  header_acao?: boolean;
  pingback?: string;
  soft_id?: number;
  proxy?: string;
  proxytype?: "HTTP" | "HTTPS" | "SOCKS4" | "SOCKS5";
  polling?: number;
  retry?: boolean;
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
