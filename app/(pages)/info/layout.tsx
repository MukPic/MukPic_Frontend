import type { Metadata } from "next";
import "@/app/globals.css";
import TopNav from "@/app/components/TopNav";
import { ReactNode } from "react";
import { MainButtonForNav } from "@/app/components/button";
import TextButtonForNavWrapper from "@/app/components/TextButtonForNavWrapper";

export const metadata: Metadata = {
    title: "MukPic-Info",
    description: "Info Page",
};

type LayoutProps = {
    children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="root-wrapper">
      <TopNav
        leftButton={<MainButtonForNav />}
        rightButton={<TextButtonForNavWrapper />}
      />
      <div className="info-main-container flex-1 bg-white">{children}</div>
    </div>
  );
}
