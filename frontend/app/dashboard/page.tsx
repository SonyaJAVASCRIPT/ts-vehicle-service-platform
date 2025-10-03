"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  LogOut,
  AlertCircle,
  Clock,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Fine {
  id: number;
  description: string;
  amount: number;
  date: string;
  status: string;
}

interface Vehicle {
  plate: string;
  brand: string;
  fines: Fine[];
}

interface UserData {
  userId: number;
  username: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userCar, setUserCar] = useState<{
    licensePlate: string;
    brand: string;
  } | null>(null);
  const [fines, setFines] = useState<Fine[]>([]);
  const [totalUnpaid, setTotalUnpaid] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storage = localStorage.getItem("userdata");
        if (!storage) {
          router.push("/");
          return;
        }

        const userData: UserData = JSON.parse(storage);
        setUserName(userData.username);

        console.log("🔑 UserData:", userData);

        const res = await fetch(
          `http://localhost:3002/vehicles/owner/${userData.userId}`,
        );

        if (!res.ok) {
          throw new Error("❌ Ошибка при получении автомобиля");
        }

        const vehicle: Vehicle = await res.json();
        console.log("🚘 Vehicle data:", vehicle);

        setUserCar({
          licensePlate: vehicle.plate,
          brand: vehicle.brand,
        });

        // Устанавливаем штрафы
        setFines(vehicle.fines || []);
        calculateTotal(vehicle.fines);

        console.log("📋 Fines:", vehicle.fines);
      } catch (error) {
        console.error("❌ Ошибка загрузки:", error);
      }
    };

    fetchData();
  }, [router]);

  const calculateTotal = (finesList: Fine[]) => {
    const total = finesList
      .filter((f) => f.status === "UNPAID")
      .reduce((sum, f) => sum + f.amount, 0);
    setTotalUnpaid(total);
  };

  const handleLogout = () => {
    localStorage.removeItem("userdata");
    router.push("/");
  };

  const handlePayFine = async (fineId: number) => {
    try {
      const res = await fetch(
        `http://localhost:3002/vehicles/1/fines/${fineId}`,
        {
          method: "PUT",
          body: JSON.stringify({ status: "PAID" }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!res.ok) throw new Error("❌ Ошибка при оплате штрафа");

      console.log(`💳 Fine ${fineId} успешно оплачен`);

      const updatedFines = fines.map((f) =>
        f.id === fineId ? { ...f, status: "PAID" } : f,
      );
      setFines(updatedFines);
      calculateTotal(updatedFines);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "UNPAID":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Не оплачено
          </Badge>
        );
      case "PAID":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Оплачено
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-balance">Мої штрафи</h1>
            <p className="text-lg text-muted-foreground mt-1">
              Вітаємо, {userName}
            </p>
          </div>

          <Button variant="outline" size="lg" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Вийти
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Car className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Ваш автомобіль</CardTitle>
                  <CardDescription>
                    Інформація про зареєстрований транспортний засіб
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Номерний знак
                  </p>
                  <p className="text-3xl font-mono font-bold">
                    {userCar?.licensePlate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Марка</p>
                  <p className="text-2xl font-semibold">{userCar?.brand}</p>
                </div>
              </div>
            </CardContent>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/admin")}
            >
              <LogOut className="w-4 h-4 mr-2" />У адмiн-панель
            </Button>
          </Card>

          {totalUnpaid > 0 && (
            <Card className="shadow-lg border-red-200 bg-red-50">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base text-red-700 mb-2">
                      Загальна сума до сплати
                    </p>
                    <p className="text-4xl font-bold text-red-700">
                      {totalUnpaid} грн
                    </p>
                  </div>
                  <AlertCircle className="w-16 h-16 text-red-600" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Fines List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Список штрафів</h2>

          {fines.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="py-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Штрафів немає</h3>
                <p className="text-muted-foreground">
                  У вас немає активних штрафів. Дотримуйтесь ПДР!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {fines.map((fine) => (
                <Card
                  key={fine.id}
                  className="shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold text-xl text-pretty">
                            {fine.description}
                          </h3>
                          {getStatusBadge(fine.status)}
                        </div>
                        <div className="text-base text-muted-foreground space-y-1">
                          <p>
                            Дата:{" "}
                            {new Date(fine.date).toLocaleDateString("uk-UA")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">
                            Сума
                          </p>
                          <p className="text-3xl font-bold">
                            {fine.amount} грн
                          </p>
                        </div>

                        {fine.status === "UNPAID" && (
                          <Button
                            onClick={() =>
                              router.push(`/payment?fineId=${fine.id}`)
                            }
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Оплатити
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
