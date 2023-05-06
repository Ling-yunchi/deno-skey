import { serve } from "https://deno.land/std@0.182.0/http/server.ts";

import login from "./app/login.ts";
import action from "./app/action.ts";
import captcha from "./app/captcha.ts";

await serve(
  async (request) => {
    const url = new URL(request.url);

    if (url.pathname === "/login") {
      return await login(request);
    }
    if (url.pathname === "/action") {
      return await action(request);
    }
    if (url.pathname === "/captcha") {
      return await captcha(request);
    }

    return Response.json({ error: "Page not found" }, { status: 404 });
  },
  { port: 8080 }
);
