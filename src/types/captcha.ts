import { ReCaptchaV2Options } from "../reCaptchaV2";

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
}
