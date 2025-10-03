"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car } from "lucide-react";
import { useRouter } from "next/navigation";
type UserData = {
  userId: number;
  username: string;
};
export default function AddCarPage() {
  const router = useRouter();
  const [carData, setCarData] = useState({ licensePlate: "", brand: "" });
  const [userName, setUserName] = useState({ userid: -1, username: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carData.licensePlate || !carData.brand) {
      alert("Заповніть всі поля");
      return;
    }
    const storage = localStorage.getItem("userdata");
    let userData: UserData | null = null;
    if (storage) {
      userData = JSON.parse(storage) as UserData;
    }
    const res = await fetch(
      `http://localhost:3002/vehicles/${userData?.userId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          plate: carData.licensePlate,
          brand: carData.brand,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!res.ok) {
      throw new Error("Wrong");
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Car className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Додайте ваш автомобіль
          </CardTitle>
          <CardDescription>
            Вітаємо, користувач! Додайте інформацію про ваш автомобіль для
            продовження
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="license-plate">Номерний знак</Label>
              <Input
                id="license-plate"
                type="text"
                placeholder="AA 1234 BB"
                value={carData.licensePlate}
                onChange={(e) =>
                  setCarData({
                    ...carData,
                    licensePlate: e.target.value.toUpperCase(),
                  })
                }
                required
                className="font-mono text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Марка автомобіля</Label>
              <Input
                id="brand"
                type="text"
                placeholder="Toyota Camry"
                value={carData.brand}
                onChange={(e) =>
                  setCarData({ ...carData, brand: e.target.value })
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Продовжити
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
