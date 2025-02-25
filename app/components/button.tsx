'use client';

import { ReactNode } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import '@/app/globals.css';
import '@/app/(css)/auth.css';
import '@/app/(css)/community.css';

interface WideButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}



export function WideButton({ children, href, onClick, className, type = 'button', disabled = false

}: WideButtonProps) {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const buttonClasses = className ? `btn btn-wide ${className}` : 'btn btn-wide';

    if (disabled || !href) {
        return (
            <button
                className={buttonClasses}
                onClick={handleClick}
                type={type}
                disabled={disabled}  // 비활성화 처리
            >
                {children}
            </button>
        );
    }

    if (href) {
        return (
            <Link href={href}>
                <button
                    className={buttonClasses}
                    type={type}
                    disabled={disabled}
                >
                    {children}
                </button>
            </Link>
        );
    }

    return (
        <button
            className={buttonClasses}
            onClick={handleClick}
            disabled={disabled} // 버튼 클릭 시 handleClick 호출
            type={type}
        >
            {children}
        </button>
    );
}

type LoginButtonProps = {
    text?: ReactNode;
    buttonClassName?: string;
    textClassName?: string;
    icon?: ReactNode;
    href?: string;
    onClick?: () => void;
}

// 네비게이션 바 버튼 컴포넌트

type SvgButtonForNavProps = {
    children: ReactNode;
    onClick?: () => void;
}

export function SvgButtonForNav({ children, onClick }: SvgButtonForNavProps) {


    return (
        <button onClick={onClick}>
            {children}
        </button>
    );
}

// 현석 추가
export function AlertButtonForNav({ children }: SvgButtonForNavProps) {
    const handleClick = () => {
        alert("This feature is scheduled for update."); // 알럿 메시지 추가
    };

    return (
        <button onClick={handleClick}>
            {children}
        </button>
    )
}



export function SearchButtonForNav() {

    return (
        <div className='flex justfiy-center items-center gap-2'>
            <button>
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_112_3051)">
                        <path d="M19.6934 3.36002C19.1217 2.78836 18.2 2.78836 17.6284 3.36002L7.81671 13.1717C7.36171 13.6267 7.36171 14.3617 7.81671 14.8167L17.6284 24.6284C18.2 25.2 19.1217 25.2 19.6934 24.6284C20.265 24.0567 20.265 23.135 19.6934 22.5634L11.13 14L19.705 5.42502C20.265 4.85336 20.265 3.93169 19.6934 3.36002Z" fill="black" />
                    </g>
                    <defs>
                        <clipPath id="clip0_112_3051">
                            <rect width="28" height="28" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </button>
            {<span className='nav-text-search'>
                Search
            </span>}
        </div>
    )
}

// 커뮤니티 버튼 - 현석 추가
export function CommunityButtonForNav() {

    const backButtonHandler = () => {
        history.back();
    }

    return (
        <div className='flex justfiy-center items-center gap-3'>
            <button
                type='button'
                onClick={backButtonHandler}>
                <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.88 0.879951C10.39 0.389951 9.6 0.389951 9.11 0.879951L0.700001 9.28995C0.310001 9.67995 0.310001 10.31 0.700001 10.7L9.11 19.11C9.6 19.6 10.39 19.6 10.88 19.11C11.37 18.62 11.37 17.83 10.88 17.34L3.54 9.99995L10.89 2.64995C11.37 2.15995 11.37 1.36995 10.88 0.879951Z" fill="black" />
                </svg>
            </button>
            <button className='nav-text mb-[0.25rem]'
                type='button'
                onClick={() => { location.href = '/community' }}>
                <span className='flex justify-center items-center'>Community</span>
            </button>
        </div>

    )
}

export function MainButtonForNav() {
    const router = useRouter();

    const handleClick = () => {
        router.push("/"); // 메인 페이지로 이동
    };

    return (
        <div className='flex justfiy-center items-center gap-2'>
            <button onClick={handleClick}>
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_112_3051)">
                        <path d="M19.6934 3.36002C19.1217 2.78836 18.2 2.78836 17.6284 3.36002L7.81671 13.1717C7.36171 13.6267 7.36171 14.3617 7.81671 14.8167L17.6284 24.6284C18.2 25.2 19.1217 25.2 19.6934 24.6284C20.265 24.0567 20.265 23.135 19.6934 22.5634L11.13 14L19.705 5.42502C20.265 4.85336 20.265 3.93169 19.6934 3.36002Z" fill="black" />
                    </g>
                    <defs>
                        <clipPath id="clip0_112_3051">
                            <rect width="28" height="28" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </button>
            {<span className='nav-text-search'>
                Mukpic
            </span>}
        </div>
    )
}


type TextLogoButtonForNavProps = {
    children: string;
    className?: string;
    onclick?: () => void;
}

export function TextLogoButtonForNav({ children, className, onclick }: TextLogoButtonForNavProps) {
    return (
        <button type='button' onClick={onclick}>
            <span className={className}>
                {children}
            </span>
        </button>
    )
}



//로그인 때 사용할 버튼
export const LoginButton = ({
    text,
    buttonClassName,
    textClassName,
    icon,
    href,
    onClick,
}: LoginButtonProps) => {
    return href ? (
        <a href={href} className={buttonClassName}>
            {icon && <span>{icon}</span>}
            <span className={textClassName}>{text}</span>
        </a>
    ) : (
        <button className={buttonClassName} onClick={onClick}>
            {icon && <span>{icon}</span>}
            <span className={textClassName}>{text}</span>
        </button>
    );
};

type TextAndIconButtonProps = {
    icon?: ReactNode;
    href?: string;
    type?: 'button' | 'submit' | 'reset';
    children?: ReactNode;
    onclick?: () => void;
}


export function TextAndIconButton({ icon, type, children, onclick }: TextAndIconButtonProps) {
    return (
        <button className='text-and-icon-button flex gap-2 items-center justify-center'
            onClick={onclick}
            type={type}>
            {icon}
            <span className='nav-text-button'>{children}</span>
        </button>
    )


};






type TextButtonForNavProps = {
    icon?: ReactNode;
    children?: ReactNode;
    className?: string; // 추가: 사용자 정의 클래스
    onClick?: () => void;
};

export function TextButtonForNav({
    icon,
    children,
    className = "",
    onClick,
}: TextButtonForNavProps) {
    return (
        <button
            className={`PostButtonForNav flex items-center gap-2 ${className}`}
            onClick={onClick}
        >
            {icon}
            <span className="nav-text-button">{children}</span>
        </button>
    );
}
type ViewAiResearchButtonProps = {
    icon?: ReactNode;
    children?: ReactNode;
}

export function ViewAiResearchButton({ icon, children }: ViewAiResearchButtonProps) {
    return (
        <button className='view-ai-research-button flex gap-2 items-center '>
            <span className='view-ai-research-button-text'>{children}</span>
            {icon}
        </button>
    )

}



