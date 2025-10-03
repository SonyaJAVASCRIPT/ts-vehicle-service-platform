"use client";

import type React from "react";
import { useState, useEffect, Suspense } from "react";
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
import { CreditCard, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Fine {
  id: number;
  vehicleId: number;
  description: string;
  amount: number;
  date: string;
  status: "UNPAID" | "PAID";
  location: string;
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Завантаження...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fineId = searchParams.get("fineId");

  const [fine, setFine] = useState<Fine | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    const storage = localStorage.getItem("userdata");
    if (!storage) {
      router.push("/auth");
      return;
    }

    if (!fineId) {
      router.push("/dashboard");
      return;
    }

    const loadFine = async () => {
      try {
        const fineRes = await fetch(
          `http://localhost:3002/vehicles/fines/${fineId}`,
        );
        if (!fineRes.ok) throw new Error("Fine not found");
        const fineData: Fine = await fineRes.json();
        setFine(fineData);
      } catch (err) {
        console.error("❌ loadFine error:", err);
        router.push("/dashboard");
      }
    };

    loadFine();
  }, [fineId, router]);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.length >= 2
      ? `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
      : cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardData({ ...cardData, cardNumber: formatCardNumber(value) });
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4)
      setCardData({ ...cardData, expiryDate: formatExpiryDate(value) });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value))
      setCardData({ ...cardData, cvv: value });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fine) return;

    if (
      !cardData.cardNumber ||
      !cardData.cardHolder ||
      !cardData.expiryDate ||
      !cardData.cvv ||
      cardData.cardNumber.replace(/\s/g, "").length !== 16 ||
      cardData.expiryDate.length !== 5 ||
      cardData.cvv.length !== 3
    ) {
      alert("Заповніть всі поля коректно");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch(
        `http://localhost:3002/vehicles/${fine.vehicleId}/fines/${fine.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "PAID" }),
        },
      );
      if (!res.ok) throw new Error("❌ Помилка при оплаті");

      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      console.error("❌ handlePayment error:", err);
      alert("Не вдалося оплатити штраф");
      setIsProcessing(false);
    }
  };

  if (!fine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Завантаження...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-xl text-center">
          <CardContent className="pt-12 pb-12">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Оплата успішна!</h2>
            <p className="text-muted-foreground mb-4">Штраф успішно оплачено</p>
            <p className="text-3xl font-bold text-green-600 mb-6">
              {fine.amount} грн
            </p>
            <p className="text-sm text-muted-foreground">
              Перенаправлення на головну...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад до панелі
        </Button>

        {/* Fine Details */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Деталі штрафу</CardTitle>
            <CardDescription>Інформація про штраф до оплати</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Опис</p>
              <p className="font-semibold text-pretty">{fine.description}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Місце</p>
                <p className="font-medium">{fine.location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Дата</p>
                <p className="font-medium">
                  {new Date(fine.date).toLocaleDateString("uk-UA")}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t">
              <p className="text-sm text-muted-foreground mb-1">
                Сума до сплати
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {fine.amount} грн
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Оплата картою</CardTitle>
                <CardDescription>
                  Введіть дані вашої банківської картки
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Номер картки</Label>
                <Input
                  id="card-number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.cardNumber}
                  onChange={handleCardNumberChange}
                  required
                  className="font-mono text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-holder">Ім'я власника картки</Label>
                <Input
                  id="card-holder"
                  type="text"
                  placeholder="IVAN IVANOV"
                  value={cardData.cardHolder}
                  onChange={(e) =>
                    setCardData({
                      ...cardData,
                      cardHolder: e.target.value.toUpperCase(),
                    })
                  }
                  required
                  className="uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry-date">Термін дії</Label>
                  <Input
                    id="expiry-date"
                    type="text"
                    placeholder="MM/YY"
                    value={cardData.expiryDate}
                    onChange={handleExpiryDateChange}
                    required
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={handleCvvChange}
                    required
                    className="font-mono"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Обробка платежу...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Оплатити {fine.amount} грн
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Це тестова версія. Реальні платежі не здійснюються.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
