export function buffer2hex(buffer: Uint8Array) {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  return buffer2hex(new Uint8Array(hashBuffer));
}

// console.log(await sha256("initial_password"));

export async function saltyHash(message: string) {
  return await sha256(
    `salt{what_you_beloved_is_what_your_life_is}__${message}__{xxxx-sss}`
  );
}

export async function getKthSkey(
  password: string,
  seed: string,
  iteration: number
) {
  let skey = await saltyHash(password + seed);

  for (let i = 0; i < iteration; ++i) {
    skey = await saltyHash(skey);
  }

  return skey;
}

export async function getSkeys(
  password: string,
  seed: string,
  iteration: number
) {
  let skey = await saltyHash(password + seed);
  const result = [] as string[];

  for (let i = 0; i < iteration; ++i) {
    skey = await saltyHash(skey);
    result.push(skey);
  }

  return result;
}
