"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Car, AlertCircle } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-6">
      <Card className="max-w-4xl w-full shadow-xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-4 rounded-2xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-balance">
            Система управління штрафами
          </CardTitle>
          <CardDescription className="text-base text-pretty">
            Тестова версія державного порталу для перегляду та оплати штрафів за
            порушення ПДР
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-semibold mb-1">Це тестова версія</p>
              <p className="text-amber-800">
                Всі дані є демонстраційними. Реальні платежі не здійснюються.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-600" />
              Інструкції для входу
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-border rounded-lg p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">
                    Звичайний користувач
                  </h4>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Користувач
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Зареєструйтеся як новий користувач або увійдіть з тестовими
                  даними:
                </p>
                <div className="bg-muted rounded p-3 space-y-1 text-sm font-mono">
                  <p>
                    <span className="text-muted-foreground">Пошта:</span>{" "}
                    user@test.ua
                  </p>
                  <p>
                    <span className="text-muted-foreground">Пароль:</span>{" "}
                    user123
                  </p>
                </div>
              </div>

              <div className="border border-border rounded-lg p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">
                    Адміністратор
                  </h4>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    Адмін
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Увійдіть з правами адміністратора для управління штрафами:
                </p>
                <p className="text-sm text-muted-foreground">
                  Ви також можете зайти в адмін панель через панель стандартного
                  користувача. Після логіну натисніть на кнопку «адмін панель»
                </p>
              </div>
            </div>
          </div>

          <Button
            className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              router.push("auth");
            }}
          >
            Продовжити до входу
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
