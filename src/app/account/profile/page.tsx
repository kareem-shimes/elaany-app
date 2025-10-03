import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/features/user";
import { Card } from "@/components/ui/card";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  // Fetch user data from database
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/");
  }

  // Serialize dates to prevent hydration errors
  const serializedUser = {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };

  return (
    <div className="space-y-6">
      <div className="text-right">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">الملف الشخصي</h1>
        <p className="text-gray-600">قم بإدارة معلومات حسابك الشخصي</p>
      </div>

      <Card className="p-6">
        <ProfileForm user={serializedUser} />
      </Card>
    </div>
  );
}
