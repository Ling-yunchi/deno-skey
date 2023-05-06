import { serve } from "https://deno.land/std@0.182.0/http/server.ts";

import login from "./app/login.ts";
import action from "./app/action.ts";
import captcha from "./app/captcha.ts";
import renew from "./app/renew.ts";

await serve(
  async (req) => {
    const url = new URL(req.url);
    // maybe proxy
    const pathname = url.pathname.startsWith("/api")
      ? url.pathname.slice(4)
      : url.pathname;

    if (pathname === "/login") {
      return await login(req);
    }
    if (pathname === "/action") {
      return await action(req);
    }
    if (pathname === "/captcha") {
      return await captcha(req);
    }
    if (pathname === "/renew") {
      return await renew(req);
    }
    console.log(req.url);

    return Response.json({ error: "Page not found" }, { status: 404 });
  },
  { port: 8080 }
);
