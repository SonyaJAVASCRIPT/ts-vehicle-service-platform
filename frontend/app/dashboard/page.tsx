import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CarIcon, Calendar, FileText, LogOut, Settings } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { userService, vehicleService } from "../../hooks/env";

export interface User {
  sub: string;
  username: string;
  fullName?: string;
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
}

async function getCar(userId: string): Promise<Car | null> {
  console.log(userId);
  const res = await fetch(`${vehicleService}/vehicles/${userId}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function Page() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;
  if (!token) {
    redirect("/");
  }
  console.log(token);
  const userRes = await fetch(`${userService}/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!userRes.ok) {
    redirect("/");
  }
  const user: User = await userRes.json();
  const car = await getCar(user.sub);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "UAH",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <CarIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Личный кабинет</h1>
              <h1>{user.username}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <form action="/">
              <Button variant="outline" formAction="/admin">
                <Settings className="w-4 h-4 mr-2" />
                Админ-панель
              </Button>
              <Button variant="ghost">
                <LogOut className="w-4 h-4 mr-2" />
                Выход
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {!car ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Нет зарегистрированных автомобилей
                </h3>
                <p className="text-muted-foreground">
                  У вас пока нет добавленных транспортных средств
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card key={car.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                      <CarIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{car.brand}</CardTitle>
                      <CardDescription className="text-lg font-mono">
                        {car.plate}
                      </CardDescription>
                    </div>
                  </div>
                  {car.fines.some((f) => !f.status) && (
                    <Badge
                      variant="destructive"
                      className="text-base px-3 py-1"
                    >
                      {car.fines.filter((f) => !f.status).length} штраф(ов)
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {car.fines.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p>Нет штрафов по данному автомобилю</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {car.fines.filter((f) => !f.status).length > 0 && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                        <p className="text-sm font-medium text-destructive mb-1">
                          Неоплаченные штрафы
                        </p>
                        <p className="text-2xl font-bold text-destructive">
                          {formatAmount(
                            car.fines
                              .filter((f) => !f.status)
                              .reduce((sum, f) => sum + f.amount, 0),
                          )}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3">
                      {car.fines.map((fine) => (
                        <div
                          key={fine.id}
                          className="border rounded-lg p-4 flex items-start justify-between gap-4"
                        >
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  fine.status ? "secondary" : "destructive"
                                }
                              >
                                {fine.status ? "Оплачено" : "Не оплачено"}
                              </Badge>
                              <span className="text-lg font-bold">
                                {formatAmount(fine.amount)}
                              </span>
                            </div>
                            <p className="text-sm text-foreground leading-relaxed">
                              {fine.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(fine.date)}</span>
                            </div>
                          </div>
                          {!fine.status && (
                            <Button asChild>
                              <a href={`/payment/${fine.id}`}>Оплатить</a>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
