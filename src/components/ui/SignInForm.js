'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';
import { signIn } from 'next-auth/react';

export default function SignInForm({ onSwitchToSignUp, nextPath = '/after-login' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email.trim().toLowerCase(),
        password: password.trim(),
        callbackUrl: nextPath,              // << important
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      // full page nav so server components see new session
      window.location.assign(nextPath);     // << important
    } catch {
      // swallow state updates after nav
      return;
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
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
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
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Use the SAME nextPath for Google */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signIn('google', { callbackUrl: nextPath })}
            >
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
