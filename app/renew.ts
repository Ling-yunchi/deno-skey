import { saltyHash } from "../common.ts";
import { getSkeyOnce, getUser, setSkey } from "./kv.ts";
import { log } from "./log.ts";
import { generateSKey } from "./login.ts";

export default async (req: Request) => {
  const auth = req.headers.get("Authorization");

  if (!auth || !auth.startsWith("Basic ")) {
    log("400: no authorization header");
    return Response.json(
      { error: "Please provide Authorization header starts with Basic" },
      { status: 400 }
    );
  }
  const okey = await saltyHash(auth.slice(6).trim());
  const value = await getSkeyOnce(okey);

  if (!value) {
    log(`403: invalid authorization header: ${auth}`);
    return Response.json({ error: "Failed to authenticate" }, { status: 403 });
  }

  const user = await getUser(value.username);
  if (!user) {
    log(`500: user should exist`);
    throw new Error("user should exist");
  }

  const iteration = 10;
  const { seed, skey } = await generateSKey(user.password, iteration);
  // update to new skey
  await setSkey(skey, value);

  // do something here
  log(
    `200: user ${value.username} renews its skey; skey => ${skey.slice(0, 8)}`
  );

  return Response.json({ ok: true, seed, iteration });
};
