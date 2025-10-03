"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User, Camera, Loader2 } from "lucide-react";
import Image from "next/image";

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "حدث خطأ أثناء تحديث الملف الشخصي");
      }

      setSuccess("تم تحديث الملف الشخصي بنجاح");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error instanceof Error ? error.message : "حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;

      // Use a simple date format to avoid hydration issues
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();

      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "تاريخ غير صحيح";
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-6 text-right">
        <div className="relative">
          {user.image ? (
            <Image
              src={user.image}
              alt="صورة المستخدم"
              width={80}
              height={80}
              className="rounded-full border-4 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center border-4 border-gray-200">
              <User className="h-8 w-8 text-gray-500" />
            </div>
          )}
          <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">
            {user.name || "مستخدم جديد"}
          </h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500 mt-1">
            عضو منذ {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6 text-right">
          <Button
            type="button"
            variant={isEditing ? "outline" : "default"}
            onClick={() => {
              setIsEditing(!isEditing);
              if (isEditing) {
                setFormData({
                  name: user.name || "",
                  email: user.email,
                });
                setError("");
                setSuccess("");
              }
            }}
          >
            {isEditing ? "إلغاء" : "تعديل المعلومات"}
          </Button>
          <h3 className="text-lg font-semibold">المعلومات الشخصية</h3>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-right">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-right">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 text-right">
            <Label htmlFor="name">الاسم</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              disabled={!isEditing || isLoading}
              placeholder="أدخل اسمك"
              className="text-right"
            />
          </div>

          <div className="space-y-2 text-right">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled={true}
              className="text-right bg-gray-50"
            />
            <p className="text-sm text-gray-500">
              لا يمكن تغيير البريد الإلكتروني
            </p>
          </div>

          {isEditing && (
            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  "حفظ التغييرات"
                )}
              </Button>
            </div>
          )}
        </form>
      </Card>

      {/* Account Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-right">
          معلومات الحساب
        </h3>
        <div className="space-y-3 text-right">
          <div className="flex justify-between">
            <span className="text-gray-600">رقم المستخدم</span>
            <span className="font-mono text-sm">{user.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">تاريخ الإنشاء</span>
            <span>{formatDate(user.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">آخر تحديث</span>
            <span>{formatDate(user.updatedAt)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
