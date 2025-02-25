'use client';
import '@/app/(css)/community.css';
import { useEffect, useRef, useState } from 'react';
import '@/app/(css)/auth.css';
import { usePostStore } from '@/app/types/postStore';
import Image from 'next/image';
import axios from 'axios';
import { useUpdateImageStore } from '@/app/types/updateImgStore';

const DropDownIcon = () => {
    return (
        <svg width="9" height="5" viewBox="0 0 9 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 5L0.602885 0.5L8.39711 0.500001L4.5 5Z" fill="#0A0C10" />
        </svg>
    );
}
const ReverseDropdownIcon = () => {
    return (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 5L10.3971 9.5L2.60288 9.5L6.5 5Z" fill="#0A0C10" />
        </svg>
    );
}
type CategorySelectDropdownProps = {
    defaultItem?: string; // 기본 선택 항목
    options: string[]; // 드롭다운 옵션 목록
    onSelect: (item: string) => void; // 선택된 항목 전달 콜백
    value?: string;
};

export function CategorySelectDropdown({
    defaultItem,
    options,
    onSelect,
    value,
}: CategorySelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false); // 드롭다운 열림 상태
    const [selectedItem, setSelectedItem] = useState<string>(defaultItem ? defaultItem : ''); // 기본 선택 항목
    const dropdownRef = useRef<HTMLDivElement>(null); // 드롭다운 외부 클릭 감지

    // 드롭다운 열기/닫기 토글
    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    // 항목 선택
    const selectItem = (item: string) => {
        setSelectedItem(item); // 선택된 항목 업데이트
        setIsOpen(false); // 드롭다운 닫기
        onSelect(item); // 선택된 항목을 상위 컴포넌트로 전달
    };

    // 외부 클릭 시 드롭다운 닫기
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
            <button
                type="button"
                onClick={toggleDropdown}
                className="category-select-button"
            >
                <span>{value ? value : selectedItem}</span> {/* 버튼에 현재 선택된 항목 표시 */}
                {!isOpen ? <DropDownIcon /> : <ReverseDropdownIcon />}
            </button>
            {isOpen && (
                <div className="food-category-dropdown-list">
                    <ul>
                        {options.map((option) => (
                            <li
                                key={option}
                                className={`food-category-dropdown-item flex ${selectedItem === option ? "selected" : ""
                                    }`}
                                onClick={() => selectItem(option)}
                            >
                                <span className="flex flex-1">{option}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export function AddImageUrl() {

    const imageUrl = usePostStore((state) => state.imageUrls);
    const setImageUrl = usePostStore((state) => state.setImageUrls);
    const updateImageUrls = useUpdateImageStore((state) => state.updateImageUrls);
    const setUpdateImageUrls = useUpdateImageStore((state) => state.setUpdateImageUrls);


    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        // 파일 유형 및 크기 제한
        const allowedTypes = ["image/jpg", "image/jpeg", "image/JPG", "image/JPEG", "image/png", "image/PNG"];
        const maxSize = 10 * 1024 * 1024; // 10MB

        // 파일을 배열로 변환하여 순차적으로 검사
        Array.from(files).forEach((file) => {
            if (!allowedTypes.includes(file.type)) {
                alert('jpg, jpeg, png 파일만 업로드 가능합니다.');
                event.target.value = ''; // 파일 선택 초기화
                return;
            }

            if (file.size > maxSize) {
                alert('10MB 이하의 파일만 업로드 가능합니다.');
                event.target.value = ''; // 파일 선택 초기화
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'COMMUNITY');

            // 파일 업로드 요청 보내기
            axios({
                method: 'post',
                url: `${process.env.NEXT_PUBLIC_ROOT_API}/images/upload`,
                headers: {
                    Authorization: `${localStorage.getItem('Authorization')}`,
                },
                data: formData,
            }).then((response) => {
                if (response.status === 200) {
                    // 성공적으로 업로드된 이미지 URL을 상태에 추가
                    setImageUrl([...imageUrl, ...response.data]);
                    setUpdateImageUrls([...updateImageUrls, ...response.data]);
                }
            }).catch((error) => {
                console.log('upload error', error);
            });
        });
    };

    const removeImageModify = (index: number) => {
        setImageUrl(imageUrl.filter((_, i) => i !== index));  // imageUrls에서 삭제
        axios({
            method: 'delete',
            url: `${process.env.NEXT_PUBLIC_ROOT_API}/images/delete`,
            headers: {
                Authorization: `${localStorage.getItem('Authorization')}`,
            },
            params: {
                imageUrl: imageUrl[index],
            }
        }).then((response) => {

            if (response.status === 204) {
                setImageUrl(imageUrl.filter((_, i) => i !== index));  // imageUrls에서 삭제
                setUpdateImageUrls(updateImageUrls.filter((url) => url !== imageUrl[index]));
            }
        }).catch((error) => {
            console.log('delete error', error);
        })
    }

    return (
        <div className='add-image-container'>
            <div className="add-image-button">
                {/* 업로드 버튼 */}
                <label className="add-image-label">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        style={{ display: "none" }} // input을 숨기고 커스텀 스타일을 적용
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <g clipPath="url(#clip0_112_1638)">
                            <path d="M16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20Z" fill="#B1BDCD" />
                            <path d="M26.667 5.33268H22.4403L20.787 3.53268C20.2937 2.98602 19.5737 2.66602 18.827 2.66602H13.1737C12.427 2.66602 11.707 2.98602 11.2003 3.53268L9.56033 5.33268H5.33366C3.86699 5.33268 2.66699 6.53268 2.66699 7.99935V23.9993C2.66699 25.466 3.86699 26.666 5.33366 26.666H26.667C28.1337 26.666 29.3337 25.466 29.3337 23.9993V7.99935C29.3337 6.53268 28.1337 5.33268 26.667 5.33268ZM16.0003 22.666C12.3203 22.666 9.33366 19.6793 9.33366 15.9993C9.33366 12.3193 12.3203 9.33268 16.0003 9.33268C19.6803 9.33268 22.667 12.3193 22.667 15.9993C22.667 19.6793 19.6803 22.666 16.0003 22.666Z" fill="#B1BDCD" />
                        </g>
                        <defs>
                            <clipPath id="clip0_112_1638">
                                <rect width="32" height="32" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    <span className="add-image-text">Add image</span>
                </label>
            </div>
            {/* 이미지 미리보기 - imageUrls */}
            {imageUrl.length > 0 && (
                <>
                    {imageUrl.map((imageUrl, index) => (
                        <div className="image-preview relative" key={index}>
                            <Image
                                src={imageUrl} // URL 기반 이미지
                                alt={`preview-${index}`}
                                className="preview-img"
                                layout="intrinsic"
                                width={400}
                                height={300}
                            />
                            <button type='button' className="remove-image-btn" onClick={() => removeImageModify(index)}>
                                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="13" cy="13" r="10" fill="#2E2E34" />
                                    <path d="M13 14.5166L9.85828 17.6583C9.65967 17.8569 9.4069 17.9562 9.09995 17.9562C8.79301 17.9562 8.54023 17.8569 8.34162 17.6583C8.14301 17.4597 8.0437 17.2069 8.0437 16.9C8.0437 16.593 8.14301 16.3402 8.34162 16.1416L11.4833 13L8.34162 9.88538C8.14301 9.68677 8.0437 9.434 8.0437 9.12705C8.0437 8.82011 8.14301 8.56733 8.34162 8.36872C8.54023 8.17011 8.79301 8.0708 9.09995 8.0708C9.4069 8.0708 9.65967 8.17011 9.85828 8.36872L13 11.5104L16.1145 8.36872C16.3131 8.17011 16.5659 8.0708 16.8729 8.0708C17.1798 8.0708 17.4326 8.17011 17.6312 8.36872C17.8479 8.58538 17.9562 8.84268 17.9562 9.14059C17.9562 9.43851 17.8479 9.68677 17.6312 9.88538L14.4895 13L17.6312 16.1416C17.8298 16.3402 17.9291 16.593 17.9291 16.9C17.9291 17.2069 17.8298 17.4597 17.6312 17.6583C17.4145 17.875 17.1572 17.9833 16.8593 17.9833C16.5614 17.9833 16.3131 17.875 16.1145 17.6583L13 14.5166Z" fill="white" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

// export function AddImage() {

//     const images = usePostStore((state) => state.images);
//     const setImages = usePostStore((state) => state.setImages);
//     const imageUrl = usePostStore((state) => state.imageUrls);


//     // 이미지 추가 핸들러
//     const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const files = event.target.files;
//         if (!files) return;

//         // 파일 유형 및 크기 제한
//         const allowedTypes = ["image/jpg", "image/jpeg", "image/JPG", "image/JPEG", "image/png", "image/PNG"];
//         const maxSize = 10 * 1024 * 1024; // 10MB

//         // 파일을 배열로 변환하여 순차적으로 검사
//         Array.from(files).forEach((file) => {
//             if (!allowedTypes.includes(file.type)) {
//                 alert('jpg, jpeg, png 파일만 업로드 가능합니다.');
//                 event.target.value = ''; // 파일 선택 초기화
//                 return;
//             }

//             if (file.size > maxSize) {
//                 alert('10MB 이하의 파일만 업로드 가능합니다.');
//                 event.target.value = ''; // 파일 선택 초기화
//                 return;
//             }
//         });

//         // 유효한 파일들을 이미지 배열에 추가

//         setImages([...images, ...Array.from(files)]);
//     };


//     // 이미지 삭제 핸들러
//     const removeImage = (index: number) => {
//         setImages(images.filter((_, i) => i !== (index - imageUrl.length)));  // images에서 삭제
//     };





//     // 이미지 상태 확인용용
//     // useEffect(() => {
//     //     console.log('현재 이미지 상태 : ', images);
//     // }, [images]); // images 상태가 변경될 때마다 실행

//     return (
//         <div className='add-image-container'>
//             <div className="add-image-button">
//                 {/* 업로드 버튼 */}
//                 <label className="add-image-label">
//                     <input
//                         type="file"
//                         accept="image/*"
//                         multiple
//                         onChange={handleImageUpload}
//                         style={{ display: "none" }} // input을 숨기고 커스텀 스타일을 적용
//                     />
//                     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
//                         <g clipPath="url(#clip0_112_1638)">
//                             <path d="M16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20Z" fill="#B1BDCD" />
//                             <path d="M26.667 5.33268H22.4403L20.787 3.53268C20.2937 2.98602 19.5737 2.66602 18.827 2.66602H13.1737C12.427 2.66602 11.707 2.98602 11.2003 3.53268L9.56033 5.33268H5.33366C3.86699 5.33268 2.66699 6.53268 2.66699 7.99935V23.9993C2.66699 25.466 3.86699 26.666 5.33366 26.666H26.667C28.1337 26.666 29.3337 25.466 29.3337 23.9993V7.99935C29.3337 6.53268 28.1337 5.33268 26.667 5.33268ZM16.0003 22.666C12.3203 22.666 9.33366 19.6793 9.33366 15.9993C9.33366 12.3193 12.3203 9.33268 16.0003 9.33268C19.6803 9.33268 22.667 12.3193 22.667 15.9993C22.667 19.6793 19.6803 22.666 16.0003 22.666Z" fill="#B1BDCD" />
//                         </g>
//                         <defs>
//                             <clipPath id="clip0_112_1638">
//                                 <rect width="32" height="32" fill="white" />
//                             </clipPath>
//                         </defs>
//                     </svg>
//                     <span className="add-image-text">Add image</span>
//                 </label>
//             </div>

//             {/* 이미지 미리보기 - images (로컬 파일) */}
//             {images.length > 0 && (
//                 <>
//                     {images.map((image, index) => (
//                         <div className="image-preview relative" key={index}>
//                             <Image
//                                 src={URL.createObjectURL(image)} // Object URL 생성
//                                 alt={`preview-${index}`}
//                                 className="preview-img"
//                                 layout="intrinsic"
//                                 width={400}
//                                 height={300}
//                             />
//                             <button className="remove-image-btn" onClick={() => removeImage(index + imageUrl.length)}>
//                                 <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <circle cx="13" cy="13" r="10" fill="#2E2E34" />
//                                     <path d="M13 14.5166L9.85828 17.6583C9.65967 17.8569 9.4069 17.9562 9.09995 17.9562C8.79301 17.9562 8.54023 17.8569 8.34162 17.6583C8.14301 17.4597 8.0437 17.2069 8.0437 16.9C8.0437 16.593 8.14301 16.3402 8.34162 16.1416L11.4833 13L8.34162 9.88538C8.14301 9.68677 8.0437 9.434 8.0437 9.12705C8.0437 8.82011 8.14301 8.56733 8.34162 8.36872C8.54023 8.17011 8.79301 8.0708 9.09995 8.0708C9.4069 8.0708 9.65967 8.17011 9.85828 8.36872L13 11.5104L16.1145 8.36872C16.3131 8.17011 16.5659 8.0708 16.8729 8.0708C17.1798 8.0708 17.4326 8.17011 17.6312 8.36872C17.8479 8.58538 17.9562 8.84268 17.9562 9.14059C17.9562 9.43851 17.8479 9.68677 17.6312 9.88538L14.4895 13L17.6312 16.1416C17.8298 16.3402 17.9291 16.593 17.9291 16.9C17.9291 17.2069 17.8298 17.4597 17.6312 17.6583C17.4145 17.875 17.1572 17.9833 16.8593 17.9833C16.5614 17.9833 16.3131 17.875 16.1145 17.6583L13 14.5166Z" fill="white" />
//                                 </svg>
//                             </button>
//                         </div>
//                     ))}
//                 </>
//             )}
//         </div>

//     );
// }

export function Write() {
    const categoryList: string[] = ['Rice', 'Noodle', 'Soup', 'Dessert', 'ETC', 'Streetfood', 'Kimchi']; // 드롭다운 옵션
    const setCategory = usePostStore((state) => state.setCategory);
    const title = usePostStore((state) => state.title);
    const setTitle = usePostStore((state) => state.setTitle);
    const contents = usePostStore((state) => state.content);
    const setContents = usePostStore((state) => state.setContent);

    const titleMaxLength = 30;
    // 내용 입력 최대 글자 수
    const contentMaxLength = 300;

    const contentshandleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e?.target.value.length <= contentMaxLength) {
            setContents(e.target.value);
        }
    }

    const titlehandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }



    return (
        <div className="write-wrapper">
            {/* 카테고리 드롭다운 */}
            <CategorySelectDropdown
                defaultItem="Category" // 기본 선택 값 설정
                options={categoryList} // 드롭다운 옵션 전달
                onSelect={(item) => setCategory(item.toUpperCase())} // 선택된 항목 category로로 콜백
            />
            {/* 타이틀 */}
            <label htmlFor="title" className='flex auth-input-label' >
                <input type="text"
                    id='title'
                    placeholder="Title"
                    required
                    className='auth-placeholder text-left'
                    maxLength={titleMaxLength}
                    value={title}
                    onChange={titlehandleChange}
                />
            </label>
            {/* 내용 입력 */}
            <label htmlFor="contents">
                <textarea
                    value={contents}
                    name="contents"
                    id="contents"
                    onChange={contentshandleChange}
                    placeholder='What did you eat? Let us know your experience!'
                >
                </textarea>
                <div>
                    <span className='contents-length-span'>({contents.length}/{contentMaxLength})</span>
                </div>
            </label>

            {/* 이미지 추가 */}
            <AddImageUrl />
        </div>
    );
}

type ModifyProps = {
    initTitle: string;
    initContent: string;
    onDataChange: (data: { title: string, content: string }) => void;
};



export function Modify({ initTitle, initContent, onDataChange }: ModifyProps) {

    const categoryList: string[] = ['Rice', 'Noodle', 'Soup', 'Dessert', 'ETC', 'Streetfood', 'Kimchi']; // 드롭다운 옵션
    const setCategory = usePostStore((state) => state.setCategory);
    const [title, setTitle] = useState<string>(initTitle || '');
    const [content, setContent] = useState<string>(initContent || '');

    // 내용 입력 최대 글자 수
    const maxLength = 300;

    const contentshandleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e?.target.value.length <= maxLength) {
            setContent(e.target.value);
        }
    }

    const titlehandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }

    useEffect(() => {
        onDataChange({ title, content });
    }, [title, content, onDataChange]);


    return (
        <div className="write-wrapper">
            {/* 카테고리 드롭다운 */}
            <CategorySelectDropdown
                defaultItem="Category" // 기본 선택 값 설정
                options={categoryList} // 드롭다운 옵션 전달
                onSelect={(item) => setCategory(item.toUpperCase())} // 선택된 항목 category로로 콜백
            />
            {/* 타이틀 */}
            <label htmlFor="title" className='flex auth-input-label' >
                <input type="text"
                    id='title'
                    placeholder="Title"
                    required
                    className='auth-placeholder grow text-left'
                    maxLength={20}
                    value={title}
                    onChange={titlehandleChange}
                />
            </label>
            {/* 내용 입력 */}
            <label htmlFor="contents">
                <textarea
                    value={content}
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
            <AddImageUrl />
        </div>
    );
}