import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { env } from "~/env";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JwtCookie, UserStatus } from "../../../types/global";

const transporter = nodemailer.createTransport({
  host: env.SMPT_HOST,
  port: 465,
  auth: {
    user: env.SMPT_USER,
    pass: env.SMPT_PASSWORD,
  },
});

export const userRoter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(8) }))
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;

      // Hash pw:
      const saltRound = 10;
      const hashedPassword = await bcrypt.hash(password, saltRound);

      const verificationToken = uuidv4();
      const tokenExpirationDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      try {
        const newUser = await ctx.db.user.create({
          data: {
            email,
            password: hashedPassword,
            type: "user",
            status: "pending",
            avatar: "~/public/images/default-avatar.png",
            verificationToken,
            verificationTokenExpiresAt: new Date(
              Date.now() + tokenExpirationDuration,
            ),
          },
        });

        const verificationLink = `${env.NODE_ENV === "development" ? "http://localhost:3000" : env.WEB_URL}/verify?token=${verificationToken}`;

        await sendVerificationEmail(email, verificationLink);

        return { id: newUser.id, email: newUser.email, status: newUser.status };
      } catch (error: unknown) {
        throw new Error("Error creating user: " + (error as Error).message);
      }

      async function sendVerificationEmail(email: string, link: string) {
        const mailOpts = {
          from: '"Reallist.org" <noreply@reallist.org>',
          to: email,
          subject: "Verify your email address",
          html: `Please click the link to verify your email: <a href="${link}">Verify Email</a>`,
        };

        await transporter.sendMail(mailOpts);
      }
    }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { token } = input;
      const user = await ctx.db.user.findFirst({
        where: {
          verificationToken: token,
          verificationTokenExpiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        throw new Error("Invalid or expired token");
      }

      await ctx.db.user.update({
        where: {
          id: user.id,
        },
        data: {
          status: "verified",
          verificationToken: null,
          verificationTokenExpiresAt: null,
        },
      });

      const jwtPayload: JwtCookie = {
        userId: user.id,
        emailVerified: true,
        fullyAuthenticated: false,
      };

      const jwtToken = jwt.sign(jwtPayload, env.JWT_SECRET, {
        expiresIn: "24h",
      });

      const cookieOptions = [
        `token=${jwtToken}`,
        `HttpOnly`,
        `Path=/`,
        `SameSite=Strict`,
        env.NODE_ENV === "production" ? "Secure" : "",
      ].join("; ");

      ctx.res.setHeader("Set-Cookie", cookieOptions);

      return { message: "Email successfully verified" };
    }),

  finalizeAccount: publicProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { username } = input;

      const token = ctx.req.cookies.token;

      if (!token) throw new Error("No token provided");

      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtCookie;

        if (!decoded.emailVerified) {
          throw new Error("Email not verified");
        }

        const userId = decoded.userId;

        const updatedUser = await ctx.db.user
          .update({
            where: {
              id: userId,
            },
            data: {
              username,
              status: "active",
            },
          })
          .catch((err) => {
            if (err.code === "P2002") {
              throw new Error("Username already taken");
            }
            throw new Error(err.message);
          });

        const newJwtPayload: JwtCookie = {
          userId: updatedUser.id,
          fullyAuthenticated: true,
        };

        const newJwtToken = jwt.sign(newJwtPayload, env.JWT_SECRET, {
          expiresIn: "24h",
        });

        const cookieOptions = [
          `token=${newJwtToken}`,
          `HttpOnly`,
          `Path=/`,
          `SameSite=Strict`,
          env.NODE_ENV === "production" ? "Secure" : "",
        ].join("; ");

        ctx.res.setHeader("Set-Cookie", cookieOptions);

        return { message: "Account successfully finalized" };
      } catch (error: unknown) {
        throw new Error(
          "Error finalizing account: " + (error as Error).message,
        );
      }
    }),
  getUserStatus: publicProcedure.query(async ({ ctx }) => {
    const token = ctx.req.cookies.token;

    let userStatus: UserStatus = "UNVERIFIED";

    if (token) {
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        if (decoded.fullyAuthenticated) {
          userStatus = "FULLY_AUTHENTICATED";
        } else if (decoded.emailVerified) {
          userStatus = "VERIFIED";
        }
      } catch (err) {
        console.error("JWT verification error:", err);
      }
    }

    return { status: userStatus };
  }),
  getUserDetails: publicProcedure.query(async ({ ctx }) => {
    const token = ctx.req.cookies.token;

    let userDetails = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        if (decoded.fullyAuthenticated) {
          const user = await ctx.db.user.findUnique({
            where: {
              id: decoded.userId,
            },
            select: {
              username: true,
              email: true,
              avatar: true,
            },
          });
          userDetails = user;
        }
      } catch (err) {
        console.error("JWT verification error:", err);
      }
    }

    return { userDetails };
  }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.res.setHeader(
      "Set-Cookie",
      "token=; Max-Age=0; path=/; HttpOnly; SameSite=Strict;",
    );
    return { message: "Logged out" };
  }),
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { username, password } = input;

      const user = await ctx.db.user.findUnique({
        where: {
          username,
        },
      });

      if (!user) throw new Error("Invalid username or password");

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) throw new Error("Invalid username or password");

      const jwtPayload: JwtCookie = {
        userId: user.id,
        fullyAuthenticated: true,
      };

      const jwtToken = jwt.sign(jwtPayload, env.JWT_SECRET, {
        expiresIn: "24h",
      });

      const cookieOptions = [
        `token=${jwtToken}`,
        `HttpOnly`,
        `Path=/`,
        `SameSite=Strict`,
        env.NODE_ENV === "production" ? "Secure" : "",
      ].join("; ");

      ctx.res.setHeader("Set-Cookie", cookieOptions);

      return { message: "Login successful" };
    }),
});
