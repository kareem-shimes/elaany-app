import { getCategories } from "@/lib/ads";
import { getCurrentUser } from "@/lib/session";
import CategorySelector from "./components/CategorySelector";
import AuthLinks from "@/components/shared/header/auth-links";

export default async function AddAd() {
  // Check if user is authenticated
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen space-x-4">
        <p className="text-gray-500">يرجى تسجيل الدخول للمتابعة</p>
        <AuthLinks />
      </div>
    );
  }

  // Fetch categories and subcategories
  const categories = await getCategories();

  return (
    <main className="py-8">
      <div className="container">
        <CategorySelector categories={categories} />
      </div>
    </main>
  );
}
