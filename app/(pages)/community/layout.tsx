import type { Metadata } from "next";
import "@/app/globals.css";
import { ReactNode } from "react";


export const metadata: Metadata = {
    title: "MukPic-community",
};

type LayoutProps = {
    children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="root-wrapper" style={{padding:'0'}}>
            {children}
        </div>
    );
}
