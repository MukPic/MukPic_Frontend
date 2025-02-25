"use client";

import axios, { AxiosError } from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";

interface AnalysisResult {
  foodName: string;
  engFoodName: string;
  foodDescription: string;
  ingredients: string[];
  recipe: string[];
  allergyInformation: string;
}

function InfoPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const imageUrl = searchParams.get("imageUrl");
  const [response, setResponse] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!imageUrl) {
        setError("Error: No image URL provided.");
        return;
      }

      const token = localStorage.getItem("Authorization");
      setLoading(true);

      try {
        const result = await axios.post(
          `${process.env.NEXT_PUBLIC_ROOT_API}/url/analyze`,
          { imageUrl },
          {
            headers: {
              Authorization: token || "",
            },
          }
        );
        setResponse(result.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          setError(error.response?.data?.error || "Something went wrong");
        } else if (error instanceof Error) {
          setError(error.message || "An unexpected error occurred");
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [imageUrl]);

  const handleConfirmClick = () => {
    router.push("/");
  };

  if (!imageUrl) {
    return (
      <main className="w-full bg-white px-4 py-6 text-center">
        <p className="text-red-500">Error: No image URL provided.</p>
      </main>
    );
  }

  return (
    <main className="w-full bg-white px-4 py-6">
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col justify-start items-center min-h-screen space-y-6 mt-16">
          {/* 에러 메시지 디자인 */}
          <div className="text-red-600 bg-red-100 border border-red-400 rounded-lg px-6 py-4 shadow-md max-w-lg text-center">
            <p className="text-xl font-bold">Oops! Something went wrong.</p>
            <p className="text-sm mt-2">{error}</p>
          </div>

          {/* "Go Back" 버튼 디자인 */}
          <button
            className="bg-gray-800 text-white font-semibold px-5 py-2 rounded-full"
            onClick={() => router.back()}
          >
            Go Back
          </button>
        </div>
      )}

      {!loading && response && (
        <section className="max-w-3xl mx-auto">
          <Image
            src={imageUrl}
            alt={response.foodName}
            width={800}
            height={300}
            className="object-cover rounded-md mb-4"
          />

          <div className="text-center border-b-2 border-gray-300 pb-4">
            <h2 className="text-2xl font-extrabold text-gray-800">
              {response.foodName}
            </h2>
            <p className="text-sm text-gray-500">{response.engFoodName}</p>
          </div>

          <p className="text-gray-700 mt-4 leading-relaxed">
            {response.foodDescription}
          </p>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
              Allergy Information
            </h3>
            <p className="text-gray-700 mt-2">{response.allergyInformation}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
              Ingredients
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              {response.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
              Recipe
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              {response.recipe.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              className="bg-gray-800 text-white font-semibold px-5 py-2 rounded-full"
              onClick={handleConfirmClick}
            >
              OK
            </button>
          </div>
        </section>
      )}

      {!loading && !response && !error && (
        <div className="text-center">
          <p>Loading or no data available...</p>
        </div>
      )}
    </main>
  );
}

export default function InfoPage() {
  return (
    <Suspense fallback={<p className="text-center">Loading...</p>}>
      <InfoPageContent />
    </Suspense>
  );
}
