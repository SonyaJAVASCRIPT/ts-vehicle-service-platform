"use client";

import type React from "react";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { register } from "node:module";
export type UserData = {
  access_token: string;
  username: string;
  userId: string;
};
export default function AuthPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  async function loginSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password,
      }),
    });
    if (!res.ok) {
      throw new Error("Неверный логин или пароль");
    }
    const data: UserData = await res.json();

    localStorage.setItem("token", data.access_token);
    localStorage.setItem(
      "userdata",
      JSON.stringify({ userId: data.userId, username: data.username }),
    );
    console.log(data.access_token, data.userId, data.username);
    if (data.username === "admin") {
      router.push("admin");
    } else router.push("dashboard");
  }
  async function registerSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: registerData.email,
        username: registerData.fullName,
        password: registerData.password,
      }),
    });
    if (!res.ok) {
      throw new Error("Неверный логин или пароль");
    }
    const data: UserData = await res.json();
    localStorage.setItem("token", data.access_token);
    localStorage.setItem(
      "userdata",
      JSON.stringify({ userId: data.userId, username: data.username }),
    );
    console.log(data.access_token, data.userId, data.username);
    router.push("/add-car");
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-6">
      <Card className="max-w-xl w-full shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Вхід до системи</CardTitle>
          <CardDescription>
            Увійдіть або зареєструйтесь для доступу до порталу
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Вхід</TabsTrigger>
              <TabsTrigger value="register">Реєстрація</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-4">
              <form onSubmit={(e) => loginSubmit(e)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Електронна пошта</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="example@email.ua"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Пароль</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Увійти
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-4">
              <form onSubmit={(e) => registerSubmit(e)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Прізвище та Ім'я</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Іванов Іван"
                    value={registerData.fullName}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        fullName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Електронна пошта</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="example@email.ua"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Пароль</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Зареєструватись
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
