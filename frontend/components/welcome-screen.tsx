"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, User, UserCog } from "lucide-react"

interface WelcomeScreenProps {
  onGetStarted: () => void
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center">
              <Shield className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Система управления штрафами</h1>
          <p className="text-xl text-muted-foreground">Государственный портал для контроля и оплаты штрафов</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Для пользователей</CardTitle>
              <CardDescription>Инструкция по использованию системы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium">1. Регистрация</h4>
                <p className="text-sm text-muted-foreground">
                  Зарегистрируйтесь, указав ФИО, email и пароль. После регистрации добавьте информацию о вашем
                  автомобиле.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">2. Просмотр штрафов</h4>
                <p className="text-sm text-muted-foreground">
                  В личном кабинете вы увидите все штрафы по вашему автомобилю с описанием и датой.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">3. Оплата</h4>
                <p className="text-sm text-muted-foreground">
                  Нажмите кнопку "Оплатить" рядом с неоплаченным штрафом для перехода к оплате.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <UserCog className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Для администраторов</CardTitle>
              <CardDescription>Управление системой штрафов</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium">1. Доступ к панели</h4>
                <p className="text-sm text-muted-foreground">
                  Из личного кабинета перейдите в административную панель.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">2. Просмотр автомобилей</h4>
                <p className="text-sm text-muted-foreground">
                  В админ-панели отображаются все зарегистрированные автомобили пользователей.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">3. Добавление штрафов</h4>
                <p className="text-sm text-muted-foreground">
                  Выберите автомобиль и добавьте новый штраф с описанием и суммой.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button size="lg" onClick={onGetStarted} className="px-8">
            Начать работу
          </Button>
        </div>
      </div>
    </div>
  )
}
