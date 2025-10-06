"use client";
import type React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/utils";
import { userService, vehicleService } from "@/hooks/env";

export default function Page() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [carBrand, setCarBrand] = useState("");
  const [carPlateNumber, setCarPlateNumber] = useState("");
  const [showCarForm, setShowCarForm] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${userService}/user/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Ошибка");
        return;
      }
      router.push("/dashboard");
    } catch (e) {
      setError(`${e}`);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${userService}/user/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: registerFullName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Ошибка");
        return;
      }

      setShowCarForm(true);
    } catch (e) {
      setError(`${e}`);
    }
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/");
        return;
      }
      const res = await fetch(`${vehicleService}/vehicles/${user.sub}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          plate: carPlateNumber,
          brand: carBrand,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Ошибка");
        return;
      }
      console.log(data);
      router.push("/dashboard");
    } catch (e) {
      setError(`${e}`);
    }
  };
  if (showCarForm) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                <Shield className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            <CardTitle>Добавьте автомобиль</CardTitle>
            <CardDescription>
              Укажите данные вашего транспортного средства
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCar} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="carBrand">Марка автомобиля</Label>
                <Input
                  id="carBrand"
                  placeholder="Toyota, BMW, Mercedes..."
                  value={carBrand}
                  onChange={(e) => setCarBrand(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carPlateNumber">Номер автомобиля</Label>
                <Input
                  id="carPlateNumber"
                  placeholder="AA1234BB"
                  value={carPlateNumber}
                  onChange={(e) => setCarPlateNumber(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                Завершить регистрацию
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <CardTitle>Вход в систему</CardTitle>
          <CardDescription>
            Войдите или зарегистрируйтесь для продолжения
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginEmail">Email</Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginPassword">Пароль</Label>
                  <Input
                    id="loginPassword"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full">
                  Войти
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="registerFullName">ФИО</Label>
                  <Input
                    id="registerFullName"
                    placeholder="Иванов Иван Иванович"
                    value={registerFullName}
                    onChange={(e) => setRegisterFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input
                    id="registerEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Пароль</Label>
                  <Input
                    id="registerPassword"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full">
                  Зарегистрироваться
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
