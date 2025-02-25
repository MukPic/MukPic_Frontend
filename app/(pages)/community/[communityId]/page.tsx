'use client';
import { SvgButtonForNav } from '@/app/components/button';
import { DetailPostContent } from '@/app/components/community/communityComponents';
import TopNav from '@/app/components/TopNav';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import '@/app/(css)/community.css';



// 게시글 상세 페이지
export default function BoardDetail() {
    const router = useRouter();
    const pathname = usePathname() as string;
    const [communityId, setCommunityId] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [userKey, setUserKey] = useState<number>(-5);
    const [rightButtonVisible, setRightButtonVisible] = useState<boolean>(false);




    const DropdownForNav = () => {
        const [isOpen, setIsOpen] = useState(false);
        const dropdownRef = useRef<HTMLDivElement>(null);

        const toggleDropdown = () => {
            setIsOpen((prev) => !prev);
        };

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };

            document.addEventListener("click", handleClickOutside);
            return () => document.removeEventListener("click", handleClickOutside);
        }, []);

        return (
            <div ref={dropdownRef} className="dropdown-container">
                <SvgButtonForNav
                    onClick={toggleDropdown}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="5" r="2" fill="#333" />
                        <circle cx="12" cy="12" r="2" fill="#333" />
                        <circle cx="12" cy="19" r="2" fill="#333" />
                    </svg>
                </SvgButtonForNav>
                {isOpen && (
                    <div className="food-category-dropdown-list absolute right-[1rem] top-[2.5rem]">
                        <ul>
                            <li
                                className='food-category-dropdown-item flex'
                                style={{ cursor: 'pointer' }}
                                onClick={() => ModifyHandler()}
                            >
                                <span className="flex flex-1">Modify</span>
                            </li>
                            <li
                                className='food-category-dropdown-item flex'
                                style={{ cursor: 'pointer' }}
                                onClick={() => DeleteHandler()}
                            >
                                <span className="flex flex-1">Delete</span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        );

    }

    type CommunityPost = {
        communityKey: number;
        title: string;
        content: string;
        imageUrls: string[];
        likeCount: number;
        profileImage: string;
        userName: string;
        createdAt: string;
        updatedAt: string;
        category: string;
        liked: boolean;
    };

    useEffect(() => {
        if (pathname) {
            // pathname에서 communityId 추출 (modify를 포함한 경로도 처리)
            const match = pathname.match(/\/community\/([^/]+)/);
            if (match) {
                setCommunityId(match[1]); // communityId 추출
            }
        }
    }, [pathname]);

    // 타입 정의


    // 상태 정의
    const [post, setPost] = useState<CommunityPost | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // 수정 버튼 클릭 시
    function ModifyHandler() {
        // 수정 페이지로 이동
        router.push(`/community/${communityId}/modify`);
    }

    function DeleteHandler() {
        const isConfirmed = window.confirm('Are you sure you want to delete it?');
        if (isConfirmed) {
            axios({
                method: 'delete',
                url: `${process.env.NEXT_PUBLIC_ROOT_API}/community/${communityId}`,
                headers: {
                    Authorization: `${localStorage.getItem('Authorization')}`
                }
            }).then((response) => {
                if (response.status === 401) {
                    alert('You do not have permission to delete this.')
                }
                alert('Item successfully deleted.');
                router.push('/community');

            }).catch((error) => {
                console.error('게시글 삭제 api 에러: ', error);
            })
        }
    }


    // 컴포넌트 마운트 후 데이터 불러오기
    useEffect(() => {
        if (communityId)
            axios.get(`${process.env.NEXT_PUBLIC_ROOT_API}/community/${communityId}`,
                {
                    headers: {
                        Authorization: `${localStorage.getItem('Authorization')}`
                    }
                })
                .then((response) => {
                    setPost(response.data);
                    setImageUrls(response.data.imageUrls);
                    setUserKey(response.data.userKey);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('게시글 상세정보 조회 api 에러러: ', error);
                });
    }, [communityId]); // communityId가 변경될 때마다 호출


    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        const prevIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length; // 순환 처리
        setTimeout(() => {
            setCurrentIndex(prevIndex);
            setIsAnimating(false);
        }, 300);
    };
    // 다음 이미지로 이동
    const handleNext = () => {
        if (isAnimating) return; // 애니메이션 중에는 버튼 막기
        setIsAnimating(true);

        const nextIndex = (currentIndex + 1) % imageUrls.length; // 순환 처리
        setTimeout(() => {
            setCurrentIndex(nextIndex);
            setIsAnimating(false);
        }, 300); // 슬라이드 애니메이션 시간
    };

    useEffect(() => {
        if (imageUrls.length < 0 && currentIndex >= imageUrls.length) {
            setCurrentIndex(0);
        }
    }, [imageUrls, currentIndex, setCurrentIndex]);

    //유저 키 비교해서 버튼 활성화
    useEffect(() => {
        const getUserKey = localStorage.getItem('userKey');
        if (Number(userKey) === Number(getUserKey)) {
            setRightButtonVisible(true);
        }
        else {
            setRightButtonVisible(false);
        }
    }, [userKey]);

    // 로딩 상태와 에러 처리
    if (loading) return <div>Loading...</div>;

    return (
        <>
            <div className='flex justify-start flex-col flex-grow' style={{ width: '100%' }}>
                <TopNav
                    leftButton={<SvgButtonForNav
                        onClick={() => { location.href = '/community' }}>
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
                    </SvgButtonForNav>}

                    // 임시로 넣은 아이콘
                    rightButton={rightButtonVisible ? <DropdownForNav /> : null}
                />
                <div className='flex justify-center' style={{ width: '100%' }}>
                    <div className='post-component-wrapper' >
                        {post && <DetailPostContent key={communityId} post={post}
                            useManyImage={true}
                            currentIndex={currentIndex} handlePrev={handlePrev}
                            handleNext={handleNext}></DetailPostContent>}
                    </div>
                </div>
            </div>
        </>
    );
}

