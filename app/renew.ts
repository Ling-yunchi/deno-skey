import { saltyHash } from "../common.ts";
import { getSkeyOnce, getUser, setSkey } from "./kv.ts";
import { generateSKey } from "./login.ts";

export default async (req: Request) => {
  const auth = req.headers.get("Authorization");

  if (!auth || !auth.startsWith("Basic ")) {
    return Response.json(
      { error: "Please provide Authorization header starts with Basic" },
      { status: 400 }
    );
  }
  const okey = await saltyHash(auth.slice(6).trim());
  const value = await getSkeyOnce(okey);

  if (!value) {
    return Response.json({ error: "Failed to authenticate" }, { status: 403 });
  }

  const user = await getUser(value.username);
  if (!user) {
    throw new Error("user should exist");
  }

  const iteration = 10;
  const { seed, skey } = await generateSKey(user.password, iteration);
  // update to new skey
  await setSkey(skey, value);

  // do something here
  console.log(`user: ${value.username} renews its skey`);

  return Response.json({ ok: true, seed, iteration });
};
