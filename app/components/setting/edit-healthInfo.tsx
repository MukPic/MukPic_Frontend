'use client';

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";


interface UserInfoData {
  allergies: string[];
}




const EditHealthInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfoData | null>(null);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]); // 알레르기 선택 상태
  const [AllergiesSearch, setAllergiesSearch] = useState<string>(''); // 검색어 상태
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // 드롭다운 표시 여부
  const inputRef = useRef<HTMLInputElement | null>(null);

  const seaFoodAllergieList = ['Fish', 'Crab', 'Shrimp', 'Squid', 'Abalone', 'Mussel', 'Oyster', 'Shellfish'];
  const fruitAllergieList = ['Peach', 'Tomato'];
  const nutsAllergieList = ['Buck wheat', 'Wheat', 'Walnut', 'Pine nut', 'Peanut', 'Soybean'];
  const meatAllergieList = ['Pork', 'Eggs', 'Milk', 'Chicken', 'Beef'];
  const etcAllergieList = ['Sulfurous'];

  const router = useRouter();

  const getAuthToken = () => {
          const token = localStorage.getItem("Authorization");
          if (!token) {
            console.error("Authorization token not found");
          }
          return token;
        };
      
        // 사용자 정보 가져오기
        useEffect(() => {
          const fetchUserInfo = async () => {
            const token = getAuthToken();
            if (!token) return;
      
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_ROOT_API}/users/myinfo`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `${token}`,
                },
              });
      
              if (response.ok) {
                  const data = await response.json();
                  setUserInfo(data);
                  setSelectedAllergies(data.allergies || []);
                  
              } else {
                console.error('Failed to fetch user info:', response.status);
              }
            } catch (error) {
              console.error('Error fetching user info:', error);
            }
          };
      
          fetchUserInfo();
        }, [router]);

        useEffect(() => {
          if (userInfo && userInfo.allergies) {
            // 모든 알레르기 값을 대문자로 변환
            setSelectedAllergies(userInfo.allergies.map((allergy) => allergy.toUpperCase()));
          }
        }, [userInfo]);

  // 모든 알레르기 리스트 합치기기
  const allAllergies = [...seaFoodAllergieList, ...fruitAllergieList, ...nutsAllergieList, ...meatAllergieList, ...etcAllergieList];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = getAuthToken();
    if (!token) return;

    try {
      const updatedData: { allergyTypes?: string[] } = {};

        // 알레르기 변경 확인
        if (JSON.stringify(selectedAllergies) !== JSON.stringify(userInfo?.allergies)) {
          updatedData.allergyTypes = selectedAllergies.map((allergy) => allergy.toUpperCase());
      }

        // 변경 사항이 있을 경우에만 PATCH 요청
        if (Object.keys(updatedData).length > 0) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_ROOT_API}/users/editUserInfo`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify(updatedData), 
            });

            if (response.ok) {
                const data = await response.json();
                setUserInfo(data); 
                alert("User information has been modified.");
                console.log(updatedData);
                router.push("/settings");
            } else {
                console.error("Failed to update user info:", response.status);
                alert("Failed to update user info.");
            }
        } else {
            alert("No changes detected.");
        }
    } catch (error) {
        console.error("Failed to update profile:", error);
        alert("Failed to update profile. Please try again.");
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
      if (inputRef.current && e.target instanceof Node && !inputRef.current.contains(e.target)) {
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
      : allAllergies;

  return (
      <form onSubmit={handleSubmit} className='flex flex-col gap-10 flex-grow'>
          <h1 className="text-xl font-bold mb-4">Please edit your allergy</h1>
          

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
                                      toggleAllergy(allergy.toUpperCase());
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
              {fruitAllergieList.map((allergy) => (
                <button
                  type='button'
                  key={allergy}
                  onClick={() => toggleAllergy(allergy.toUpperCase())}
                  className={`allergies-button ${
                    selectedAllergies.includes(allergy.toUpperCase()) || userInfo?.allergies.includes(allergy)
                      ? "dropdown-badge-red"
                      : "dropdown-badge-none"
                  }`}
                >
                  {allergy}
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
                  onClick={() => toggleAllergy(allergie.toUpperCase())}
                  className={`allergies-button ${
                    selectedAllergies.includes(allergie.toUpperCase()) || userInfo?.allergies.includes(allergie)
                      ? "dropdown-badge-red"
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
                  onClick={() => toggleAllergy(allergie.toUpperCase())}
                  className={`allergies-button ${
                    selectedAllergies.includes(allergie.toUpperCase()) || userInfo?.allergies.includes(allergie)
                      ? "dropdown-badge-red"
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
                  onClick={() => toggleAllergy(allergie.toUpperCase())}
                  className={`allergies-button ${
                    selectedAllergies.includes(allergie.toUpperCase()) || userInfo?.allergies.includes(allergie)
                      ? "dropdown-badge-red"
                      : "dropdown-badge-none"
                  }`}
                >
                  {allergie}
                </button>
              ))}
            </div>
          </div>
          <div className="button-toggle-container flex flex-wrap gap-[1rem]">
            <div>
              <h1 className='allergies-title text-left gap-[0.75rem]'>ETC</h1>
            </div>
            <div className="dropdown-badge-container">
              {etcAllergieList.map((allergie) => (
                <button
                  type='button'
                  key={allergie}
                  onClick={() => toggleAllergy(allergie.toUpperCase())}
                  className={`allergies-button ${
                    selectedAllergies.includes(allergie.toUpperCase()) || userInfo?.allergies.includes(allergie)
                      ? "dropdown-badge-red"
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
          >Save
          </button>
      </form >
  );
}

export default EditHealthInfo;