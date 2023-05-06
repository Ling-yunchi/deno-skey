import { deleteCaptcha, getCaptchaOnce, setCaptcha } from "./kv.ts";

import {
  makeCaptcha,
  isValid,
} from "https://deno.land/x/svg_captcha@v1.1.0/mod.ts";

// start a new challenge
export default async (_req: Request) => {
  const uuid = crypto.randomUUID();
  const { text, svgContext: image } = makeCaptcha({
    textOption: {
      randomColor: true,
      rotate: 30,
    },
  });

  await setCaptcha(uuid, { text });

  // expires in 1min
  setTimeout(() => {
    deleteCaptcha(uuid);
  }, 60 * 1000);

  return Response.json({ captcha: uuid, image });
};

export async function verifyCaptcha(uuid: string, input: string) {
  const captcha = await getCaptchaOnce(uuid);

  return (captcha && isValid(input, captcha.text)) || false;
}
