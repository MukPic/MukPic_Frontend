import type { Metadata } from "next";
import "@/app/globals.css";
import TopNav from "@/app/components/TopNav";
import { ReactNode } from "react";
import { AlertButtonForNav, TextLogoButtonForNav } from "@/app/components/button";
import { AddBotNav } from "@/app/components/BotNav";


export const metadata: Metadata = {
  title: "MukPic-Home",
  description: "MukPic Main Page",
};

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  // 현석이 버튼 수정함
  
  return (

    <div className="root-wrapper root-text">

      {/* 상단 바 */}
      <TopNav
        leftButton={<TextLogoButtonForNav className="nav-logo">MUKPIC</TextLogoButtonForNav>}
        rightButton={<AlertButtonForNav>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_112_3068)">
              <path d="M22.5051 20.1716L21.0001 18.6666V12.8333C21.0001 9.25163 19.0867 6.25329 15.7501 5.45996V4.66663C15.7501 3.69829 14.9684 2.91663 14.0001 2.91663C13.0317 2.91663 12.2501 3.69829 12.2501 4.66663V5.45996C8.90173 6.25329 7.00006 9.23996 7.00006 12.8333V18.6666L5.49506 20.1716C4.76006 20.9066 5.27339 22.1666 6.31173 22.1666H21.6767C22.7267 22.1666 23.2401 20.9066 22.5051 20.1716ZM18.6667 19.8333H9.33339V12.8333C9.33339 9.93996 11.0951 7.58329 14.0001 7.58329C16.9051 7.58329 18.6667 9.93996 18.6667 12.8333V19.8333ZM14.0001 25.6666C15.2834 25.6666 16.3334 24.6166 16.3334 23.3333H11.6667C11.6667 24.6166 12.7051 25.6666 14.0001 25.6666Z" fill="gray" />
            </g>
            <defs>
              <clipPath id="clip0_112_3068">
                <rect width="28" height="28" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </AlertButtonForNav>}
      />
      {/* 메인 */}
      <div className="mukpic-main-container">
        {/* 메인 페이지 내용 */}
        {children}
        {/* 하단 네비게이션 */}
        <div className="flex justify-center items-center">
          <AddBotNav></AddBotNav>
        </div>
      </div>

    </div>
  );
}
