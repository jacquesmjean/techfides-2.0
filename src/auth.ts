import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { OTP } from "otplib";

const totp = new OTP({ strategy: "totp" });

/**
 * NextAuth.js v5 (Auth.js) configuration for TechFides 2.0
 *
 * Protects:
 *   - /gse/* (Global Sales Engine dashboards)
 *   - /api/v1/* (Velocity Engine API)
 *
 * Providers:
 *   - Credentials (email + dev password) for local development
 *   - In production, swap to Email magic link or Google OAuth
 *
 * MFA:
 *   - TOTP via otplib (Google Authenticator compatible)
 *   - Required for users with mfaEnabled=true
 */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: "ADMIN" | "CLOSER" | "VIEWER";
      mfaEnabled: boolean;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        mfaCode: { label: "MFA Code", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        const mfaCode = credentials?.mfaCode as string | undefined;

        if (!email || !password) return null;

        // Look up the user
        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user) return null;

        // Verify password against AUTH_PASSWORD env var.
        // In dev, accept any password for seeded users.
        // In production, AUTH_PASSWORD must be set in Vercel env vars.
        const isDev = process.env.NODE_ENV !== "production";
        const authPassword = process.env.AUTH_PASSWORD;

        if (!isDev) {
          if (!authPassword || password !== authPassword) {
            return null;
          }
        }

        // Enforce MFA if enabled
        if (user.mfaEnabled && user.mfaSecret) {
          if (!mfaCode) return null;
          const result = totp.verifySync({ token: mfaCode, secret: user.mfaSecret });
          if (!result.valid) return null;
        }

        // Audit the login
        await db.auditLog.create({
          data: {
            userId: user.id,
            action: "login",
            resource: "auth",
            metadata: { mfa: user.mfaEnabled },
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          mfaEnabled: user.mfaEnabled,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role: "ADMIN" | "CLOSER" | "VIEWER" }).role;
        token.mfaEnabled = (user as { mfaEnabled: boolean }).mfaEnabled;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "CLOSER" | "VIEWER";
        session.user.mfaEnabled = token.mfaEnabled as boolean;
      }
      return session;
    },
  },
});

/**
 * Generate a new TOTP secret and QR code data URL for MFA enrollment.
 * Used during initial user setup.
 */
export function generateMfaSecret(email: string): {
  secret: string;
  otpauthUrl: string;
} {
  const secret = totp.generateSecret();
  const otpauthUrl = totp.generateURI({
    label: email,
    issuer: "TechFides",
    secret,
  });
  return { secret, otpauthUrl };
}
