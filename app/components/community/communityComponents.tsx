'use client';
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import "@/app/globals.css";
import "@/app/(css)/community.css";
import axios from "axios";
import Image from "next/image";
import { addHours, formatDistanceToNow, parseISO } from "date-fns";
import { CategorySelectDropdown } from "./postComponents";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import 'swiper/css/bundle';

export interface CommunityPost {
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
}

interface Pageable {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

interface CommunityApiResponse {
    content: CommunityPost[]; // 게시글 배열
    pageable: Pageable; // 페이지 정보
    totalPages: number;
    totalElements: number;
    last: boolean; // 마지막 페이지 여부
    size: number; // 요청당 글 개수
    number: number; // 현재 페이지 번호  
    sort: Sort; // 정렬 정보
    numberOfElements: number; // 현재 페이지에서 가져온 게시글 수
    first: boolean; // 첫 페이지 여부
    empty: boolean; // 게시글이 비어있는지 여부
}

type FoodCategoryBadgeProps = {
    children: ReactNode;
}

type TextAndIconButtonProps = {
    icon?: ReactNode;
    children?: ReactNode;
}
export function TextAndIconButton({ icon, children }: TextAndIconButtonProps) {
    return (
        <button className='text-and-icon-button flex gap-2 items-center justify-center'>
            {icon}
            <span className='nav-text-button'>{children}</span>
        </button>
    )

}



export function ViewAiResearchButton() {
    return (
        <button className='view-ai-research-button'>
            <span className='view-ai-research-button-text'>View Ai Research <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clipPath="url(#clip0_113_5030)">
                    <path d="M12.9167 11.6667H12.2583L12.025 11.4417C13.025 10.275 13.5417 8.68337 13.2583 6.9917C12.8667 4.67503 10.9333 2.82503 8.6 2.5417C5.075 2.10837 2.10834 5.07503 2.54167 8.60003C2.825 10.9334 4.675 12.8667 6.99167 13.2584C8.68334 13.5417 10.275 13.025 11.4417 12.025L11.6667 12.2584V12.9167L15.2083 16.4584C15.55 16.8 16.1083 16.8 16.45 16.4584C16.7917 16.1167 16.7917 15.5584 16.45 15.2167L12.9167 11.6667ZM7.91667 11.6667C5.84167 11.6667 4.16667 9.9917 4.16667 7.9167C4.16667 5.8417 5.84167 4.1667 7.91667 4.1667C9.99167 4.1667 11.6667 5.8417 11.6667 7.9167C11.6667 9.9917 9.99167 11.6667 7.91667 11.6667Z" fill="white" />
                </g>
                <defs>
                    <clipPath id="clip0_113_5030">
                        <rect width="20" height="20" fill="white" />
                    </clipPath>
                </defs>
            </svg>
            </span>
        </button>
    )
}

function ConvertToTitleCase(str: string) {
    if (str === 'ETC') return 'ETC';
    if (str === 'ALL') return 'ALL';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function ViewAiResearchButtonForCarousel() {
    return (
        <button className='view-ai-research-button-carousel'>
            <span className='view-ai-research-button-text'>View Ai Research <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clipPath="url(#clip0_113_5030)">
                    <path d="M12.9167 11.6667H12.2583L12.025 11.4417C13.025 10.275 13.5417 8.68337 13.2583 6.9917C12.8667 4.67503 10.9333 2.82503 8.6 2.5417C5.075 2.10837 2.10834 5.07503 2.54167 8.60003C2.825 10.9334 4.675 12.8667 6.99167 13.2584C8.68334 13.5417 10.275 13.025 11.4417 12.025L11.6667 12.2584V12.9167L15.2083 16.4584C15.55 16.8 16.1083 16.8 16.45 16.4584C16.7917 16.1167 16.7917 15.5584 16.45 15.2167L12.9167 11.6667ZM7.91667 11.6667C5.84167 11.6667 4.16667 9.9917 4.16667 7.9167C4.16667 5.8417 5.84167 4.1667 7.91667 4.1667C9.99167 4.1667 11.6667 5.8417 11.6667 7.9167C11.6667 9.9917 9.99167 11.6667 7.91667 11.6667Z" fill="white" />
                </g>
                <defs>
                    <clipPath id="clip0_113_5030">
                        <rect width="20" height="20" fill="white" />
                    </clipPath>
                </defs>
            </svg>
            </span>
        </button>
    )
}

export function FoodCategoryBadge({ children }: FoodCategoryBadgeProps) {
    return (
        <span className='food-category-badge food-category-badge-text'>
            {children}
        </span>
    );
}

type CommunityImageProps = {
    imageUrls: string[];
    handleImageLoad: () => void;
    imageLoaded?: boolean;

}

export function CommunityImage({ imageUrls, handleImageLoad }: CommunityImageProps) {

    return (
        <div className='post-img-wrapper'>
            <Image
                src={imageUrls[0]} alt="img_error" className="img"
                onLoad={handleImageLoad}
                fill={true}
                style={{objectFit:'cover'}}
                sizes='100vh'
                priority
            />
            {/* objectfit - cover 할지 contain할지 정해야함 */}

            {/* {imageLoaded && <ViewAiResearchButton></ViewAiResearchButton>} */}
        </div >
    );
}

type CommunityImageCarouselProps = {
    imageUrls: string[];
    handleImageLoad: () => void;
}

const CommunityImageCarousel: React.FC<CommunityImageCarouselProps> = ({
    imageUrls,
    handleImageLoad,
}) => {
    return (
        <Swiper className='post-img-wrapper' pagination={true} modules={[Pagination]}>
            {imageUrls.map((url, index) => (
                <SwiperSlide key={index}
                    className='self-center h-full'>
                    {/* 이미지 */}
                    <Image
                        src={url}
                        alt={`Slide ${index + 1}`}
                        className="w-full object-cover display-block" // Tailwind CSS 클래스
                        // width={800} // 이미지 너비
                        // height={400} // 이미지 높이
                        priority={index === 0} // 첫 번째 슬라이드 이미지는 우선 로드
                        onLoad={handleImageLoad}
                        sizes="100vh"
                        fill={true}
                        style={{ objectFit: 'contain' }}
                    />
                </SwiperSlide>
            ))}
        </Swiper >

    );
};





// 마이데이터, 게시판에 게시글 리스트 보여주기용 컴포넌트



export function PostComponents() {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [page, setPage] = useState<number>(0);
    const [isLast, setIsLast] = useState<boolean>(false);
    const [category, setCategory] = useState<string>('All');
    const categoryList = ['All', 'Rice', 'Noodle', 'Soup', 'Dessert', 'Streetfood', 'Kimchi', 'ETC'];
    const [sortBy, setSortBy] = useState<string>('Latest');
    const sortByList = ['Latest', 'Likes'];

    // 감지할 마지막 요소 Ref
    const observerRef = useRef<HTMLDivElement | null>(null);

    const fetchPosts = useCallback(() => {
        if (isLast) return; // 이미 마지막 페이지면 요청하지 않음

        const categoryUpper = category.toUpperCase();
        const sortByLower = sortBy.toLowerCase();
        axios
            .get<CommunityApiResponse>(`${process.env.NEXT_PUBLIC_ROOT_API}/community`, {
                params: {
                    category: categoryUpper,
                    sortBy: sortByLower,
                    page,
                    size: 2,
                },
                headers: {
                    Authorization: `${localStorage.getItem('Authorization')}`
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    const { content, last } = response.data;
                    setPosts((prevPosts) => [...prevPosts, ...content]);
                    setIsLast(last);
                    setPage((prevPage) => prevPage + 1);
                }
            })
            .catch((error) => {
                console.error("error", error);
            });
    }, [isLast, page, category, sortBy]); // isLast와 page 상태만 의존성으로 사용

    const handleCategoryChange = (newCategory: string) => {
        setCategory(newCategory); // 카테고리 변경
        setPosts([]); // 게시글 초기화
        setPage(0); // 페이지 초기화
        setIsLast(false); // 마지막 페이지 여부 초기화
    }

    const handleSortByChange = (newSortBy: string) => {
        setSortBy(newSortBy); // 정렬 변경
        setPosts([]); // 게시글 초기화
        setPage(0); // 페이지 초기화
        setIsLast(false); // 마지막 페이지 여부 초기화
    }
    // 초기 데이터 로드
    useEffect(() => {
        if (page === 0) {
            fetchPosts(); // 처음 페이지일 때만 호출
        }
    }, [fetchPosts, page]);

    // 페이지가 1 이상일 때만 fetchPosts 호출
    const fetchNextPagePosts = useCallback(() => {
        if (page > 0) {
            fetchPosts(); // 페이지가 1 이상일 때만 호출
        }
    }, [page, fetchPosts]);





    // Intersection Observer 설정 (마지막 요소 감지해서 스크롤 시 추가 데이터)
    useEffect(() => {
        if (isLast) return; // 마지막 페이지면 Intersection Observer 설정하지 않음

        const observer = new IntersectionObserver(
            (entries) => {
                // 마지막 게시글이 반 정도 보이면 페이지 증가
                if (entries[0].isIntersecting) {
                    fetchNextPagePosts();
                }
            },
            {
                root: null, // viewport를 기준으로 관찰
                rootMargin: "0px", // root와의 간격 설정
                threshold: 0.5, // 요소가 50% 이상 보일 때
            }
        );

        const oberserRefCurrent = observerRef.current;

        if (oberserRefCurrent) {
            observer.observe(oberserRefCurrent); // 마지막 게시글 참조를 관찰
        }

        // Cleanup
        return () => {
            if (oberserRefCurrent) {
                observer.unobserve(oberserRefCurrent); // 관찰 해제
            }
        };
    }, [isLast, fetchNextPagePosts]);



    return (
        <>
            <div className="post-component-wrapper">
                <div style={{ backgroundColor: 'white' }} className='pb-[1rem] pl-[1rem] flex gap-[1rem]'>
                    <CategorySelectDropdown
                        defaultItem="All" // 기본 선택 값 설정
                        options={categoryList} // 드롭다운 옵션 전달
                        onSelect={handleCategoryChange}
                        value={category}
                    />
                    <CategorySelectDropdown
                        defaultItem="latest" // 기본 선택 값 설정
                        options={sortByList} // 드롭다운 옵션 전달
                        onSelect={handleSortByChange}
                        value={sortBy}
                    />
                </div>
                {posts.length === 0 ? (
                    null
                ) : (

                    posts.map((post) => (
                        <div key={post.communityKey}>
                            {/* 첫 번째 요소에만 CategorySelectDropdown 추가 */}

                            <PostContent key={post.communityKey} post={post} useManyImage={false} />
                        </div>
                    ))

                )}
                <div ref={observerRef} className="loading-placeholder h-1 invisible"
                />
            </div>
            <div className='flex justify-center' style={{ width: '100%', backgroundColor: 'white' }}>
                {isLast && <span className='text-center'
                >no more post</span>}
            </div>

        </>
    );
}
type CommunityPostProps = {
    post: CommunityPost;
    useManyImage: boolean;
    currentIndex?: number;
    handleNext?: () => void;
    handlePrev?: () => void;

}

export function PostContent({ post, useManyImage }: CommunityPostProps) {
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const [like, setLike] = useState<boolean>(post.liked);
    const [likeCount, setLikeCount] = useState<number>(post.likeCount);
    const imageUrls: string[] = post.imageUrls;

    const handleImageLoad = () => {
        setImageLoaded(true); // 이미지가 정상적으로 로드되었음을 확인
    };


    const DetailPostHandler = () => {
        //뒤로가기 시 제대로 작동 안하는 것 때문에 임시로 이렇게 해놓음
        location.href = `/community/${post.communityKey}`;
    }

    // 일단 좋아요 요청 보내는것만.
    const likeHandler = (event: React.MouseEvent) => {
        event.stopPropagation(); //부모요소 이벤트 방지(div 클릭시 상세 페이지로 이동하는 것 방지)

        if (like) {
            axios({
                method: 'delete',
                url: `${process.env.NEXT_PUBLIC_ROOT_API}/community/${post.communityKey}/likes`,
                headers: {
                    Authorization: `${localStorage.getItem('Authorization')}`
                }
            }).then((response) => {
                if (response.status === 200) {
                    setLike(false);
                    setLikeCount(likeCount - 1);
                }
            }).catch((error) => {
                console.log('error', error);
            })
        }
        if (!like) {
            axios({
                method: 'post',
                url: `${process.env.NEXT_PUBLIC_ROOT_API}/community/${post.communityKey}/likes`,
                headers: {
                    Authorization: `${localStorage.getItem('Authorization')}`
                }
            }).then((response) => {
                if (response.status === 200) {
                    setLike(true);
                    setLikeCount(likeCount + 1);
                }
            }).catch((error) => {
                console.log('error', error);
            })
        }

    }

    function TimeAgo({ timestamp }: { timestamp: string }) {
        const parsedDate = parseISO(timestamp);
        // 시간대 보정 (UTC 기준에서 ±9시간 조정)
        const adjustedDate = addHours(parsedDate, +9); // UTC+9를 위해 +9 (UTC-9면 -9로 설정)
        const timeAgo = formatDistanceToNow(adjustedDate, { addSuffix: true });
        const createTime = timeAgo.replace(/^about\s/, '');
        return createTime;
    }

    return (
        <div className='post-contents-wrapper self-center gap-2'
            onClick={useManyImage ? undefined : DetailPostHandler}>
            {/* 프로필 부분 */}
            <div className='post-profile-wrapper mt-2 relative'>
                <div
                    style={{
                        width: "2.25rem",
                        height: "2.25rem",
                        borderRadius: "50%",
                        backgroundColor: "#F1F3F6",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer", // 클릭 시 커서 변경
                        position: "relative",
                        overflow: 'hidden'
                    }}
                >
                    <Image
                        src={post.profileImage}
                        onLoad={handleImageLoad}
                        alt="미리보기"
                        style={{objectFit: "cover" }}
                        fill
                        priority
                        sizes='100vh'
                    />
                </div>
                <span className='post-profile-text flex-none'>{post.userName}</span>
            </div>
            {/* 이미지 부분 */}
            {useManyImage ? <CommunityImageCarousel
                imageUrls={imageUrls}
                handleImageLoad={handleImageLoad}
            ></CommunityImageCarousel>
                :
                <CommunityImage
                    imageUrls={imageUrls}
                    handleImageLoad={handleImageLoad}
                    imageLoaded={imageLoaded} />
            }
            <div className='post-contents-wrapper-row'>
                {/* 음식 카테고리 뱃지 입력받아서 넣기 */}
                <div className='post-contents-left'>
                    <div className='flex-row flex gap-2 justify-between'>
                        <FoodCategoryBadge>
                            {ConvertToTitleCase(post.category)}
                        </FoodCategoryBadge>
                    </div>
                    {/* 컨텐츠 제목 */}
                    <div>
                        <span className='post-content-text'>{post.title}</span>
                    </div>
                    <div className='post-date-wrapper'>
                        {/* 원래는 댓글 수 작성한 공간 */}
                        {/* <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.75 16.5C6.55109 16.5 6.36032 16.421 6.21967 16.2803C6.07902 16.1397 6 15.9489 6 15.75V13.5H3C2.60218 13.5 2.22064 13.342 1.93934 13.0607C1.65804 12.7794 1.5 12.3978 1.5 12V3C1.5 2.1675 2.175 1.5 3 1.5H15C15.3978 1.5 15.7794 1.65804 16.0607 1.93934C16.342 2.22064 16.5 2.60218 16.5 3V12C16.5 12.3978 16.342 12.7794 16.0607 13.0607C15.7794 13.342 15.3978 13.5 15 13.5H10.425L7.65 16.2825C7.5 16.425 7.3125 16.5 7.125 16.5H6.75ZM7.5 12V14.31L9.81 12H15V3H3V12H7.5Z" fill="#5A6E8C" />
                        </svg>
                        <span className='comment-date-text'>12</span> */}

                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="1" height="14" viewBox="0 0 1 14" fill="none">
                            <path d="M1 0.5V13.5H0V0.5H1Z" fill="#5A6E8C" />
                        </svg> */}

                        {/* 몇분 전 등록했는지 등록시간 - 현재시간 */}
                        <span className="comment-date-text"> <TimeAgo timestamp={post.createdAt} /></span>
                    </div>
                </div>
                <div className='post-contents-right'>
                    {/* 좋아요 수 */}
                    {like ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none"
                            onClick={likeHandler}
                            style={{ cursor: 'pointer' }}
                        >
                            <circle cx="18" cy="18" r="18" fill="#E0E4EB" />
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" x="9" y="9" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.3333 6.66663C15.3333 5.92663 14.7333 5.33329 14 5.33329H9.78663L10.4266 2.28663C10.44 2.21996 10.4466 2.14663 10.4466 2.07329C10.4466 1.79996 10.3333 1.54663 10.1533 1.36663L9.44663 0.666626L5.05996 5.05329C4.81329 5.29996 4.66663 5.63329 4.66663 5.99996V12.6666C4.66663 13.0202 4.8071 13.3594 5.05715 13.6094C5.3072 13.8595 5.64634 14 5.99996 14H12C12.5533 14 13.0266 13.6666 13.2266 13.1866L15.24 8.48663C15.3 8.33329 15.3333 8.17329 15.3333 7.99996V6.66663ZM0.666626 14H3.33329V5.99996H0.666626V14Z" fill="black" />
                            </svg>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none"
                            onClick={likeHandler}
                            style={{ cursor: 'pointer' }}
                        >
                            <circle cx="18" cy="18" r="18" fill="#E0E4EB" />
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" x="9" y="9">
                                <path d="M3.33334 5.99996V14H0.666672V5.99996H3.33334ZM6.00001 14C5.64638 14 5.30724 13.8595 5.0572 13.6094C4.80715 13.3594 4.66667 13.0202 4.66667 12.6666V5.99996C4.66667 5.63329 4.81334 5.29996 5.06001 5.05996L9.44667 0.666626L10.1533 1.37329C10.3333 1.55329 10.4467 1.79996 10.4467 2.07329L10.4267 2.28663L9.79334 5.33329H14C14.74 5.33329 15.3333 5.93329 15.3333 6.66663V7.99996C15.3333 8.17329 15.3 8.33329 15.24 8.48663L13.2267 13.1866C13.0267 13.6666 12.5533 14 12 14H6.00001ZM6.00001 12.6666H12.02L14 7.99996V6.66663H8.14001L8.89334 3.11996L6.00001 6.01996V12.6666Z" fill="#92A2B9" />
                            </svg>
                        </svg>
                    }

                    <span className='like-text'>{likeCount}</span>
                </div>
            </div>
            {/* 내용 부분 */}
        </div>
    )
}

export function DetailPostContent({ post, useManyImage }: CommunityPostProps) {
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const [like, setLike] = useState<boolean>(post.liked);
    const [likeCount, setLikeCount] = useState<number>(post.likeCount);
    const imageUrls: string[] = post.imageUrls;

    const handleImageLoad = () => {
        setImageLoaded(true); // 이미지가 정상적으로 로드되었음을 확인
    };


    // 일단 좋아요 요청 보내는것만.
    const likeHandler = (event: React.MouseEvent) => {
        event.stopPropagation(); //부모요소 이벤트 방지(div 클릭시 상세 페이지로 이동하는 것 방지)

        if (like) {
            axios({
                method: 'delete',
                url: `${process.env.NEXT_PUBLIC_ROOT_API}/community/${post.communityKey}/likes`,
                headers: {
                    Authorization: `${localStorage.getItem('Authorization')}`
                }
            }).then((response) => {
                if (response.status === 200) {
                    setLike(false);
                    setLikeCount(likeCount - 1);
                }
            }).catch((error) => {
                console.log('error', error);
            })
        }
        if (!like) {
            axios({
                method: 'post',
                url: `${process.env.NEXT_PUBLIC_ROOT_API}/community/${post.communityKey}/likes`,
                headers: {
                    Authorization: `${localStorage.getItem('Authorization')}`
                }
            }).then((response) => {
                if (response.status === 200) {
                    setLike(true);
                    setLikeCount(likeCount + 1);
                }
            }).catch((error) => {
                console.log('error', error);
            })
        }

    }

    function TimeAgo({ timestamp }: { timestamp: string }) {
        const parsedDate = parseISO(timestamp);
        // 시간대 보정 (UTC 기준에서 ±9시간 조정)
        const adjustedDate = addHours(parsedDate, +9); // UTC+9를 위해 +9 (UTC-9면 -9로 설정)
        const timeAgo = formatDistanceToNow(adjustedDate, { addSuffix: true });
        const createTime = timeAgo.replace(/^about\s/, '');
        return createTime;
    }

    return (
        <div className='post-contents-wrapper self-center gap-2'>
            {/* 프로필 부분 */}
            <div className='post-profile-wrapper mt-2 relative'>
                <div
                    style={{
                        width: "2.25rem",
                        height: "2.25rem",
                        borderRadius: "50%",
                        backgroundColor: "#F1F3F6",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        cursor: "pointer", // 클릭 시 커서 변경
                        position: "relative",
                        overflow: 'hidden'
                    }}
                >
                    <Image
                        src={post.profileImage}
                        onLoad={handleImageLoad}
                        alt="preview"
                        style={{objectFit: "cover" }}
                        fill
                        sizes='100vh'
                        priority
                    />
                </div>
                <span className='post-profile-text flex-none'>{post.userName}</span>
            </div>
            {/* 이미지 부분 */}
            {useManyImage ? <CommunityImageCarousel
                imageUrls={imageUrls}
                handleImageLoad={handleImageLoad}
            ></CommunityImageCarousel>
                :
                <CommunityImage
                    imageUrls={imageUrls}
                    handleImageLoad={handleImageLoad}
                    imageLoaded={imageLoaded} />
            }
            <div className='flex flex-1 mb-[1rem]'>
                <span className='post-content-text' style={{ fontSize: '1.5rem' }}>{post.title}</span>
            </div>
            <div className='post-detail-content-wrapper'>
                <span style={{
                    color: 'black', whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                }}>{post?.content}</span>
            </div>

            <div className='post-contents-wrapper content-text-wrapper self-center'>
                <div className='post-contents-wrapper-row-detail'>
                    {/* 음식 카테고리 뱃지 입력받아서 넣기 */}
                    <div className='post-contents-left'>
                        <div className='flex-row flex gap-2 justify-between'>
                            <FoodCategoryBadge>
                                {ConvertToTitleCase(post.category)}
                            </FoodCategoryBadge>
                        </div>
                        {/* 컨텐츠 제목 */}
                        <div className='post-date-wrapper'>
                            {/* 원래는 댓글 수 작성한 공간 */}
                            {/* <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.75 16.5C6.55109 16.5 6.36032 16.421 6.21967 16.2803C6.07902 16.1397 6 15.9489 6 15.75V13.5H3C2.60218 13.5 2.22064 13.342 1.93934 13.0607C1.65804 12.7794 1.5 12.3978 1.5 12V3C1.5 2.1675 2.175 1.5 3 1.5H15C15.3978 1.5 15.7794 1.65804 16.0607 1.93934C16.342 2.22064 16.5 2.60218 16.5 3V12C16.5 12.3978 16.342 12.7794 16.0607 13.0607C15.7794 13.342 15.3978 13.5 15 13.5H10.425L7.65 16.2825C7.5 16.425 7.3125 16.5 7.125 16.5H6.75ZM7.5 12V14.31L9.81 12H15V3H3V12H7.5Z" fill="#5A6E8C" />
                        </svg>
                        <span className='comment-date-text'>12</span> */}

                            {/* <svg xmlns="http://www.w3.org/2000/svg" width="1" height="14" viewBox="0 0 1 14" fill="none">
                            <path d="M1 0.5V13.5H0V0.5H1Z" fill="#5A6E8C" />
                        </svg> */}

                            {/* 몇분 전 등록했는지 등록시간 - 현재시간 */}
                            <span className="comment-date-text"> <TimeAgo timestamp={post.createdAt} /></span>
                        </div>
                    </div>
                    <div className='post-contents-right'>
                        {/* 좋아요 수 */}
                        {like ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none"
                                onClick={likeHandler}
                                style={{ cursor: 'pointer' }}
                            >
                                <circle cx="18" cy="18" r="18" fill="#E0E4EB" />
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" x="9" y="9" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.3333 6.66663C15.3333 5.92663 14.7333 5.33329 14 5.33329H9.78663L10.4266 2.28663C10.44 2.21996 10.4466 2.14663 10.4466 2.07329C10.4466 1.79996 10.3333 1.54663 10.1533 1.36663L9.44663 0.666626L5.05996 5.05329C4.81329 5.29996 4.66663 5.63329 4.66663 5.99996V12.6666C4.66663 13.0202 4.8071 13.3594 5.05715 13.6094C5.3072 13.8595 5.64634 14 5.99996 14H12C12.5533 14 13.0266 13.6666 13.2266 13.1866L15.24 8.48663C15.3 8.33329 15.3333 8.17329 15.3333 7.99996V6.66663ZM0.666626 14H3.33329V5.99996H0.666626V14Z" fill="black" />
                                </svg>
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none"
                                onClick={likeHandler}
                                style={{ cursor: 'pointer' }}
                            >
                                <circle cx="18" cy="18" r="18" fill="#E0E4EB" />
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" x="9" y="9">
                                    <path d="M3.33334 5.99996V14H0.666672V5.99996H3.33334ZM6.00001 14C5.64638 14 5.30724 13.8595 5.0572 13.6094C4.80715 13.3594 4.66667 13.0202 4.66667 12.6666V5.99996C4.66667 5.63329 4.81334 5.29996 5.06001 5.05996L9.44667 0.666626L10.1533 1.37329C10.3333 1.55329 10.4467 1.79996 10.4467 2.07329L10.4267 2.28663L9.79334 5.33329H14C14.74 5.33329 15.3333 5.93329 15.3333 6.66663V7.99996C15.3333 8.17329 15.3 8.33329 15.24 8.48663L13.2267 13.1866C13.0267 13.6666 12.5533 14 12 14H6.00001ZM6.00001 12.6666H12.02L14 7.99996V6.66663H8.14001L8.89334 3.11996L6.00001 6.01996V12.6666Z" fill="#92A2B9" />
                                </svg>
                            </svg>
                        }

                        <span className='like-text'>{likeCount}</span>
                    </div>
                </div>
            </div>
            {/* 내용 부분 */}
        </div>
    )
}