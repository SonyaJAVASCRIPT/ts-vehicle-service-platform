"use client";

import React, { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  Calendar,
  FileText,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { vehicleService } from "@/hooks/env";

interface Fine {
  id: number;
  date: string;
  description: string;
  amount: number;
  status: boolean;
  vehicleId: number;
}

interface Car {
  id: number;
  plate: string;
  brand: string;
}

interface PageProps {
  params: { fineId: string };
}

export default function PaymentPage({ params }: PageProps) {
  const router = useRouter();
  const fineId = params.fineId;
  const [fine, setFine] = useState<Fine | null>(null);
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const searchParams = useSearchParams();
  useEffect(() => {
    if (!fineId) return;

    async function fetchData() {
      try {
        const fineRes = await fetch(`${vehicleService}/fine/${fineId}`);
        if (!fineRes.ok) throw new Error("Не удалось получить штраф");
        const fineData: Fine = await fineRes.json();

        const carRes = await fetch(
          `${vehicleService}/vehicles/${fineData.vehicleId}`,
        );
        if (!carRes.ok) throw new Error("Не удалось получить автомобиль");
        const carData: Car = await carRes.json();

        setFine(fineData);
        setCar(carData);
      } catch (err) {
        console.error(err);
        alert("Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [fineId]);

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "UAH",
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fine) return;

    setIsProcessing(true);

    try {
      const res = await fetch(`${vehicleService}/fine/${fine.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fine, status: true }),
      });

      if (!res.ok) throw new Error("Ошибка при оплате");

      setIsSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      console.error(err);
      alert("Ошибка при оплате");
      setIsProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Загрузка...
      </div>
    );
  if (!fine || !car)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Данные не найдены
      </div>
    );

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Оплата успешна!</h2>
            <p className="text-muted-foreground mb-4">Штраф успешно оплачен</p>
            <div className="bg-muted rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">
                Сумма платежа
              </p>
              <p className="text-3xl font-bold">{formatAmount(fine.amount)}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Перенаправление в личный кабинет...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к штрафам
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Оплата штрафа</h1>
              <p className="text-sm text-muted-foreground">
                Безопасная оплата онлайн
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Детали штрафа</CardTitle>
              <CardDescription>Информация о нарушении</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Автомобиль</p>
                <p className="font-medium">
                  {car.brand} • {car.plate}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Описание нарушения
                </p>
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm leading-relaxed">{fine.description}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Дата нарушения</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm">{formatDate(fine.date)}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Статус</p>
                <Badge variant="destructive">Не оплачено</Badge>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Сумма к оплате</span>
                  <span className="text-2xl font-bold">
                    {formatAmount(fine.amount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Платежные данные</CardTitle>
              <CardDescription>Введите данные банковской карты</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Номер карты</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(
                          e.target.value.replace(/\D/g, "").slice(0, 16),
                        )
                      }
                      required
                      className="pr-10"
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Имя владельца карты</Label>
                  <Input
                    id="cardName"
                    placeholder="IVAN IVANOV"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Срок действия</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "");
                        if (v.length >= 3)
                          v = `${v.slice(0, 2)}/${v.slice(2, 4)}`;
                        setExpiryDate(v.slice(0, 5));
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                      }
                      required
                      type="password"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? "Обработка платежа..."
                      : `Оплатить ${formatAmount(fine.amount)}`}
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Ваши платежные данные защищены и передаются по безопасному
                  соединению
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
