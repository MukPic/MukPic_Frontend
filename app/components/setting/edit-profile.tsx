'use client';
import { userNameSchema } from "@/schemas/auth";
import { UseVaildate } from "@/app/hooks/useVaildate";
import { UserNameValidateError} from "@/app/types/signupValidate";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from 'styled-components';
import axios from "axios";
import Image from "next/image";



interface UserInfoData {
  image: string;
  userName: string;
  email: string;
}



const EditProfile = () => {
  const { errors } = UseVaildate<UserNameValidateError>(userNameSchema);
  const [userInfo, setUserInfo] = useState<UserInfoData | null>(null);
  const [profileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newUserName, setNewUserName] = useState<string>("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [canUseUserName, setCanUseUserName] = useState(false);
  const [userNameDuplicateMessage, setUserNameDuplicateMessage] = useState<string>("");
  const [messageColor, setMessageColor] = useState<string>("text-gray-500");
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [checkButtonDisabled, setCheckButtonDisabled] = useState(true); 
  const router = useRouter();

  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      alert("Login is required.");
      router.push("/login");
      return null;
    }
    return token;
  }, [router]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ROOT_API}/users/myinfo`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
          setNewUserName(data.userName);
          setUploadedImageUrl(data.image)
        } else {
          console.error("Failed to fetch user info:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [getAuthToken]);

  const CheckUserNameDuplicateHandler = async () => {
    axios({
        method: 'get',
        url: `${process.env.NEXT_PUBLIC_ROOT_API}/users/checkUserName`,
        params: {
            userName: newUserName,
            email: userInfo?.email
        },
        responseType: 'json'
    }).then(function (response) {
        //이미 있는 경우 true 반환
        if (response.data === true) {
            setCanUseUserName(false);
            setUserNameDuplicateMessage('This userName is already exist');
            setMessageColor('text-red-500');
        }
        else {
            setCanUseUserName(true);
            setUserNameDuplicateMessage('This userName is available');
            setMessageColor('text-green-500');
        }
    }).catch(function (error) {
        console.log(error);
    });
}

  // 닉네임 변경 시 상태 초기화 및 Check 버튼 활성화
const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value.trim(); // 입력값의 앞뒤 공백 제거
  setNewUserName(value);

  // 닉네임 중복 확인 상태 초기화
  setCanUseUserName(false); // 중복 확인 필요
  setUserNameDuplicateMessage(""); // 메시지 초기화

  // Check 버튼 활성화 (닉네임이 비어있지 않으면 활성화)
  setCheckButtonDisabled(value === ""); // 공백이면 비활성화
};

// 버튼 활성화 상태 관리
useEffect(() => {
  const hasImageChanged = profileImage !== null; // 새 이미지가 선택되었는지 확인
  const hasUserNameChanged = newUserName !== userInfo?.userName; // 닉네임 변경 여부 확인

  const hasChanges = hasImageChanged || hasUserNameChanged; // 변경 사항이 있는지 확인

  setIsSaveDisabled(
    !hasChanges || // 변경 사항이 없으면 비활성화
    !!errors?.userName || // 닉네임 유효성 검사 오류가 있으면 비활성화
    (!canUseUserName && hasUserNameChanged) // 닉네임 중복 확인 실패 시 비활성화
  );
}, [newUserName, profileImage, canUseUserName, userInfo, errors]);




const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    alert("jpg, jpeg, png 파일만 업로드 가능합니다.");
    return;
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    alert("10MB 이하의 파일만 업로드 가능합니다.");
    return;
  }

  // 로컬 미리보기 URL 생성
  const preview = URL.createObjectURL(file);
  setPreviewUrl(preview);

  const token = getAuthToken();
  if (!token) return;

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "PROFILE");

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_ROOT_API}/images/upload`,
      formData,
      {
        headers: { Authorization: `${token}` },
      }
    );

    const imageUrl = response.data[0]; 
    setUploadedImageUrl(imageUrl);
    alert("이미지 업로드가 완료되었습니다.");

  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
  }
};


useEffect(() => {
  const hasImageChanged = uploadedImageUrl !== userInfo?.image;
  const hasUserNameChanged = newUserName !== userInfo?.userName; 

  const hasChanges = hasImageChanged || hasUserNameChanged; // 변경 사항 여부 확인

  setIsSaveDisabled(
    !hasChanges || // 변경 사항 없으면 비활성화
    !!errors?.userName || // 닉네임 유효성 오류
    (!canUseUserName && hasUserNameChanged) // 닉네임 중복 확인 실패 시 비활성화
  );
}, [newUserName, uploadedImageUrl, canUseUserName, userInfo, errors]);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const token = getAuthToken();
  if (!token) return;

  try {
    const updatedData: Partial<UserInfoData> = {};

    if (newUserName && newUserName !== userInfo?.userName) {
      updatedData.userName = newUserName;
    }
    if (uploadedImageUrl && uploadedImageUrl !== userInfo?.image) {
      updatedData.image = uploadedImageUrl;
    }

    if (Object.keys(updatedData).length > 0) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ROOT_API}/users/editUserInfo`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify(updatedData)
        
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
        alert("User information has been modified.");
        router.push("/settings");
      } else {
        console.error('Failed to update user info:', response.status);
      }
    }
  } catch (error) {
    console.error("Failed to update profile:", error);
    alert("Failed to update profile. Please try again.");
  }
};


  return (
    <StyledForm onSubmit={handleSubmit}>

      {/* 프로필 이미지 업로드 */}
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      /> 
      
      <Label>
        
      <ProfileImageContainer onClick={() => document.getElementById('fileInput')?.click()}>
  {(previewUrl || uploadedImageUrl || userInfo?.image) ? (
    <Image
      src={previewUrl || uploadedImageUrl || userInfo?.image || "/default-profile.png"}
      alt="Profile"
      fill
      style={{ objectFit: "cover", borderRadius: "50%" }}
    />
  ) : (
    <DefaultIcon />
  )}

  <CameraIcon>
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
      </CameraIcon>
      
</ProfileImageContainer>
        <Text>Edit Your Profile</Text>
      </Label>

      {/* 닉네임 변경 */}
      <UserNameSection>
  <div className="input-group">
    <input
      id="userName"
      type="text"
      value={newUserName}
      onChange={handleUserNameChange}
      placeholder="Enter Your Name"
    />
    <button
      type="button"
      onClick={CheckUserNameDuplicateHandler}
      disabled={checkButtonDisabled}
    >
      Check
    </button>
  </div>
  <Message color={messageColor}>{userNameDuplicateMessage}</Message>
</UserNameSection>

      {/* 저장 버튼 */}
      <button
      type="submit"
      className="auth-button auth-button-id sign-up-button-text"
      disabled={isSaveDisabled}
      >Save
      </button>
      
    </StyledForm>
  );
};

export default EditProfile;

const StyledForm = styled.form`
  margin: 0 auto;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  width: 100%
  min-height: 300px; /* 최소 높이 설정 */
  justify-content: flex-start; /* 게시글이 없을 때도 상단 유지 */
  padding-top: 3.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CameraIcon = styled.div`
  position: absolute;
  bottom: 0.5rem; /* 프로필 이미지 아래쪽에 고정 */
  right: 0.5rem; /* 프로필 이미지 오른쪽에 고정 */
  z-index: 10; /* 아이콘이 항상 보이게 */

`;

const ProfileImageContainer = styled.div`
  width: 6.25rem;
  height: 6.25rem;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: #F1F3F6;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  display: flex; /* 프로필 이미지를 가운데 정렬 */
  align-items: center;
  justify-content: center;
  padding-bottom : 3.5 rem;
`; 

const Text = styled.div`
color: #758595;
font-feature-settings: 'liga' off, 'clig' off;
font-family: SUIT;
font-size: 1rem;
font-style: normal;
font-weight: 500;
line-height: 1.375rem; /* 137.5% */
letter-spacing: -0.01875rem;
`;

const DefaultIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: #F1F3F6;
  border-radius: 50%;
`;

const UserNameSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 15rem;
  padding-top: 1.5rem;
  width: 22.375rem;
  height: 3.375rem;
  flex-shrink: 0;
  border-radius: 6.25rem;
  

  .input-group {
  
    display: flex;
    align-items: center;
    background-color:#F1F3F6;
    border-radius: 30px;
    padding: 0.5rem;
  }

  input {
    flex-grow: 1;
    padding: 0.75rem 1rem ;
    border: none;
    border-radius: 30px;
    font-size: 0.875rem;
    color: #6b7280;
    background-color: transparent;

    &:focus {
      outline: none;
    }

    ::placeholder {
      color: #9ca3af;
    }
  }

  button {
    padding: 0.5rem 1rem;
    background-color:#1E252F;
    color: #FFF;
    border: none;
    border-radius: 30px;
    font-size: 0.875rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    

    &:disabled {
      background-color: #f3f4f6;
      color: #9ca3af;
      cursor: not-allowed;
    }
  }
`;

const Message = styled.p`
  font-size: 0.75rem;
  color: ${(props) => props.color || "#6b7280"};
  margin-top: 0.5rem;
`;

