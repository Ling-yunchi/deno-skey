import { buffer2hex, getKthSkey } from "../common.ts";
import { verifyCaptcha } from "./captcha.ts";
import { getUser, setSkey } from "./kv.ts";
import { log } from "./log.ts";

export default async (req: Request) => {
  const data = await req.json();

  if (
    typeof data.username !== "string" ||
    typeof data.password !== "string" ||
    typeof data.challenge !== "string" ||
    typeof data.captcha !== "string"
  ) {
    log(`400: bad request to /login: params missing`);
    return Response.json({ error: "missing params" }, { status: 400 });
  }

  const username = data.username as string;
  const password = data.password as string;
  const captcha = data.captcha as string;
  const challenge = data.challenge as string;

  if (!(await verifyCaptcha(challenge, captcha))) {
    log(`403: invalid captcha, blocking`);
    return Response.json({ error: "Failed Captcha" }, { status: 403 });
  }

  const user = await getUser(username);

  if (!user) {
    log(`400: invalid user ${username}`);
    return Response.json({ error: "user not exist" }, { status: 400 });
  }

  if (password !== user.password) {
    log(`400: user ${username} invalid password`);
    return Response.json({ error: "password incorrect" }, { status: 400 });
  }

  const iteration = 10;
  const { seed, skey } = await generateSKey(password, iteration);
  await setSkey(skey, { username });
  log(`200: user ${username} logged in; skey = ${skey.slice(0, 8)}`);

  return Response.json({ ok: true, seed, iteration });
};

export async function generateSKey(password: string, iteration: number) {
  const buffer = crypto.getRandomValues(new Uint8Array(32));
  const seed = buffer2hex(buffer);

  const skey = await getKthSkey(password, seed, iteration + 1);

  return { seed, skey };
}
