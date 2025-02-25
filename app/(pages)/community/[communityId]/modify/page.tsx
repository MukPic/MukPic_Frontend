'use client';
import { SvgButtonForNav } from "@/app/components/button";
import { AddImageUrl, CategorySelectDropdown } from "@/app/components/community/postComponents";
import TopNav from "@/app/components/TopNav";
import { usePostStore } from "@/app/types/postStore";
import { useUpdateImageStore } from "@/app/types/updateImgStore";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function BoardDetail() {
    const router = useRouter();
    // 쿼리 파라미터 추출
    const pathname = usePathname() as string;
    const [communityId, setCommunityId] = useState<string | null>(null);
    const categoryList: string[] = ['Rice', 'Noodle', 'Soup', 'Dessert', 'ETC', 'Streetfood', 'Kimchi']; // 드롭다운 옵션
    const maxLength = 300; // 최대 글자 수
    // 파라미터에서 communityId 추출
    useEffect(() => {
        if (pathname) {
            const match = pathname.match(/\/community\/([^/]+)/);
            if (match) {
                setCommunityId(match[1]); // communityId 추출
            }
        }
    }, [pathname]);

    // zustand 사용해서 받아 온 값을 상태에 저장해준다음 수정할 때, 페이지에 보여줄 때 사용

    const [initTitle, setInitTile] = useState<string>(''); // 수정 전 타이틀
    const [initContent, setInitContent] = useState<string>(''); // 수정 전 내용
    const [initCategory, setInitCategory] = useState<string>(''); // 수정 전 카테고리
    const [title, setTitle] = useState<string>(''); // 수정 후 타이틀
    const [content, setContent] = useState<string>(''); // 수정 후 내용
    const [category, setCategory] = useState<string>(''); // 수정 후 카테고리

    //이미지 url만 다른 컴포넌트로 처리해주므로 useStore 사용
    const setImageUrls = usePostStore((state) => state.setImageUrls);
    const updateImageUrls = useUpdateImageStore((state) => state.updateImageUrls);
    const setUpdateImageUrls = useUpdateImageStore((state) => state.setUpdateImageUrls);

    const [loading, setLoading] = useState<boolean>(true);

    interface UpdateData {
        title?: string;
        content?: string;
        imageUrl?: string[]; // 혹은 File[]
        category?: string;
    }

    function UpDateHandler() {
        const updateData: UpdateData = {};
        if ((title === '' || content === '' || category === '')) {
            const missingFields = [];

            if (category === '') {
                missingFields.push('category');
            }
            if (title === '') {
                missingFields.push('title');
            }
            if (content === '') {
                missingFields.push('content');
            }

            if (missingFields.length > 0) {
                const message = `Please fill in the following fields - ${missingFields.join(', ')}`;
                alert(message);
                return;
            }
        }

        if (title !== initTitle) {
            updateData.title = title;
        }
        if (content !== initContent) {
            updateData.content = content;
        }
        if (category !== initCategory) {
            updateData.category = category.toUpperCase();
        }
        if (updateImageUrls.length > 0) {
            updateData.imageUrl = updateImageUrls;
        }



        console.log('수정할 데이터:', updateData);
        axios({
            method: 'patch',
            url: `${process.env.NEXT_PUBLIC_ROOT_API}/community/${communityId}`,
            data: updateData,
            headers: {
                Authorization: `${localStorage.getItem('Authorization')}`
            }
        }).then((response) => {
            if (response.status == 200) {
                alert('Item successfully modified.');
                setImageUrls([]); // 이미지 url 초기화
                setUpdateImageUrls([]); // 이미지 url 초기화
                router.push(`/community/${communityId}`);
            }
        }).catch((error) => {
            console.error('게시글 수정 api 에러: ', error);

        })
    }



    // 컴포넌트 마운트 후 데이터 불러오기
    useEffect(() => {

        if (communityId) {
            axios.get(`${process.env.NEXT_PUBLIC_ROOT_API}/community/${communityId}`,
                {
                    headers:
                    {
                        Authorization: `${localStorage.getItem('Authorization')}`
                    }
                }
            )
                .then((response) => {
                    if (response.status === 200) {


                        // 유저 키 비교해서 접근 허용/비허용 코드드
                        // const userKeyFromLocalStorage = localStorage.getItem('userKey');
                        // if (response.data.userKey !== userKeyFromLocalStorage) {
                        //     alert('You do not have permission to view this.');
                        //     router.push(`/community/${communityId}`);
                        // }
                        setInitTile(response.data.title);
                        setInitContent(response.data.content);
                        setInitCategory(response.data.category);
                        setImageUrls(response.data.imageUrls);
                        setTitle(response.data.title);
                        setContent(response.data.content);
                        setCategory(response.data.category);
                        setLoading(false);
                    }
                    if (response.status === 401) {
                        alert('You do not have permission to view this.');
                        router.push('/community');
                    }
                })
                .catch((error) => {
                    alert('You do not have permission to view this.');
                    router.push(`/community/${communityId}`);
                    console.error('게시글 상세정보 조회 api 에러: ', error);
                });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [communityId, router]); // communityId가 변경될 때마다 호출


    const contentshandleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e?.target.value.length <= maxLength) {
            setContent(e.target.value);
        }
    }

    const titlehandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }
    // 로딩 상태와 에러 처리
    if (loading) return <div>Loading...</div>;

    return (
        <>
            <TopNav
                leftButton={
                    <SvgButtonForNav
                        onClick={() => { router.back(); }}>
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
                    </SvgButtonForNav>
                }
                rightButton={<button
                    className='text-and-icon-button flex gap-2 items-center justify-center'
                    onClick={UpDateHandler}>
                    <span className='nav-text-button'>Update</span>
                </button>}
            />
            <div className='community-container flex-1' style={{ background: '#F1F3F6' }}>
                <div className="write-wrapper">
                    {/* 카테고리 드롭다운 */}
                    <CategorySelectDropdown
                        defaultItem={
                            initCategory ?
                                initCategory.charAt(0).toUpperCase() + initCategory.slice(1).toLowerCase()
                                : 'Category'} // 기본 선택 값 설정
                        options={categoryList} // 드롭다운 옵션 전달
                        onSelect={(item) => setCategory(item)} // 선택된 항목 category로로 콜백
                    />
                    {/* 타이틀 */}
                    <label htmlFor="title" className='flex auth-input-label' >
                        <input type="text"
                            id='title'
                            placeholder="Title"
                            required
                            className='auth-placeholder grow text-left'
                            maxLength={20}
                            defaultValue={initTitle}
                            onChange={titlehandleChange}
                        />
                    </label>
                    {/* 내용 입력 */}
                    <label htmlFor="contents">
                        <textarea
                            defaultValue={initContent}
                            name="contents"
                            id="contents"
                            onChange={contentshandleChange}
                            placeholder='What did you eat? Let us know your experience!'
                        >
                        </textarea>
                        <div>
                            <span className='contents-length-span'>({content.length}/{maxLength})</span>
                        </div>
                    </label>

                    {/* 이미지 추가 */}
                    <AddImageUrl></AddImageUrl>
                </div>
            </div>
        </>

    );
}   