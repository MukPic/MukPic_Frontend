"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { useSignupStore } from "@/app/types/signupStore";

function SignUpContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setEmail = useSignupStore((state) => state.setemail);

  useEffect(() => {
    const email = searchParams.get("email");
    if (!email) {
      console.error("Email parameter is missing.");
      return;
    }

    const fetchTokens = async () => {
      try {
        // 이메일을 기반으로 토큰 요청
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_ROOT_API}/auth/email-login`,
          { email },
          { withCredentials: true } // 쿠키 포함
        );

        if (response.status === 200) {
          setEmail(email);
          const accessToken = response.headers["authorization"];

          if (accessToken) {
            // 로컬 스토리지에 토큰 저장
            localStorage.setItem("googleLoginToken", accessToken);

            console.log("Tokens stored successfully:", {
              accessToken,
            });

            // 리디렉션
            router.push("/signup/google/step3");
          } else {
            console.error("Tokens are missing in the response headers.");
          }
        }
      } catch (error) {
        console.error("Error fetching tokens:", error);
      }
    };

    fetchTokens();
  }, [searchParams, router, setEmail]);

  return (
    <div className="flex justify-center items-center logo-box">
      <span className="login-logo">MUKPIC</span>
    </div>
  );
}

export default function SignUp() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
