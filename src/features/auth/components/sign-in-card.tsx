import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { SignInFlow } from '../types';

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleProviderSignin = (value: 'github' | 'google') => {
    signIn(value);
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>

        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            disabled={false}
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={false}
            required
          />

          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Continue
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button
            className="w-full relative"
            variant="outline"
            size="lg"
            disabled={false}
            onClick={() => {}}
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            Continue with Google
          </Button>
          <Button
            className="w-full relative"
            variant="outline"
            size="lg"
            disabled={false}
            onClick={() => handleProviderSignin('github')}
          >
            <FaGithub className="size-5 absolute top-2.5 left-2.5" />
            Continue with Github
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState('signUp')}
          >
            {' '}
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
