'use client';

import {userSchema } from "@/schemas/auth";
import { UseVaildate } from "@/app/hooks/useVaildate";
import { UserValidateError } from "@/app/types/signupValidate";
import React, { useEffect, useState } from "react";
import { useSignupStore } from "@/app/types/signupStore";
import { useRouter } from "next/navigation";
import {  ValidateSpan } from "@/app/components/auth/signupComponents";




const ChangePassword = () => {
  const { errors, validateField } = UseVaildate<UserValidateError>(userSchema);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const password = useSignupStore(state => state.password);
  const setpassword = useSignupStore(state => state.setpassword);

  const router = useRouter();

  const getAuthToken = () => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
        console.error("Authorization token not found");
    }
    return token;
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      validateField(name, value);
      setpassword(value);  // password만 업데이트
      
  };


  useEffect(() => {
      const isFormValid = password.trim(); 
      const hasErrors = !!errors?.userId || !!errors?.password;

      setIsButtonDisabled(hasErrors || !isFormValid);
  }, [errors, password]);


  const PasswordToggle = () => {
      setPasswordVisible(!passwordVisible);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const token = getAuthToken();
      if (!token) return;

      try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_ROOT_API}/users/editPassword`, {
              method: "PATCH",
              credentials: "include",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `${token}`,
              },
              body: JSON.stringify({ password }),
          });

          if (response.ok) {
              alert("Password has been successfully updated.");
              router.push("/settings");
          } else {
              console.error("Failed to update password:", response.status);
              alert("Failed to update password.");
          }
      } catch (error) {
          console.error("Error updating password:", error);
          alert("An error occurred. Please try again.");
      }
  };
  



  return (
  
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <label htmlFor="password" className="flex auth-input-label items-center">
              <input
                  id="password"
                  name="password"
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Enter the password you want to change"
                  value={password}
                  onChange={handleChange}
                  className='auth-placeholder grow text-left' />
              <button type='button' className='flex items-center justify-center' onClick={PasswordToggle}>
                  {passwordVisible ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_112_3055)">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#6A7784" />
                      </g>
                      <defs>
                          <clipPath id="clip0_112_3055">
                              <rect width="24" height="24" fill="white" />
                          </clipPath>
                      </defs>
                  </svg>
                      :
                      <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.83 6L14 9.16C14 9.11 14 9.05 14 9C14 8.20435 13.6839 7.44129 13.1213 6.87868C12.5587 6.31607 11.7956 6 11 6C10.94 6 10.89 6 10.83 6ZM6.53 6.8L8.08 8.35C8.03 8.56 8 8.77 8 9C8 9.79565 8.31607 10.5587 8.87868 11.1213C9.44129 11.6839 10.2044 12 11 12C11.22 12 11.44 11.97 11.65 11.92L13.2 13.47C12.53 13.8 11.79 14 11 14C9.67392 14 8.40215 13.4732 7.46447 12.5355C6.52678 11.5979 6 10.3261 6 9C6 8.21 6.2 7.47 6.53 6.8ZM1 1.27L3.28 3.55L3.73 4C2.08 5.3 0.78 7 0 9C1.73 13.39 6 16.5 11 16.5C12.55 16.5 14.03 16.2 15.38 15.66L15.81 16.08L18.73 19L20 17.73L2.27 0M11 4C12.3261 4 13.5979 4.52678 14.5355 5.46447C15.4732 6.40215 16 7.67392 16 9C16 9.64 15.87 10.26 15.64 10.82L18.57 13.75C20.07 12.5 21.27 10.86 22 9C20.27 4.61 16 1.5 11 1.5C9.6 1.5 8.26 1.75 7 2.2L9.17 4.35C9.74 4.13 10.35 4 11 4Z" fill="#6A7784" />
                      </svg>
                  }
              </button>
          </label>
          <div>
              {errors?.password && <ValidateSpan message={errors?.password[0]} error={!!errors?.password}></ValidateSpan>}
          </div>
          <button className='auth-button auth-button-id sign-up-button-text'
              type='submit'
              disabled={isButtonDisabled}
          >Save
          </button>
      </form >


  );
}

export default ChangePassword;