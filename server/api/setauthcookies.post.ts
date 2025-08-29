// server/api/set-cookie.post.ts
import { defineEventHandler, readBody, setCookie } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event);

  const name = body?.find((f) => f.name == "name")?.data?.toString();
  const value = body?.find((f) => f.name == "value")?.data?.toString();

  if (!name || !value) {
    return { success: false, message: "Name and value are required" };
  }

  // Set cookie
  setCookie(event, name, value, {
    httpOnly: false, // prevent JS access
    sameSite: "lax", // adjust as needed
    secure: false,
    path: "/", // available across all routes
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return { success: true, message: `Cookie ${name} set!` };
});
