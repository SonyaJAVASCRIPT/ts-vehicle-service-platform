import { cookies } from "next/headers";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, CarIcon, Plus, UserIcon } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { userService, vehicleService } from "@/hooks/env";
export interface User {
  sub: string;
  username: string;
  fullName?: string;
  email?: string;
}

export interface Fine {
  id: number;
  date: string;
  description: string;
  amount: number;
  status: boolean;
  vehicleId: number;
}

export interface Car {
  id: number;
  plate: string;
  brand: string;
  ownerId: number;
  fines: Fine[];
  owner?: User;
}

async function getUser(token: string): Promise<User | null> {
  const res = await fetch(`${userService}/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

async function getCars(): Promise<Car[]> {
  const res = await fetch(`${vehicleService}/vehicles`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

async function createFine(formData: FormData) {
  "use server";

  const carId = formData.get("carId");
  const description = formData.get("description");
  const amount = formData.get("amount");

  if (!carId || !description || !amount) {
    throw new Error("Недостаточно данных для создания штрафа");
  }

  const res = await fetch(`${vehicleService}/fine/${carId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: description.toString(),
      amount: Number(amount),
      date: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка при создании штрафа: ${text}`);
  }

  const data = await res.json();
  console.log("Штраф создан:", data);
  revalidatePath("/admin");
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/");

  const user = await getUser(token);
  if (!user) redirect("/");

  const cars = await getCars();

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "UAH",
    }).format(amount);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <form action="/" method="get">
            <Button variant="ghost" className="mb-2" formAction="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад в личный кабинет
            </Button>
          </form>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Административная панель</h1>
              <p className="text-sm text-muted-foreground">
                Управление штрафами
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Все зарегистрированные автомобили
          </h2>
          <p className="text-muted-foreground">
            Всего автомобилей: {cars.length}
          </p>
        </div>

        {cars.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Нет зарегистрированных автомобилей
              </h3>
              <p className="text-muted-foreground">
                В системе пока нет транспортных средств
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cars
              .slice()
              .reverse()
              .map((car) => {
                const fines = [...car.fines];
                const unpaid = fines.filter((f) => !f.status);
                const totalUnpaid = unpaid.reduce(
                  (sum, f) => sum + f.amount,
                  0,
                );

                return (
                  <Card key={car.id} className="flex flex-col h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <CarIcon className="w-7 h-7 text-primary" />
                        </div>
                        {unpaid.length > 0 && (
                          <Badge variant="destructive">{unpaid.length}</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{car.brand}</CardTitle>
                      <CardDescription className="font-mono text-base">
                        {car.plate}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col justify-between flex-1 space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Владелец
                          </p>
                          <p className="font-medium">
                            {car.owner?.username || "Неизвестно"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {car.owner?.email}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Статистика штрафов
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Всего:</span>
                            <span className="font-medium">{fines.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Не оплачено:</span>
                            <span className="font-medium text-destructive">
                              {unpaid.length}
                            </span>
                          </div>
                          {totalUnpaid > 0 && (
                            <div className="flex items-center justify-between pt-1 border-t">
                              <span className="text-sm font-medium">
                                Сумма:
                              </span>
                              <span className="font-bold text-destructive">
                                {formatAmount(totalUnpaid)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full mt-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Добавить штраф
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Добавить штраф</DialogTitle>
                            <DialogDescription>
                              {car.brand} • {car.plate}
                            </DialogDescription>
                          </DialogHeader>

                          <form action={createFine} className="space-y-4">
                            <input
                              type="hidden"
                              name="carId"
                              value={car.ownerId}
                            />
                            <div className="space-y-2">
                              <Label htmlFor="description">
                                Описание нарушения
                              </Label>
                              <Textarea
                                id="description"
                                name="description"
                                placeholder="Превышение скорости на 20 км/ч..."
                                required
                                rows={3}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="amount">Сумма штрафа (грн)</Label>
                              <Input
                                id="amount"
                                name="amount"
                                type="number"
                                placeholder="500"
                                required
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button type="submit" className="flex-1">
                                Добавить штраф
                              </Button>
                              <Button type="button" variant="outline">
                                Отмена
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}
      </main>
    </div>
  );
}
