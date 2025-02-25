'use client';
import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

type BotNavProps = {
    searchButton: ReactNode;
    communityButton: ReactNode;
    mypageButton: ReactNode;
};

export function BotNav({ searchButton, communityButton, mypageButton }: BotNavProps) {
    return (
        <div className="bottom-[1rem] bot-nav z-50 sticky flex justify-center items-center">
            {searchButton}
            {communityButton}
            {mypageButton}
        </div>
    );
}

type BotNavButtonProps = {
    Image: ReactNode;
    text?: string;
    isActive: boolean;
    onClick: () => void;
};

export function BotNavButton({ Image, text, isActive, onClick }: BotNavButtonProps) {
    return (
        <button
            className="flex flex-col items-center justify-center flex-1 mx-2 py-2"
            onClick={onClick}
        >
            <div className="mb-0">{Image}</div>
            {!isActive && (
                <div className="mt-0">
                    <span className="botnav-text">{text}</span>
                </div>
            )}
        </button>
    );
}

export function AddBotNav() {
    const router = useRouter();
    const pathname = usePathname();

    const handleButtonClick = (route: string) => {
        router.push(route); // 페이지 이동
    };

    return (
        <BotNav
            searchButton={
                <BotNavButton
                    text="home"
                    onClick={() => handleButtonClick("/")}
                    isActive={pathname === "/"}
                    Image={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke={pathname === "/" ? "white" : "gray"}
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 12L11.204 3.045c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                            />
                        </svg>
                    }
                />
            }
            communityButton={
                <BotNavButton
                    text="community"
                    onClick={() => location.href = "/community"} //현석 수정함
                    isActive={pathname === "/community"}
                    Image={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={pathname === "/community" ? "white" : "gray"}
                            className="w-6 h-6"
                        >
                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm0-14a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
                        </svg>
                    }
                />
            }
            mypageButton={
                <BotNavButton
                    text="my page"
                    onClick={() => handleButtonClick("/myPage")}
                    isActive={pathname === "/myPage"}
                    Image={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={pathname === "/myPage" ? "white" : "gray"}
                            className="w-6 h-6"
                        >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2.25c-4.25 0-7.5 2.25-7.5 5.25v1.125C4.5 21.496 5.004 22 5.625 22h12.75c.621 0 1.125-.504 1.125-1.125V19.5c0-3-3.25-5.25-7.5-5.25Z" />
                        </svg>
                    }
                />
            }
        />
    );
}
