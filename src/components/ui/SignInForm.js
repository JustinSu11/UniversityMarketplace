'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const SignInForm = ({ onSwitchToSignUp }) => {
  return (
    <Card className="mx-auto max-w-sm border-0 shadow-none">
        <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
            Enter your email below to login to your account
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form>
            <div className="grid gap-4">
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                Login
                </Button>
            </div>
            </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm">
            Don&apos;t have an account?{' '}
            <button
              onClick={onSwitchToSignUp}
              className="underline font-semibold text-primary"
            >
              Sign up
            </button>
          </div>
        </CardFooter>
    </Card>
  );
}

export default SignInForm;