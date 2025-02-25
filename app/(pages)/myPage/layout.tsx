import type { Metadata } from "next";
//import "@/app/globals.css";
import { ReactNode } from "react";
import { AddBotNav } from "@/app/components/BotNav";


export const metadata: Metadata = {
    title: "MukPic-myPage",
    description: "myPage",
};

//기본 레이아웃
/*
구조 - body[main{div class="root-container"(header,본문,footer)}]
일단 스타일 설정은 body 와 main은 비워두고 root-container에만 해놓았음
*/

type LayoutProps = {
    children: ReactNode;
};



export default function Layout({ children }: LayoutProps) {
    return (


        <div className='root-wrapper'>
            <div className="main-container flex-1 bg-white rounded-lg shadow-md" >
                {/* 상단 내비게이션 필요한 버튼 넣어서 사용용 */}

                {/* 메인 페이지 내용 */}
                {children}

            
            </div >
            {/* 하단 네비게이션 */}
            <AddBotNav></AddBotNav>
       
            </div >
            
    );
}
