"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { Progress } from "~/components/ui/progress";
import { useDispatch, useSelector } from "react-redux";
import { setUserStatus } from "../context/slices/authSlice";
import { RootState } from "../context/store/store";
import jwt, { JwtPayload } from "jsonwebtoken";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { env } from "../env";
import { BaseProps, UserStatus } from "../types/global";

export default function Verify({ userStatus }: BaseProps) {
  const router = useRouter();
  const { token } = router.query;
  const verifyEmailMutation = api.user.verifyEmail.useMutation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [verificationComplete, setVerificationComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userStatus === "FULLY_AUTHENTICATED") {
      router.push("/"); // Redirect to home or another appropriate page
      return;
    }

    if (token && !verificationComplete) {
      verifyEmailMutation.mutate(
        { token: token as string },
        {
          onSuccess: () => {
            setVerificationComplete(true); // Set the flag
            dispatch(setUserStatus("VERIFIED"));
            setTimeout(() => {
              router.push("/"); // Delayed redirection
            }, 2000); // Delay for 2 seconds (2000 milliseconds)
          },
          onError: (error) => {
            // Handle error
            // ...
          },
        },
      );
    }
  }, [token, userStatus, isAuthenticated, verificationComplete]);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 1000);
    return () => clearTimeout(timer);
  });

  // Render your component (could be just a simple message or loading state)
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-12 bg-gray-200">
      <h1 className="text-center text-3xl font-semibold">
        Verifying your email...
      </h1>
      <Progress value={progress} className="w-2/4" />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookies = parseCookies({ req });
  const token = cookies.token;

  let userStatus: UserStatus = "UNVERIFIED";
  let loading = false;

  if (token) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      if (decoded.fullyAuthenticated) {
        userStatus = "FULLY_AUTHENTICATED";
      } else if (decoded.emailVerified) {
        userStatus = "VERIFIED";
      }
    } catch (error) {
      console.error("JWT verification error:", error);
    } finally {
      loading = false;
    }
  } else {
    loading = false;
  }

  return { props: { userStatus, loading } };
};
