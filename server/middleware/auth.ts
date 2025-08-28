import { H3Event, HTTPMethod, sendError } from "h3";
import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event: H3Event) => {
  const url = getRequestURL(event);
  const pathname = url.pathname;
  const method: HTTPMethod = event.method;

  console.log(`[AUTH MIDDLEWARE] ${method} ${pathname}`);

  // starts with "/api" ignore
  if (!pathname.startsWith("/api")) {
    return;
  }

  const publicRoutes = [
    { methods: ["POST"], path: "/api/users" },
    { methods: ["GET"], path: "/api/test" },
  ];

  const isPublicRoute = publicRoutes.some(
    (route) => route.methods.includes(method) && route.path === pathname
  );

  if (isPublicRoute) {
    return;
  }

  let user;
  try {
    user = await serverSupabaseUser(event);
    if (!user) {
      return sendError(
        event,
        createError({ statusCode: 401, statusMessage: "Unauthorized" })
      );
    }
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "Unauthorized" })
    );
  }

  // Store user in context
  event.context.user = user;

  const adminRoutes = [
    {
      path: "/api/projects",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  ];

  if (
    adminRoutes.some(
      (route) => route.path === pathname && route.methods.includes(method)
    )
  ) {
    const role = user.user_metadata?.role;
    if (role !== "admin") {
      return sendError(
        event,
        createError({
          statusCode: 403,
          statusMessage: "Forbidden: Admins only",
        })
      );
    }
  }
  return;
});
