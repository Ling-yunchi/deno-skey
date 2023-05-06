import { saltyHash } from "../common.ts";
import { getSkeyOnce, setSkey } from "./kv.ts";
import { log } from "./log.ts";

export default async (req: Request) => {
  const auth = req.headers.get("Authorization");

  if (!auth || !auth.startsWith("Basic ")) {
    return Response.json(
      { error: "Please provide Authorization header starts with Basic" },
      { status: 400 }
    );
  }
  const skey = auth.slice(6).trim();
  const okey = await saltyHash(skey);

  const value = await getSkeyOnce(okey);

  if (!value) {
    return Response.json({ error: "Failed to authenticate" }, { status: 403 });
  }

  // update to new skey
  await setSkey(skey, value);

  // do something here
  log(`user: ${value.username} performs an action`);

  return Response.json({ ok: true });
};
