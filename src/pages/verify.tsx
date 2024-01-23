"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { Progress } from "~/components/ui/progress";

export default function Verify() {
  const router = useRouter();
  const { token } = router.query;
  const verifyEmailMutation = api.user.verifyEmail.useMutation();
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (token && !verificationComplete) {
      // Add a flag to prevent repeated calls
      verifyEmailMutation.mutate(
        { token: token as string },
        {
          onSuccess: () => {
            // Handle successful verification
            setVerificationComplete(true); // Set the flag
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
  }, [token]); // Remove verifyEmailMutation from dependencies

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
