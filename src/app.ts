import fetch from "node-fetch";
import qs from "qs";
import reCaptchaV2 from "./reCaptchaV2";
import { CaptchaMethods, TwoCaptchaResponse } from "./types/captcha";
import { sleep } from "./util";

const captchaMethods = {
  reCaptchaV2,
};

interface InOptions {
  method: string;
  [key: string]: any;
}

export const sendInRequest = async (apiKey: string, options: InOptions): Promise<string> => {
  for (let key in options) {
    // Turn booleans into 0 | 1
    typeof options[key] === "boolean" && (options[key] = Number(options[key]));
  }

  return fetch(`https://2captcha.com/in.php?key=${apiKey}&${qs.stringify(options)}&json=1`)
    .then(res => res.json())
    .then((res: { status: 0 | 1; request: string }) => {
      if (res.status === 0) throw res;
      return res.request;
    })
    .catch(err => {
      throw new Error(`Error sending in.php request: ${err}`);
    });
};

export const pollOutRequest = async (
  apiKey: string,
  requestId: string,
  poll: number
): Promise<string> => {
  await sleep(poll);

  const res = await sendOutRequest(apiKey, requestId);
  if (res.request === "CAPCHA_NOT_READY") {
    return pollOutRequest(apiKey, requestId, poll);
  }

  return res.request;
};

export const sendOutRequest = async (
  apiKey: string,
  requestId: string
): Promise<TwoCaptchaResponse> => {
  return fetch(
    `https://2captcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`
  ).then(res => res.json());
};

const initSolver = (apiKey: string, defaultPolling: number = 30000) => {
  return Object.entries(captchaMethods).reduce((methods, [name, fn]) => {
    methods[name as keyof typeof captchaMethods] = fn.bind(null, apiKey, defaultPolling);
    return methods;
  }, {} as CaptchaMethods);
};

export default initSolver;
