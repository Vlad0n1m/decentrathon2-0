'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { OnboardingInfo } from '@/components/OnboardingInfo';
export function Onboarding({ onComplete }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      try {
        const response = await fetch(`/api/${isLogin ? 'login' : 'register'}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('userId', data.user.id);
          localStorage.setItem('username', data.user.username);
          localStorage.setItem('token', data.token);
          onComplete(data.user.username, data.user.id);
        } else {
          throw new Error(isLogin ? 'Login failed' : 'Registration failed');
        }
      } catch (error) {
        console.error(error);
        // Here you might want to show an error message to the user
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10 p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">
        {isLogin ? 'Вход' : 'Регистрация'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </Button>
      </form>
      <Button 
        variant="link" 
        onClick={() => setIsLogin(!isLogin)} 
        className="w-full"
      >
        {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
      </Button>
      <OnboardingInfo />
    </Card>
  );
}
