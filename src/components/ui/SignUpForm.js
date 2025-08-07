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

const SignUpForm = ({ onSwitchToSignIn }) => {
  return (
    <Card className="mx-auto max-w-sm border-0 shadow-none">
        <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
            Create your CampusExchange account to start buying and selling.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" type="text" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" type="text" required />
                    </div>
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" type="text" required />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="NewUser@example.com" required />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                    <Input id="phoneNumber" type="tel" placeholder="123-456-7890" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$" title="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character." required />
                    </div>
                    <Button type="submit" className="w-full">
                    Create Account
                    </Button>
                </div>
            </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm">
            Already have an account?{' '}
            <button
              onClick={onSwitchToSignIn}
              className="underline font-semibold text-primary"
            >
              Sign in
            </button>
          </div>
        </CardFooter>
    </Card>
  );
}

export default SignUpForm
