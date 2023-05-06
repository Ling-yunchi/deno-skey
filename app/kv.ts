const kv = await Deno.openKv();

// mock data
await kv.set(["user", "admin"], { password: "admin123" });

type UserValue = {
  password: string;
};

export async function getUser(username: string) {
  const result = await kv.get<UserValue>(["user", username]);
  return result.value;
}

type SkeyValue = {
  username: string;
};

export async function setSkey(skey: string, value: SkeyValue) {
  return await kv.set(["skey", skey], value);
}

export async function getSkeyOnce(skey: string) {
  const result = await kv.get<SkeyValue>(["skey", skey]);
  await kv.delete(result.key);
  return result.value;
}

type CaptchaValue = {
  text: string;
};

export async function setCaptcha(uuid: string, value: CaptchaValue) {
  return await kv.set(["captcha", uuid], value);
}

export async function getCaptchaOnce(uuid: string) {
  const result = await kv.get<CaptchaValue>(["captcha", uuid]);
  await kv.delete(result.key);
  return result.value;
}

export async function deleteCaptcha(uuid: string) {
  await kv.delete(["captcha", uuid]);
}
