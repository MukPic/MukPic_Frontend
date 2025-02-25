'use client';
import { SvgButtonForNav } from "@/app/components/button";
import { Write } from "@/app/components/community/postComponents";
import TopNav from "@/app/components/TopNav";
import { usePostStore } from "@/app/types/postStore";
import { useUpdateImageStore } from "@/app/types/updateImgStore";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Post() {
    const router = useRouter();
    const title = usePostStore((state) => state.title);
    const content = usePostStore((state) => state.content);
    const category = usePostStore((state) => state.category);
    const updateImageUrls = useUpdateImageStore((state) => state.updateImageUrls);

    const UploadHandler = () => {

        // 이미지 등록 포스트 요청
        if (updateImageUrls.length !== 0 && category !== '' && title !== '' && content !== '') {
            // 게시글 등록 API 호출
            axios({
                method: 'post',
                url: `${process.env.NEXT_PUBLIC_ROOT_API}/community`,
                headers: {
                    Authorization: `${localStorage.getItem('Authorization')}`,
                },
                data: {
                    title: title,
                    content: content,
                    imageUrl: updateImageUrls,
                    category: category,
                }
            }).then((response) => {
                if (response.status === 200) {
                    alert('Upload Success');
                    location.href = '/community';
                }
            }).catch((error) => {
                alert('Upload Error');
                console.log('post upload error', error);
                router.push('/community');
            });
        }


        else {
            const missingFields = [];

            if (updateImageUrls.length === 0) {
                missingFields.push('image');
            }
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
            }
        }
    };

    return (
        <>
            <TopNav
                leftButton={
                    <SvgButtonForNav
                        onClick={() => {
                            if (window.history.length > 1) {
                                router.back();
                            } else {
                                router.push('/community'); // 기본 페이지로 이동
                            }
                        }} >
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
                    onClick={UploadHandler}>
                    <span className='nav-text-button'>Upload</span>
                </button>}
            />
            <div className='community-container flex-1' style={{ background: '#F1F3F6' }}>
                <Write />
            </div>
        </>

    );
}   