import { FunCaptchaOptions } from "src/methods/funCaptcha";
import { ReCaptchaV2Options } from "../methods/reCaptchaV2";

export type TwoCaptchaResponse = {
  status: 0 | 1;
  request: string;
};

export interface CaptchaResponse {
  success: boolean;
  token: string | null;
}

export interface CaptchaMethods {
  reCaptchaV2: (options: ReCaptchaV2Options) => Promise<CaptchaResponse>;
  funCaptcha: (options: FunCaptchaOptions) => Promise<CaptchaResponse>;
}

export interface BaseInOptions {
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
