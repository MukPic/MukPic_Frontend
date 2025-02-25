'use client';
import { UseVaildate } from "@/app/hooks/useVaildate";
import { useSignupStore } from "@/app/types/signupStore";
import { UserNameValidateError } from "@/app/types/signupValidate";
import { userNameSchema } from "@/schemas/auth";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { addUserKey, createAuthCookie } from "./authFunctions";


type Props = {
    message: string;
    error: boolean;
    className?: string;
}
type IconProps = {
    error: boolean;
}

export function ValidateIcon({ error }: IconProps) {
    return (
        <span className={`badge badge-xs ${error ? 'badge-error' : 'badge-success'}`}></span>
    );
}

export function ValidateSpan({ message, error, className }: Props) {
    return (
        <span className={`label-text-alt text-left pl-[1.25rem] ${className}`} style={{ display: error ? 'block' : 'none' }}>
            {message}
        </span>
    );
}

function FormatStringArray(input: string[]): string[] {
    return input.map((str) => str.replace(/\s+/g, "_").toUpperCase());
}

export function DropDownIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <g clipPath="url(#clip0_112_2361)">
                <path d="M11.6133 15.6133L15.0667 19.0666C15.5867 19.5866 16.4267 19.5866 16.9467 19.0666L20.4 15.6133C21.24 14.7733 20.64 13.3333 19.4533 13.3333H12.5467C11.36 13.3333 10.7733 14.7733 11.6133 15.6133Z" fill="black" />
            </g>
            <defs>
                <clipPath id="clip0_112_2361">
                    <rect width="32" height="32" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

export function DropDownIconReverse() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M20.3867 16.3867L16.9333 12.9334C16.4133 12.4134 15.5733 12.4134 15.0533 12.9334L11.6 16.3867C10.76 17.2267 11.36 18.6667 12.5467 18.6667L19.4533 18.6667C20.64 18.6667 21.2267 17.2267 20.3867 16.3867Z" fill="black" />
        </svg>
    )
}

export function GoogleSignup() {
    {

        const [personalInfoAgree, setpersonalInfoAgree] = useState<boolean>(false);
        const [termsAgree, settermsAgree] = useState<boolean>(false);
        const [isAgree, setIsAgree] = useState<boolean>(false);
        const setAgree = useSignupStore(state => state.setagree);
        const router = useRouter();


        // 토큰값 없으면 next 버튼 비활성화
        useEffect(() => {
            if (localStorage.getItem('googleLoginToken') != null) {
                setIsAgree(personalInfoAgree && termsAgree);
            }
        }, [personalInfoAgree, termsAgree]);

        const checkboxChange = (e: React.ChangeEvent<HTMLInputElement>,
            setFunction: React.Dispatch<React.SetStateAction<boolean>>
        ) => {
            setFunction(e.target.checked);
        };

        const handleSumbit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setAgree(true);
            router.push('/signup/google/step3');
        }

        return (
            <form onSubmit={handleSumbit} className='flex flex-col gap-[0.75rem] flex-grow' >
                <div className='card'>
                    <div className="form-control primary">
                        <label className="cursor-pointer label">
                            <span className="label-text">개인정보 및 민감정보 사용 동의</span>
                            <input type="checkbox" className='dropdown-checkbox'
                                onChange={(e) => checkboxChange(e, setpersonalInfoAgree)} />
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="cursor-pointer label">
                            <span className="label-text">이용 약관 동의</span>
                            <input type="checkbox" className='dropdown-checkbox'
                                onChange={(e) => checkboxChange(e, settermsAgree)} />
                        </label>
                    </div>
                </div>
                <button
                    className='auth-button auth-button-id sign-up-button-text'
                    disabled={!isAgree}
                >Next
                </button>
            </form>
        );
    }
}

export function GoogleSignupStep3() {
    const { errors, validateField } = UseVaildate<UserNameValidateError>(userNameSchema);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const userName = useSignupStore(state => state.userName);
    const setuserName = useSignupStore(state => state.setuserName);
    const router = useRouter();
    //이미지 상태관리 (디폴트값 : noImage)
    const setImage = useSignupStore(state => state.setImage);

    //이미지 업로드
    const [profileImage, setProfileImage] = useState<File | null>(null); // 선택한 이미지 파일
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 미리보기 URL

    //이메일 체크용
    const email = useSignupStore(state => state.email);

    const [canUseUserName, setCanUseuserName] = useState<boolean>(false);
    const [userNameDuplicateMessage, setUserNameDuplcateMessage] = useState<string>('');
    const [messageColor, setMessageColor] = useState<string>('');
    const [checkButtonDisabled, setCheckButtonDisabled] = useState<boolean>(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        validateField(name, value);
        if (name === 'userName') {
            setuserName(value);
            setUserNameDuplcateMessage('');
            setCanUseuserName(false);
        }
    };

    const CheckUserNameDuplicateHandler = async () => {
        axios({
            method: 'get',
            url: `${process.env.NEXT_PUBLIC_ROOT_API}/users/checkUserName`,
            params: {
                userName: userName,
                email: email
            },
            responseType: 'json'
        }).then(function (response) {
            //이미 있는 경우 true 반환
            if (response.data === true) {
                setCanUseuserName(false);
                setUserNameDuplcateMessage('This userName is already exist');
                setMessageColor('text-red-500');
            }
            else {
                setCanUseuserName(true);
                setUserNameDuplcateMessage('This userName is available');
                setMessageColor('text-green-500');
            }
        }).catch(function () {
            alert('failed to check userName');
        });
    }

    useEffect(() => {
        setIsButtonDisabled(!!errors?.userName || !userName.trim() || !canUseUserName);
    }, [errors, userName, canUseUserName]);

    useEffect(() => {
        setCheckButtonDisabled(!userName.trim() || !!errors?.userName);
    }, [userName, errors]);

    //폼 제출 시 이미지 제출도 저장
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (profileImage) {
            const formData = new FormData();
            formData.append('file', profileImage);
            formData.append('type', 'PROFILE');
            axios({
                method: 'post',
                url: `${process.env.NEXT_PUBLIC_ROOT_API}/images/upload`,
                data: formData,
            }).then(function (response) {
                if (response.status === 200) {
                    setImage(response.data[0]);
                    router.push('/signup/google/step4');
                }
            }).catch(function () {
                alert('failed to upload image');
            });
        }

        router.push('/signup/google/step4');
    }

    //이미지 업로드 포스트 요청
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/jpg", "image/jpeg", "image/JPG", "image/JPEG",
            'image/png', 'image/PNG'
        ];

        if (!allowedTypes.includes(file.type)) {
            alert('jpg, jpeg, png 파일만 업로드 가능합니다.');
            e.target.value = '';
            return;
        }
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            alert('10MB 이하의 파일만 업로드 가능합니다.');
            e.target.value = '';
            return;
        }

        // 선택한 파일을 상태에 저장
        setProfileImage(file);

        // 미리보기 URL 생성
        const previewUrl = URL.createObjectURL(file);
        setPreviewUrl(previewUrl);
    };


    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-[0.75rem] flex-grow'>
            {/* 이미지 업로드용 숨겨진 input */}
            <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{
                    display: "none", // input을 숨기기
                }}
                onChange={handleFileChange} // 파일 선택 시 처리
            />
            <label className='flex items-center gap-8'>
                {/* 원형 미리보기 이미지 및 아이콘 */}
                <div
                    style={{
                        width: "6.25rem",
                        height: "6.25rem",
                        borderRadius: "50%",
                        backgroundColor: "#F1F3F6",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer", // 클릭 시 커서 변경
                        position: "relative",
                        overflow: previewUrl ? 'hidden' : 'visible'
                    }}
                    onClick={() => document.getElementById('fileInput')?.click()} // 클릭 시 파일 선택
                >
                    {previewUrl ? (
                        <Image
                            src={previewUrl}
                            alt="미리보기"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            layout="intrinsic"
                            width={400}
                            height={300}
                        />
                    ) : null}
                    {previewUrl ?
                        null :
                        (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                className='camera-circle'
                            >
                                <circle cx="12" cy="12" r="11.5" fill="white" stroke="#C7C7CC" />

                                <svg
                                    className="camera-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="-4 -4 24 24"
                                    fill="none"
                                >
                                    <g clipPath="url(#clip0_112_2331)">
                                        <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" fill="#8E8E93" />
                                        <path d="M12.8 3.22222H10.898L10.154 2.39722C9.932 2.14667 9.608 2 9.272 2H6.728C6.392 2 6.068 2.14667 5.84 2.39722L5.102 3.22222H3.2C2.54 3.22222 2 3.77222 2 4.44444V11.7778C2 12.45 2.54 13 3.2 13H12.8C13.46 13 14 12.45 14 11.7778V4.44444C14 3.77222 13.46 3.22222 12.8 3.22222ZM8 11.1667C6.344 11.1667 5 9.79778 5 8.11111C5 6.42444 6.344 5.05556 8 5.05556C9.656 5.05556 11 6.42444 11 8.11111C11 9.79778 9.656 11.1667 8 11.1667Z" fill="#8E8E93" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_112_2331">
                                            <rect width="16" height="16" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </svg>
                        )
                    }
                </div>

                {/* 텍스트 */}
                <span className='signup-text signup-text-gray'>
                    Set Your Profile Image
                </span>
            </label>
            <label htmlFor="userName" className="flex auth-input-label items-center">
                <input
                    id="userName"
                    name="userName"
                    type="userName"
                    placeholder="Enter Your Name"
                    onChange={handleChange}
                    value={userName}
                    className='auth-placeholder grow text-left' />
                <button
                    type='button'
                    className='flex items-center justify-center verify-button-send verify-button nav-text-button'
                    onClick={CheckUserNameDuplicateHandler}
                    disabled={checkButtonDisabled}
                >
                    Check
                </button>
            </label>
            <div>
                {errors?.userName && <ValidateSpan message={errors?.userName[0]} error={!!errors?.userName}></ValidateSpan>}
                {userNameDuplicateMessage && <ValidateSpan message={userNameDuplicateMessage} error={!!userNameDuplicateMessage}
                    className={messageColor}></ValidateSpan>}
            </div>
            <button className='auth-button auth-button-id sign-up-button-text'
                type='submit'
                disabled={isButtonDisabled}
            >Next
            </button>
        </form>
    );
}


type DropdownProps = {
    options: string[];
    buttonName: string;
    isMultiSelect?: boolean;
    onSelect: (selected: string | string[]) => void;
    buttonColor?: string;
}

export function Dropdown({ options, buttonName, isMultiSelect, onSelect, buttonColor }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false); // 드롭다운 열림 상태
    const [selectedItems, setSelectedItems] = useState<string[]>([]); // 선택된 항목 리스트
    const [selectedItem, setSelectedItem] = useState<string | null>(null); // 단일 선택용
    const dropdownRef = useRef<HTMLDivElement>(null); // 드롭다운 외부 클릭 감지

    // 드롭다운 토글
    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    // 항목 선택
    const selectItem = (item: string) => {
        if (isMultiSelect) {
            if (selectedItems.includes(item)) {
                // 체크 해제: 선택된 항목에서 제거
                const newSelectedItems = selectedItems.filter((selected) => selected !== item);
                setSelectedItems(newSelectedItems);
                onSelect(newSelectedItems); // 부모로 선택된 항목 전달
            } else {
                // 체크: 선택된 항목에 추가
                const newSelectedItems = [...selectedItems, item];
                setSelectedItems(newSelectedItems);
                onSelect(newSelectedItems); // 부모로 선택된 항목 전달
            }
        } else {
            setSelectedItem(item);
            setIsOpen(false);
            onSelect(item); // 부모로 선택된 항목 전달
        }
    };

    // 뱃지 삭제
    const removeBadge = (item: string) => {
        if (isMultiSelect) {
            const newSelectedItems = selectedItems.filter((selected) => selected !== item);
            setSelectedItems(newSelectedItems);
            onSelect(newSelectedItems); // 부모로 선택된 항목 전달
        } else {
            setSelectedItem(null);
            onSelect(""); // 부모로 선택 해제 상태 전달
        }
    };

    // 드롭다운 외부 클릭 감지
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
            {/* 드롭다운 버튼 */}
            <button
                type="button"
                onClick={toggleDropdown}
                className="profile-dropdown-button"
            >
                <span>{buttonName}</span>
                {!isOpen ? <DropDownIcon /> : <DropDownIconReverse />}
            </button>

            {/* 드롭다운 리스트 */}
            {isOpen && (
                <div className="dropdown-list">
                    <ul>
                        {options.map((option) => (
                            <li
                                key={option}
                                className="dropdown-item flex"
                                onClick={() => selectItem(option)}
                            >
                                <span className="flex">{option}</span>
                                {/* 여기에 체크박스 추가 */}
                                {isMultiSelect ? (
                                    <span className='dropdown-checkbox'>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(option)}
                                            onChange={() => selectItem(option)}
                                        />
                                    </span>) :
                                    (
                                        null
                                    )
                                }
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 선택된 항목 표시 (뱃지) */}
            <div className='dropdown-badge-container'>
                {isMultiSelect ? selectedItems.map((item) => (
                    <button
                        key={item}
                        className="dropdown-badge dropdown-badge-green"
                        onClick={() => removeBadge(item)}
                        style={{ backgroundColor: buttonColor }}
                    >
                        {item} ×
                    </button>
                ))
                    : selectedItem && (
                        <button
                            key={selectedItem}
                            className="dropdown-badge dropdown-badge-green"
                            onClick={() => removeBadge(selectedItem)}
                            style={{ backgroundColor: buttonColor }}
                        >
                            {selectedItem} ×
                        </button>
                    )}
            </div>
        </div>
    );
}

export function GoogleSignupStep4() {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null); // 지역 선택 상태
    const [selectedReligions, setSelectedReligions] = useState<string | null>(null); // 종교 선택 상태
    const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState<string[]>([]); // 식습관 선택 상태
    const [selectedChronicDisease, setSelectedChronicDisease] = useState<string[]>([]); // 만성질환 선택 상태
    const router = useRouter();

    const setNationality = useSignupStore(state => state.setnationality);
    const setReligion = useSignupStore(state => state.setreligion);
    const setDietaryPreferences = useSignupStore(state => state.setDietaryPreferences);
    const setChronicDiseaseTypes = useSignupStore(state => state.setChronicDiseaseTypes);

    const countryList: string[] = [
        "Afghanistan",
        "Albania",
        "Algeria",
        "Andorra",
        "Angola",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bhutan",
        "Bolivia",
        "Bosnia and Herzegovina",
        "Botswana",
        "Brazil",
        "Brunei",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cabo Verde",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Central African Republic",
        "Chad",
        "Chile",
        "China",
        "Colombia",
        "Comoros",
        "Congo (Congo-Brazzaville)",
        "Costa Rica",
        "Croatia",
        "Cuba",
        "Cyprus",
        "Czechia (Czech Republic)",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Eswatini (fmr. Swaziland)",
        "Ethiopia",
        "Fiji",
        "Finland",
        "France",
        "Gabon",
        "Gambia",
        "Georgia",
        "Germany",
        "Ghana",
        "Greece",
        "Grenada",
        "Guatemala",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Holy See",
        "Honduras",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran",
        "Iraq",
        "Ireland",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Korea (North)",
        "Korea (South)",
        "Kosovo",
        "Kuwait",
        "Kyrgyzstan",
        "Laos",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands",
        "Mauritania",
        "Mauritius",
        "Mexico",
        "Micronesia",
        "Moldova",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Morocco",
        "Mozambique",
        "Myanmar (Burma)",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "North Macedonia",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestine State",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Poland",
        "Portugal",
        "Qatar",
        "Romania",
        "Russia",
        "Rwanda",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Vincent and the Grenadines",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Sudan",
        "Spain",
        "Sri Lanka",
        "Sudan",
        "Suriname",
        "Sweden",
        "Switzerland",
        "Syria",
        "Tajikistan",
        "Tanzania",
        "Thailand",
        "Timor-Leste",
        "Togo",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates",
        "United Kingdom",
        "United States of America",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Venezuela",
        "Vietnam",
        "Yemen",
        "Zambia",
        "Zimbabwe"
    ];
    const religionList: string[] = ["Atheism", "Christianity", "Buddhism", "Catholicism", "Islam",
        "Hinduism"];
    const dietaryPreferences: string[] = ['Halal', 'Kosher', "Vegetarian", "Vegan",
        "Pescatarian", "Low Spice tolerance", "No Alcohol", 'Gluten Free', 'Lactose Free', 'Low Carb'];
    const chronicDiseaseList: string[] = ['Cancer', 'Diabetes', 'Osteoporosis', 'Heart Disease'];
    const isFormValid = selectedCountry && selectedReligions;


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setSelectedCountry(selectedCountry);
        setSelectedReligions(selectedReligions);
        setSelectedDietaryPreferences(selectedDietaryPreferences);
        setSelectedChronicDisease(selectedChronicDisease);

        // useSignupStore 상태 업데이트 (대문자로 변환)
        // 배열의 경우 공백 사이에 _를 추가하고 대문자로 변환해주는 FormatStringArray 함수 사용
        setNationality((selectedCountry ?? "").toUpperCase());  // 국가 정보 설정
        setReligion((selectedReligions ?? "").toUpperCase());   // 종교 정보 설정
        setDietaryPreferences(FormatStringArray(selectedDietaryPreferences));  // 식습관 설정
        setChronicDiseaseTypes(FormatStringArray(selectedChronicDisease)); // 만성질환 설정


        router.push('/signup/google/step5');
    }


    return (
        <form onSubmit={handleSubmit} className='signup-text signup-text-black flex-grow flex flex-col gap-[8rem]'>
            <div>
                <Dropdown
                    options={countryList}
                    buttonName="Select Your Country"
                    isMultiSelect={false}
                    onSelect={(selected) => setSelectedCountry(selected as string | null)}
                    buttonColor='#E0E4EB'
                />
            </div>
            <div>
                <Dropdown
                    options={religionList}
                    buttonName="Select Your Religion"
                    isMultiSelect={false}
                    onSelect={(selected) => setSelectedReligions(selected as string | null)}
                />
            </div>
            <div>
                <Dropdown
                    options={dietaryPreferences}
                    buttonName="Select Your DietaryPreferences"
                    isMultiSelect={true}
                    onSelect={(selected) => setSelectedDietaryPreferences(selected as string[])}
                />
            </div>
            <div>
                <Dropdown
                    options={chronicDiseaseList}
                    buttonName="Select Your Chronic Disease"
                    isMultiSelect={true}
                    onSelect={(selected) => setSelectedChronicDisease(selected as string[])}
                    buttonColor="#FFC4B3"
                />
            </div>
            <button className='auth-button auth-button-id sign-up-button-text'
                type='submit'
                disabled={!isFormValid}
            >Next
            </button>
        </form >
    );
}

export function GoogleSignupStep5() {
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]); // 알레르기 선택 상태
    const [AllergiesSearch, setAllergiesSearch] = useState<string>(''); // 검색어 상태
    const [showDropdown, setShowDropdown] = useState<boolean>(false); // 드롭다운 표시 여부
    const inputRef = useRef<HTMLInputElement | null>(null);

    const seaFoodAllergieList = ['Abalone', 'Crab', 'Fish', 'Mussel', 'Oyster', 'Shellfish', 'Shrimp', 'Squid'];
    const fruitAllergieList = ['Peach', 'Tomato'];
    const nutsAllergieList = ['Buck wheat', 'Peanut', 'Pine nut', 'Soybean', 'Walnut', 'Wheat'];
    const meatAllergieList = ['Beef', 'Chicken', 'Eggs', 'Milk', 'Pork'];
    const etcAllergieList = ['Sulfurous'];
    const email = useSignupStore.getState().email;
    const router = useRouter();
    const setAllergyTypes = useSignupStore(state => state.setAllergyTypes);
    // 최종 회원 가입을 위한 상태 가져오기
    const { userName, nationality, religion, chronicDiseaseTypes, dietaryPreferences, image } = useSignupStore.getState();

    // 모든 알레르기 리스트 합치기기
    const allAllergies = [...seaFoodAllergieList, ...fruitAllergieList, ...nutsAllergieList, ...meatAllergieList, ...etcAllergieList];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // formatStringArray 함수 사용해서 알러지들 공백에 _ 추가하고 대문자로 변환환
        setAllergyTypes(FormatStringArray(selectedAllergies));
        const { allergyTypes } = useSignupStore.getState();


        const signupData = {
            userName, nationality, religion,
            ...(allergyTypes && allergyTypes.length > 0 && { allergyTypes }), // 배열의 경우 빈 배열 제외
            ...(chronicDiseaseTypes && chronicDiseaseTypes.length > 0 && { chronicDiseaseTypes }),
            ...(dietaryPreferences && dietaryPreferences.length > 0 && { dietaryPreferences }),
            ...(image && { image }),
        };


        if (localStorage.getItem('googleLoginToken') != null) {

            const token = localStorage.getItem('googleLoginToken');
            const requestData = signupData;

            axios.patch(
                `${process.env.NEXT_PUBLIC_ROOT_API}/users/editUserInfo`,
                requestData,
                {
                    headers: {
                        Authorization: token, // Authorization 헤더 Bearer 저장할때 추가 돼 있어서 토큰만 넣게 수정했음
                    },
                }
            )
                .then((response) => {
                    if (response.status === 200) {
                        // 회원가입 성공 시 로컬스토리지 초기화 및 환영 메시지 출력
                        localStorage.removeItem('googleLoginToken');

                        alert('All set! Welcome aboard!');
                        if (localStorage.getItem('googleLoginToken')) {
                            localStorage.removeItem('googleLoginToken');
                        }
                        const googleAuthUrl = `${process.env.NEXT_PUBLIC_ROOT_API}/auth/email-login`;

                        axios({
                            url: googleAuthUrl,
                            method: 'post',
                            data: {
                                email: email
                            },
                        }).then(response => { 
                                const Authorization = response.headers['authorization'];
                                localStorage.setItem('Authorization', Authorization);
                                // 미들웨어를 위한 쿠키 설정
                                createAuthCookie(Authorization);
                                //userKey 추가
                                addUserKey(response.data.userKey);
                                router.push('/');
                        }).catch(() => {
                            router.push('/login');
                        });

                        // location.href = googleAuthUrl;
                        // router.push(googleAuthUrl);
                    }else {
                        alert('Failed to sign up Please try again');
                        router.push('/login');
                    }

                })
                .catch((error) => {
                    alert(' Unknow Error Failed to sign up Please try again');
                    console.log(error);
                    // router.push('/login');
                });
        }
    };

    // 알레르기 선택 토글
    const toggleAllergy = (allergy: string) => {
        setSelectedAllergies(prev =>
            prev.includes(allergy) ? prev.filter(item => item !== allergy) : [...prev, allergy]
        );
    };

    // 검색에 입력시 상태 업데이트트
    const AllergiesSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAllergiesSearch(e.target.value);
    };

    //검색창 외 클릭시 드롭다운 숨김
    const handleClickOutside = (e: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
            setShowDropdown(false);
        }
    };

    // 검색어에 따라 필터링된 알레르기 리스트
    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const filteredAllergies = AllergiesSearch
        ? allAllergies.filter(allergy => allergy.toLowerCase().includes(AllergiesSearch.toLowerCase()))
            .sort()
        : allAllergies.sort();

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-10 flex-grow'>
            <h1 className="text-xl font-bold mb-4">Please select your allergy</h1>

            <div className="relative z-100" ref={inputRef}>
                <label htmlFor="AllergiesSearch" className="flex auth-input-label items-center">
                    <input
                        id="AllergiesSearch"
                        name="AllergiesSearch"
                        type="text"
                        placeholder="Search All your Allergies"
                        className="auth-placeholder grow text-left"
                        value={AllergiesSearch}
                        onChange={AllergiesSearchChange}
                        onFocus={() => setShowDropdown(true)} // 포커스 시 드롭다운 표시
                    />
                    <button type="button" className="flex items-center justify-center">
                        {/* 검색 아이콘 */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.4999 14H14.7099L14.4299 13.73C15.6299 12.33 16.2499 10.42 15.9099 8.39002C15.4399 5.61002 13.1199 3.39002 10.3199 3.05002C6.08989 2.53002 2.52989 6.09001 3.04989 10.32C3.38989 13.12 5.60989 15.44 8.38989 15.91C10.4199 16.25 12.3299 15.63 13.7299 14.43L13.9999 14.71V15.5L18.2499 19.75C18.6599 20.16 19.3299 20.16 19.7399 19.75C20.1499 19.34 20.1499 18.67 19.7399 18.26L15.4999 14ZM9.49989 14C7.00989 14 4.99989 11.99 4.99989 9.50002C4.99989 7.01002 7.00989 5.00002 9.49989 5.00002C11.9899 5.00002 13.9999 7.01002 13.9999 9.50002C13.9999 11.99 11.9899 14 9.49989 14Z" fill="#5A6E8C" />
                        </svg>
                    </button>
                </label>
                {showDropdown && filteredAllergies.length > 0 ? (
                    <div className="relative  max-h-60 overflow-y-auto mt-0 rounded-lg bg-[#F1F3F6] shadow-lg border border-[#E0E0E0] z-10">
                        <ul>
                            {filteredAllergies.map((allergy) => (
                                <li
                                    key={allergy}
                                    className="px-4 py-2 hover:bg-[#E0E0E0] cursor-pointer
                                    w-100"
                                    onClick={() => {
                                        toggleAllergy(allergy);
                                    }}
                                >
                                    {allergy}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </div>

            {/* 버튼들을 나열 */}
            <div className="button-toggle-container flex flex-col gap-[1rem]" >
                <div>
                    <h1 className='allergies-title text-left gap-[0.75rem]'>Fruits</h1>
                </div>
                <div className='dropdown-badge-container '>
                    {fruitAllergieList.map((allergie) => (
                        <button
                            type='button'
                            key={allergie}
                            onClick={() => toggleAllergy(allergie)}
                            className={`allergies-button
                            ${selectedAllergies.includes(allergie)
                                    ? "dropdown-badge-red "
                                    : "dropdown-badge-none"
                                }`}
                        >
                            {allergie}
                        </button>
                    ))}
                </div>
            </div>
            <div className="button-toggle-container flex flex-wrap gap-[1rem]">
                <h1 className='allergies-title text-left gap-[0.75rem]'>Sea Food</h1>
                <div className='dropdown-badge-container'>
                    {seaFoodAllergieList.map((allergie) => (
                        <button
                            type='button'
                            key={allergie}
                            onClick={() => toggleAllergy(allergie)}
                            className={`allergies-button
                            ${selectedAllergies.includes(allergie)
                                    ? "dropdown-badge-red "
                                    : "dropdown-badge-none"
                                }`}
                        >
                            {allergie}
                        </button>
                    ))}
                </div>
            </div>
            <div className="button-toggle-container flex flex-wrap gap-[1rem]">
                <h1 className='allergies-title text-left gap-[0.75rem]'>Nuts & Seeds</h1>
                <div className='dropdown-badge-container'>
                    {nutsAllergieList.map((allergie) => (
                        <button
                            type='button'
                            key={allergie}
                            onClick={() => toggleAllergy(allergie)}
                            className={`allergies-button
                            ${selectedAllergies.includes(allergie)
                                    ? "dropdown-badge-red "
                                    : "dropdown-badge-none"
                                }`}
                        >
                            {allergie}
                        </button>
                    ))}
                </div>
            </div>
            <div className="button-toggle-container flex flex-wrap gap-[1rem]">
                <h1 className='allergies-title text-left gap-[0.75rem]'>Meat & Dairy</h1>
                <div className='dropdown-badge-container'>
                    {meatAllergieList.map((allergie) => (
                        <button
                            type='button'
                            key={allergie}
                            onClick={() => toggleAllergy(allergie)}
                            className={`allergies-button
                            ${selectedAllergies.includes(allergie)
                                    ? "dropdown-badge-red "
                                    : "dropdown-badge-none"
                                }`}
                        >
                            {allergie}
                        </button>
                    ))}
                </div>
            </div>
            <div className="button-toggle-container flex flex-wrap gap-[1rem]">
                <h1 className='allergies-title text-left gap-[0.75rem] w-full'>ETC</h1>
                <div className="dropdown-badge-container">
                    {etcAllergieList.map((allergie) => (

                        <button
                            type='button'
                            key={allergie}
                            onClick={() => toggleAllergy(allergie)}
                            className={`allergies-button
                            ${selectedAllergies.includes(allergie)
                                    ? "dropdown-badge-red "
                                    : "dropdown-badge-none"
                                }`}
                        >
                            {allergie}
                        </button>

                    ))}
                </div>
            </div>
            <button className='auth-button auth-button-id sign-up-button-text'
                type='submit'
            >Next
            </button>
        </form >
    );
}