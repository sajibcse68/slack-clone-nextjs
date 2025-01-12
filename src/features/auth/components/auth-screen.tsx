'use client';

import { useState } from 'react';
import { SignInFlow } from '../types';
import { SignInCard } from './sign-in-card';
import { SignUpCard } from './sign-up-card';

export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>('signIn');

  return (
    <div className="h-full flex justify-center items-center bg-[#5C3B58]">
      <div className="md:h-auto md:w-[420px]">
        <div className="bg-card p-8 rounded-lg shadow-lg">
          {state === 'signIn' ? (
            <SignInCard setState={setState} />
          ) : (
            <SignUpCard setState={setState} />
          )}
        </div>
      </div>
    </div>
  );
};
