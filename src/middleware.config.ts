export const config = {
    matcher: [
      /*
        Match all routes EXCEPT:
        - /login
        - /register
        - /api/auth/*
        - static files (_next, favicon, etc)
      */
      "/((?!api/auth/login|api/auth/register|login|_next|favicon.ico|images|fonts|public).*)",
    ],
  };