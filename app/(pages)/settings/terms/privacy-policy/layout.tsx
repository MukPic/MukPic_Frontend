'use client';
import "@/app/globals.css";
import { ReactNode, useEffect } from "react";
import { SvgButtonForNav } from "@/app/components/button";
import TopNav from "@/app/components/TopNav";
import { useRouter } from "next/navigation";

type LayoutProps = {
  children: ReactNode;
};

export default function EditProfileLayout({ children }: LayoutProps) {
  const router = useRouter();
  useEffect(() => {
    document.title = "Edit-Profile";
  }, []);

  return (
    <div className="root-wrapper root-text">
      <TopNav
        leftButton={
          <SvgButtonForNav
            onClick={() => {
              router.push('/settings');
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_112_3051)">
                <path
                  d="M19.6934 3.36002C19.1217 2.78836 18.2 2.78836 17.6284 3.36002L7.81671 13.1717C7.36171 13.6267 7.36171 14.3617 7.81671 14.8167L17.6284 24.6284C18.2 25.2 19.1217 25.2 19.6934 24.6284C20.265 24.0567 20.265 23.135 19.6934 22.5634L11.13 14L19.705 5.42502C20.265 4.85336 20.265 3.93169 19.6934 3.36002Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_112_3051">
                  <rect width="28" height="28" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </SvgButtonForNav>
        }
      />
      <div className="flex justify-center items-center logo-box">
        <span className="login-logo">PrivacyPolicy</span>
      </div>
      <div className="auth-container bg-white rounded-lg">
        {children}
      </div>
    </div>
  );
}
