import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    DATABASE_URL_DEV: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_DB_URL_HERE"),
        "You forgot to change the default URL",
      ),
    SMPT_HOST: z.string().min(1),
    SMPT_PORT: z.union([z.string(), z.number()]),
    SMPT_USER: z.string().min(1),
    SMPT_PASSWORD: z.string().min(1),
    WEB_URL: z.string().url(),
    JWT_SECRET: z.string().min(1),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_JWT_SECRET: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL_DEV: process.env.DATABASE_URL_DEV,
    SMPT_HOST: process.env.SMPT_HOST,
    SMPT_PORT: process.env.SMPT_PORT,
    SMPT_USER: process.env.SMPT_USER,
    SMPT_PASSWORD: process.env.SMPT_PASSWORD,
    WEB_URL: process.env.WEB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
