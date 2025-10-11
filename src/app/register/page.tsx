

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { Key, Loader2, Mail, UserPlus } from 'lucide-react';
import { SiGithub, SiGoogle } from '@icons-pack/react-simple-icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { initiateEmailSignUp, useAuth, useUser } from '@/firebase';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<'google' | 'github' | 'email' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user) {
    router.replace('/');
    return null;
  }

  const handleProviderSignIn = async (provider: GoogleAuthProvider | GithubAuthProvider) => {
    const providerId = provider.providerId.split('.')[0] as 'google' | 'github';
    setLoading(providerId);
    setError(null);
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (e: any) {
      console.error(e);
      setError(`Failed to sign in with ${providerId}.`);
    } finally {
      setLoading(null);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('email');
    setError(null);
    try {
      initiateEmailSignUp(auth, email, password);
    } catch (e: any) {
      console.error(e);
      setError('Could not create account. The email may be in use.');
    } finally {
      setLoading(null);
    }
  };

  const ProviderButton = ({
    provider,
    icon: Icon,
    label,
  }: {
    provider: 'google' | 'github';
    icon: React.ElementType;
    label: string;
  }) => (
    <Button
      variant="outline"
      className="w-full rounded-lg"
      onClick={() =>
        handleProviderSignIn(
          provider === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider()
        )
      }
      disabled={!!loading}
    >
      {loading === provider ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icon className="mr-2 h-4 w-4" />
      )}
      {label}
    </Button>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm rounded-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>Get started with Pandora</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Email"
                className="pl-10 rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="pl-10 rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full rounded-lg" disabled={!!loading}>
                {loading === 'email' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                Sign Up
              </Button>
          </form>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 -top-3 -translate-x-1/2 bg-card px-2 text-xs text-muted-foreground">
              OR
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ProviderButton provider="google" icon={SiGoogle} label="Google" />
            <ProviderButton provider="github" icon={SiGithub} label="GitHub" />
          </div>
        </CardContent>
         <CardFooter className="flex-col gap-4 text-sm">
            <div className="text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                    Sign In
                </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
