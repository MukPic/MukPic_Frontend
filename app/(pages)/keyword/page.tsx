"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { AxiosError } from "axios";

interface AnalysisResult {
  foodName: string;
  engFoodName: string;
  foodDescription: string;
  ingredients: string[];
  recipe: string[];
  allergyInformation: string;
}

function KeywordPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query");
  const [response, setResponse] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setError("No query provided.");
      return;
    }

    setLoading(true);

    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_ROOT_API;
        const token = localStorage.getItem("Authorization");

        if (!apiUrl) {
          throw new Error("API URL is not defined.");
        }

        if (!token) {
          throw new Error("Authorization token is missing. Please log in again.");
        }

        const response = await fetch(`${apiUrl}/search/info`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ keyword: query }),
        });

        if (!response.ok) throw new Error("Failed to fetch data.");

        const data = await response.json();
        setResponse(data);
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
  }, [query]);

  const handleConfirmClick = () => {
    router.push("/");
  };

  if (!query) {
    return (
      <div className="text-center text-red-500 mt-4">
        <p>Error: No query provided.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-4">
        <p className="text-blue-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-4">
        <p>{error}</p>
      </div>
    );
  }

  if (response) {
    return (
      <section className="max-w-3xl mx-auto">
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

        <div className="mt-8 flex justify-center">
          <button
            className="bg-gray-800 text-white font-semibold px-5 py-2 rounded-full"
            onClick={handleConfirmClick}
          >
            OK
          </button>
        </div>
      </section>
    );
  }

  return null;
}

export default function KeywordPage() {
  return (
    <Suspense fallback={<div className="text-center mt-4">Loading...</div>}>
      <KeywordPageContent />
    </Suspense>
  );
}
