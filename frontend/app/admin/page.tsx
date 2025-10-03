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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Shield, LogOut, Plus, Car, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface CarWithFines {
  id: number;
  plate: string;
  brand: string;
  ownerId: number;
  fines: Fine[];
}

interface Fine {
  id: number;
  description: string;
  amount: number;
  date: string;
  status: "PAID" | "UNPAID";
}

interface FineForm {
  description: string;
  amount: string;
  location: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [cars, setCars] = useState<CarWithFines[]>([]);
  const [selectedCar, setSelectedCar] = useState<CarWithFines | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fineForm, setFineForm] = useState<FineForm>({
    description: "",
    amount: "",
    location: "",
  });

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const res = await fetch("http://localhost:3002/vehicles");
      if (!res.ok) throw new Error("Помилка завантаження авто");
      const data = await res.json();
      setCars(data);
    } catch (err) {
      console.error("❌ Не вдалося завантажити авто:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  const handleAddFine = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCar) return;

    try {
      const res = await fetch(
        `http://localhost:3002/vehicles/${selectedCar.id}/fines`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: fineForm.description,
            amount: parseFloat(fineForm.amount),
            date: new Date().toISOString(),
            status: "UNPAID",
          }),
        },
      );

      if (!res.ok) throw new Error("❌ Помилка при додаванні штрафу");

      alert(`✅ Штраф додано для ${selectedCar.plate}`);
      setIsDialogOpen(false);
      setSelectedCar(null);
      setFineForm({ description: "", amount: "", location: "" });

      loadCars();
    } catch (err) {
      console.error("❌ handleAddFine error:", err);
      alert("Не вдалося додати штраф");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-purple-600 p-3 rounded-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Адмін-панель</h1>
              <p className="text-lg text-muted-foreground">
                Управління штрафами та користувачами
              </p>
            </div>
          </div>
          <Button variant="outline" size="lg" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Вийти
          </Button>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push("/dashboard")}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Назад
        </Button>
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardContent className="pt-8 pb-8">
              <p className="text-sm text-muted-foreground mb-1">
                Всього автомобілів
              </p>
              <p className="text-3xl font-bold">{cars.length}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-8 pb-8">
              <p className="text-sm text-muted-foreground mb-1">
                Всього штрафів
              </p>
              <p className="text-3xl font-bold">
                {cars.reduce((sum, c) => sum + c.fines.length, 0)}
              </p>
            </CardContent>
          </Card>
        </div>
        {/* Cars List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Список автомобілів</CardTitle>
            <CardDescription>
              Виберіть авто для додавання штрафу
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cars.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Немає зареєстрованих авто
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cars.map((car) => (
                  <Card
                    key={car.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6 flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-mono font-bold">
                          {car.plate}
                        </p>
                        <Badge variant="outline">{car.brand}</Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          Власник ID: {car.ownerId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Штрафів: {car.fines.length}
                        </p>
                      </div>

                      <Dialog
                        open={isDialogOpen && selectedCar?.id === car.id}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedCar(car)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Додати штраф
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Додати штраф</DialogTitle>
                            <DialogDescription>
                              Додайте штраф для {car.plate}
                            </DialogDescription>
                          </DialogHeader>

                          <form onSubmit={handleAddFine} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="description">Опис</Label>
                              <Textarea
                                id="description"
                                value={fineForm.description}
                                onChange={(e) =>
                                  setFineForm({
                                    ...fineForm,
                                    description: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="amount">Сума (грн)</Label>
                              <Input
                                id="amount"
                                type="number"
                                value={fineForm.amount}
                                onChange={(e) =>
                                  setFineForm({
                                    ...fineForm,
                                    amount: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsDialogOpen(false);
                                  setSelectedCar(null);
                                }}
                                className="flex-1"
                              >
                                Скасувати
                              </Button>
                              <Button
                                type="submit"
                                className="flex-1 bg-purple-600 hover:bg-purple-700"
                              >
                                Додати
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
