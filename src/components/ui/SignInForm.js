'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';
import { signIn } from 'next-auth/react'

export default function SignInForm({ onSwitchToSignUp, nextPath = '/user' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      email: email.trim().toLowerCase(),
      password: password.trim(),
    };
    console.log('[signin] submitting', payload);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data = null;
      try { data = await res.json(); } catch {}

      console.log('[signin] response', res.status, data);

      if (!res.ok) {
        setError(data?.error || `Login failed (${res.status})`);
        setLoading(false);
        return;
      }

      // 🔨 Brute-force full navigation so server components see the cookie
      window.location.assign(nextPath);
      return; // stop any further state updates
    } catch (err) {
      console.error(err);
      setError('Network error. Is the dev server running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-sm border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in…' : 'Login'}
            </Button>
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => signIn('google')}>
                  Sign in with Google
                </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm">
          Don&apos;t have an account?{' '}
          <button type="button" onClick={onSwitchToSignUp} className="underline font-semibold text-primary">
            Sign up
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
