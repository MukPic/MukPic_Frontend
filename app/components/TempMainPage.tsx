"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUpdateImageStore } from "@/app/types/updateImgStore";
import { usePostStore } from "@/app/types/postStore";

export default function MainPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Top picks");
  const router = useRouter();

  // 현석 추가 작성
  const setImageUrls = usePostStore((state) => state.setImageUrls);
  const setUpdateImageUrls = useUpdateImageStore((state) => state.setUpdateImageUrls);

  const categories = ["Top picks", "Rice", "Noodle", "Snacks", "Cafe"];

  const foodData: Record<string, string[]> = {
    "Top picks": ["Dakgalbi", "Fried Chicken", "Bibimbap", "Tteokbokki", "Bulgogi", "Kimchi Stew", "Samgyeopsal", "Japchae"],
    Rice: ["Kimchi Fried Rice", "Bibimbap", "Bulgogi Rice", "Gukbap", "Soy Sauce Egg Rice", "Albap", "Omurice", "Gimbap"],
    Noodle: ["Jajangmyeon", "Kalguksu", "Jjamppong", "Naengmyeon", "Mak Guksu", "Spicy Cold Noodles", "Bulgogi Noodles", "Soybean Noodle"],
    Snacks: ["Hotteok", "Tteokbokki", "Corn Dog", "Injeolmi", "Fish Cake Skewers", "Sweet Potato Fries", "Songpyeon", "Gamja Jeon"],
    Cafe: ["Espresso", "Cappuccino", "Bingsu", "Macaron", "Iced Americano", "Matcha Latte", "Affogato", "Cheesecake"],
  };

  const foodImages: Record<string, string> = {
    Dakgalbi: "/images/Dakgalbi.jpg",
    "Fried Chicken": "/images/Fried Chicken.jpg",
    Tteokbokki: "/images/Tteokbokki.jpeg",
    Bulgogi: "/images/Bulgogi.jpg",
    "Kimchi Stew": "/images/kimchi Stew.jpg",
    Samgyeopsal: "/images/Samgyeopsal.jpg",
    Japchae: "/images/Japchae.jpg",
    "Kimchi Fried Rice": "/images/Kimchi Fried Rice.jpg",
    Bibimbap: "/images/Bibimbap.jpg",
    "Bulgogi Rice": "/images/Bulgogi Rice.jpg",
    Gukbap: "/images/Gukbap.jpg",
    "Soy Sauce Egg Rice": "/images/Soy Sauce Egg Rice.jpg",
    Albap: "/images/Albap.jpg",
    Omurice: "/images/Omurice.jpg",
    Gimbap: "/images/Gimbap.jpg",
    Jajangmyeon: "/images/Jajangmyeon.jpeg",
    Kalguksu: "/images/Kalguksu.jpeg",
    Jjamppong: "/images/Jjamppong.jpeg",
    Naengmyeon: "/images/Naengmyeon.jpg",
    "Mak Guksu": "/images/Mak Guksu.jpg",
    "Spicy Cold Noodles": "/images/Spicy Cold Noodles.jpg",
    "Bulgogi Noodles": "/images/Bulgogi Noodles.jpg",
    "Soybean Noodle": "/images/Soybean Noodle.jpg",
    Hotteok: "/images/Hotteok.jpg",
    "Corn Dog": "/images/Corn Dog.jpg",
    "Fish Cake Skewers": "/images/Fish Cake Skewers.jpg",
    "Sweet Potato Fries": "/images/Sweet Potato Fries.jpeg",
    "Songpyeon": "/images/Songpyeon.jpg",
    "Injeolmi": "/images/Injeolmi.jpg",
    "Gamja Jeon": "/images/Gamja Jeon.jpg",
    Espresso: "/images/Espresso.jpg",
    Cappuccino: "/images/Cappuccino.jpg",
    Bingsu: "/images/Bingsu.jpg",
    Macaron: "/images/Macaron.jpg",
    "Iced Americano": "/images/Iced Americano.jpeg",
    "Matcha Latte": "/images/Matcha Latte.jpg",
    Affogato: "/images/Affogato.jpg",
    Cheesecake: "/images/Cheesecake.jpg",
  };

  const handleFoodClick = (food: string) => {
    router.push(`/keyword?query=${encodeURIComponent(food)}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("Authorization");

    if (!token) {
      console.error("Access Token is missing. Redirecting to login...");
      setError("Access Token is missing. Please log in again.");
      router.push("/login");
    }
  }, [router]);

  const handleSnapClick = async () => {
    try {
      setLoading(true);
      setError(null);

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.click();

      fileInput.onchange = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        const imageTypeMapping: Record<string, string> = {
          "Top picks": "COMMUNITY",
          Bap: "COMMUNITY",
          Myeon: "COMMUNITY",
          Snacks: "COMMUNITY",
          Cafe: "COMMUNITY",
        };

        const imageType = imageTypeMapping[selectedCategory] || "COMMUNITY";

        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("type", imageType);

        const apiUrl = process.env.NEXT_PUBLIC_ROOT_API;

        try {
          const uploadResponse = await fetch(`${apiUrl}/images/upload`, {
            method: "POST",
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.message || "Image upload failed.");
          }

          const uploadedUrls: string[] = await uploadResponse.json();
          const imageUrl = uploadedUrls[0];

          // 현석 추가 작성
          setUpdateImageUrls(uploadedUrls);
          setImageUrls(uploadedUrls);

          router.push(`/info?imageUrl=${encodeURIComponent(imageUrl)}`);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError(error.message || "An unexpected error occurred.");
          } else {
            setError("An unknown error occurred.");
          }
        }
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "An unexpected error occurred.");
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white min-h-[calc(100vh-170px)] p-0">
      {/* 검색바 */}
      <section className="mb-6">
        <div className="flex justify-center mb-4">
          <div className="relative w-full max-w-lg">
            {/* 돋보기 아이콘 */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 15.75L21 21M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                />
              </svg>
            </div>

            {/* 검색 입력란 */}
            <input
              type="text"
              placeholder="Search your favorite K-food"
              className="w-full px-10 py-2 rounded-full border border-gray-300 shadow-sm text-sm"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  const query = (event.target as HTMLInputElement).value.trim();
                  if (query) {
                    router.push(`/keyword?query=${encodeURIComponent(query)}`);
                  }
                }
              }}
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 text-white rounded-2xl p-6 flex flex-col justify-between shadow-md h-48 relative">
          {/* 텍스트를 좌측 상단으로 이동 */}
          <div className="absolute top-4 left-4">
            <p className="text-xl font-bold leading-tight">Discover</p>
            <p className="text-xl font-bold leading-tight">by Photo</p>
          </div>
          {/* 버튼을 하단 중앙으로 이동 */}
          <button
            className="temp-page-button bg-white text-gray-800 font-semibold px-5 py-2 rounded-full flex items-center absolute bottom-4 left-1/2 transform -translate-x-1/2"
            onClick={handleSnapClick}
            disabled={loading}
          >
            <span className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
            </span>
            {loading ? "Processing..." : "Snap"}
          </button>
        </div>
        <div className="bg-white border border-gray-300 rounded-2xl p-6 flex flex-col justify-between shadow-md h-48 relative">
          <div className="absolute top-4 left-4">
            <p className="text-xl font-bold leading-tight">Create</p>
            <p className="text-xl font-bold leading-tight">a Post</p>
          </div>
          <button
            className="temp-page-button bg-gray-800 text-white font-semibold px-5 py-2 rounded-full flex items-center absolute bottom-4 left-1/2 transform -translate-x-1/2"
            onClick={() => router.push("/community/post")}
          >
            <span className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 3.487a1.125 1.125 0 011.591 0l2.06 2.06a1.125 1.125 0 010 1.591l-9.114 9.114a4.5 4.5 0 01-1.385.95l-3.592 1.558a.75.75 0 01-.977-.977l1.558-3.592a4.5 4.5 0 01.95-1.385l9.114-9.114z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 9.75L14.25 4.5M8.25 19.5h4.5"
                />
              </svg>
            </span>
            Post
          </button>
        </div>
      </section>

      {/* 카테고리 */}
      <section className="mb-6">
        <div className="flex overflow-x-scroll space-x-3 pb-2">
          {categories.map((category, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
                }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* 음식 리스트 */}
      <section className="grid grid-cols-4 gap-4">
        {foodData[selectedCategory]?.map((food, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleFoodClick(food)}
          >
            <div className="w-20 h-20 flex items-center justify-center rounded-lg mb-2 shadow-md bg-gray-200 overflow-hidden">
              <Image
                src={foodImages[food] || "/images/default.jpg"}
                alt={food}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            </div>
            <p className="text-sm text-gray-700 text-center truncate w-20">
              {food}
            </p>
          </div>
        ))}
      </section>

      {error && (
        <section className="mt-4 text-red-500">
          <p>Error: {error}</p>
        </section>
      )}
    </main>
  );
}