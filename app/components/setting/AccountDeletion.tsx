'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AccountDeletion = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      console.error("Authorization token not found");
      return null;
    }
    return token;
  };

  const deleteCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  };

  const handleDeleteAccount = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ROOT_API}/users/deactivate`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        alert("Your account has been successfully deleted.");
        localStorage.removeItem("Authorization"); // 토큰 삭제
        // 현석 추가
        localStorage.removeItem("userKey"); // 유저정보 삭제
        deleteCookies(); //쿠키삭제

        router.push("/login");
      } else {
        console.error("Failed to delete account:", response.status);
        setError("Account deletion failed. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <p className="text-sm text-center text-red-500">
        Once you delete your account, all your data will be permanently erased. 
        This action cannot be undone.
      </p>
      
      {error && <p className="text-sm text-center text-red-600 mt-2">{error}</p>}

      <button
        onClick={handleDeleteAccount}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600"
      >
        Delete My Account
      </button>
    </div>
  );
};

export default AccountDeletion;
