'use client';
import { LoginButton } from "@/app/components/button";
import Link from "next/link";


export default function LoginPage() {

  const handleGoogleLogin = () => {
    const googleAuthUrl = `${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}`;
    // 구글 회원가입에서 사용한 토큰 혹시 있으면 삭제해줌
    if(localStorage.getItem('googleLoginToken')) {
      localStorage.removeItem('googleLoginToken');
    }
    
    window.location.href = googleAuthUrl;
  };

  return (

    <div className="auth-container flex flex-1 gap-2">
      <div className="flex flex-col items-center justify-center min-h-screen"
      style={{backgroundColor:'white'}}>
        {/* 로고 */}
        <div className="flex-1 flex justify-center items-center">
          <span className="text-3xl font-bold login-logo">MUKPIC</span>
        </div>

        {/* Google 로그인 버튼 */}
        <div className="w-full max-w-sm mb-4">
          <LoginButton
            text="Sign in with Google"
            buttonClassName="auth-button auth-button-google"
            textClassName="login-text login-text-google"
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_112_2241)">
                  <path
                    d="M23.52 12.2727C23.52 11.4218 23.4436 10.6036 23.3018 9.81818H12V14.4655H18.4582C18.1745 15.96 17.3236 17.2255 16.0473 18.0764V21.0982H19.9418C22.2109 19.0036 23.52 15.9273 23.52 12.2727Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 24C15.24 24 17.9564 22.9309 19.9418 21.0982L16.0473 18.0764C14.9782 18.7964 13.6145 19.2327 12 19.2327C8.88 19.2327 6.22909 17.1273 5.28 14.2909H1.28727V17.3891C3.26182 21.3055 7.30909 24 12 24Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.28 14.28C5.04 13.56 4.89818 12.7964 4.89818 12C4.89818 11.2036 5.04 10.44 5.28 9.72V6.62182H1.28727C0.469091 8.23636 0 10.0582 0 12C0 13.9418 0.469091 15.7636 1.28727 17.3782L4.39636 14.9564L5.28 14.28Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 4.77818C13.7673 4.77818 15.3382 5.38909 16.5927 6.56727L20.0291 3.13091C17.9455 1.18909 15.24 0 12 0C7.30909 0 3.26182 2.69455 1.28727 6.62182L5.28 9.72C6.22909 6.88364 8.88 4.77818 12 4.77818Z"
                    fill="#EA4335"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_112_2241">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            }
            onClick={handleGoogleLogin}
          />
        </div>


        {/* ID 로그인 버튼 */}
        <div className="w-full max-w-sm mb-4">
          <LoginButton
            href="/login/withid"
            text="Sign in with ID"
            buttonClassName="auth-button auth-button-id"
            textClassName="login-text login-text-id"
          />
        </div>

        {/* 회원가입 링크 */}
        <div className="w-full max-w-sm mb-4 flex justify-center items-center">
          <span className="text-sm text-gray-500">No Account?</span>
          <Link className="ml-2 text-sm hover:underline" href="/signup">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
