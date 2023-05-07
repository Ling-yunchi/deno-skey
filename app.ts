import { serve } from "https://deno.land/std@0.182.0/http/server.ts";
import { transpile } from "https://deno.land/x/emit@0.22.0/mod.ts";

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
    if (pathname === "/") {
      const html = await Deno.readTextFile("./index.html");
      return new Response(html, {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      });
    }
    if (pathname === "/common.ts") {
      const file_url = new URL("./common.ts", import.meta.url);
      // deno magic!
      const result = await transpile(file_url);
      const code = result[file_url.href];
      return new Response(code, {
        headers: {
          "content-type": "application/javascript; charset=utf-8",
        },
      });
    }
    console.log(req.url);

    return Response.json({ error: "Page not found" }, { status: 404 });
  },
  { port: 8080 }
);
