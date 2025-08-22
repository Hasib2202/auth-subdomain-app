// client/src/app/shop/[shopName]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function ShopPage() {
  const { shopName } = useParams();
  const { user, loading } = useAuth();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateAccess = async () => {
      if (!loading) {
        if (!user) {
          // Redirect to main domain for authentication
          const currentUrl = window.location.href;

          // Get the base URL for the current environment
          const baseUrl =
            process.env.NODE_ENV === "production"
              ? `https://${
                  window.location.host.includes("vercel.app")
                    ? window.location.host
                    : "auth-subdomain-client.vercel.app"
                }`
              : "http://localhost:3001";

          window.location.href = `${baseUrl}/signin?redirect=${encodeURIComponent(
            currentUrl
          )}`;
          return;
        }
        setIsValidating(false);
      }
    };

    validateAccess();
  }, [user, loading]);

  if (loading || isValidating) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              This is {shopName} shop
            </h1>
            <button
              onClick={() => {
                // Get the base URL for the current environment
                const baseUrl =
                  process.env.NODE_ENV === "production"
                    ? `https://${
                        window.location.host.includes("vercel.app")
                          ? window.location.host
                          : "auth-subdomain-client.vercel.app"
                      }`
                    : "http://localhost:3001";

                window.location.href = `${baseUrl}/dashboard`;
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8">
            Welcome to {shopName}
          </h2>
          <p className="text-xl text-gray-600">
            This is the dedicated page for {shopName} shop.
          </p>
        </div>
      </div>
    </div>
  );
}
