// client/src/app/dashboard/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface UserProfile {
  id: number;
  username: string;
  shops: string[];
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth context to finish loading
    if (authLoading) {
      return;
    }

    // If not authenticated, redirect to signin
    if (!user) {
      router.push("/signin");
      return;
    }

    const fetchProfile = async () => {
      try {
        const profileData = await authService.getProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // If profile fetch fails, user might not be properly authenticated
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, router, authLoading]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleShopClick = (shopName: string) => {
    console.log("🔍 Environment:", process.env.NODE_ENV);
    console.log("🔍 Shop clicked:", shopName);

    if (process.env.NODE_ENV === "development") {
      // Development: use /shop/[shopName] route
      const url = `http://localhost:3000/shop/${shopName.toLowerCase()}`;
      console.log("🔍 Opening URL:", url);
      window.open(url, "_blank");
    } else {
      // Production: Check if we have a custom domain configured
      const currentHost = window.location.host;
      console.log("🔍 Current host:", currentHost);

      if (currentHost.includes("vercel.app")) {
        // If on Vercel's default domain, use path-based routing
        const url = `https://${currentHost}/shop/${shopName.toLowerCase()}`;
        console.log("🔍 Opening Vercel URL:", url);
        window.open(url, "_blank");
      } else {
        // If on custom domain, use subdomain routing
        const baseDomain = currentHost.replace(/^[^.]+\./, ""); // Remove subdomain if any
        const subdomain = `https://${shopName.toLowerCase()}.${baseDomain}`;
        console.log("🔍 Opening custom domain URL:", subdomain);
        window.open(subdomain, "_blank");
      }
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!profile) {
    return <div>Failed to load profile</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-3 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {profile.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span>Profile</span>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 border">
                  <div className="py-4 px-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Welcome, {profile.username}!
                    </h3>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Your Shops:
                      </h4>
                      <div className="space-y-2">
                        {profile.shops.map((shop) => (
                          <button
                            key={shop}
                            onClick={() => handleShopClick(shop)}
                            className="block w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-700 font-medium transition-colors"
                          >
                            {shop}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8">
            Welcome to your Dashboard
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Click on your profile icon to view and access your shops
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.shops.map((shop) => (
              <div
                key={shop}
                className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleShopClick(shop)}
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">{shop}</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Click to visit {shop} shop
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Confirm Logout
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to logout?
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
