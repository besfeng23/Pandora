'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { Mail, Key, LogIn, Loader2 } from 'lucide-react';
import { SiGithub, SiGoogle, SiNotion, SiLinear } from '@icons-pack/react-simple-icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth, useUser } from '@/firebase';
import { useToast } from '@/components/ui/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<
    'google' | 'github' | 'email' | 'notion' | 'linear' | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

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

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('email');
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (e: any) {
      console.error(e);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(null);
    }
  };
  
  const handlePlaceholderSignIn = (providerName: string) => {
    toast({
      title: "Integration Not Implemented",
      description: `${providerName} sign-in is not yet available.`,
    });
  };

  const ProviderButton = ({
    provider,
    icon: Icon,
    label,
    onClick,
  }: {
    provider: 'google' | 'github' | 'notion' | 'linear';
    icon: React.ElementType;
    label: string;
    onClick: () => void;
  }) => (
    <Button
      variant="outline"
      className="w-full"
      onClick={onClick}
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
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Email"
                className="pl-10"
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
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full" disabled={!!loading}>
              {loading === 'email' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 -top-3 -translate-x-1/2 bg-card px-2 text-xs text-muted-foreground">
              OR CONTINUE WITH
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <ProviderButton
              provider="google"
              icon={SiGoogle}
              label="Google"
              onClick={() => handleProviderSignIn(new GoogleAuthProvider())}
            />
            <ProviderButton
              provider="github"
              icon={SiGithub}
              label="GitHub"
              onClick={() => handleProviderSignIn(new GithubAuthProvider())}
            />
            <ProviderButton
              provider="notion"
              icon={SiNotion}
              label="Notion"
              onClick={() => handlePlaceholderSignIn('Notion')}
            />
             <ProviderButton
              provider="linear"
              icon={SiLinear}
              label="Linear"
              onClick={() => handlePlaceholderSignIn('Linear')}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-center">
            <p className="text-xs text-muted-foreground">
                Don't have an account? <a href="#" className="text-primary hover:underline">Sign Up</a>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
