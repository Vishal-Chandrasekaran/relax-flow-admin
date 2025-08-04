'use client';

import {useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Headphones} from 'lucide-react';
import {Loader2} from 'lucide-react';
import SimpleReactValidator from 'simple-react-validator';
import {showPasswordFn, toggleIconFn} from '@/lib/reusableFn';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [form, setState] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const simpleValidator = useRef(new SimpleReactValidator());
  const [forceUpdate, setForceUpdate] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {name, value, type, checked}: any = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    debugger;
    e.preventDefault();
    if (simpleValidator.current.allValid()) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        localStorage.setItem('token', '1234567890');
        // Navigate to dashboard on successful login
        router.push('/');
      } catch (error) {
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      simpleValidator.current.showMessages();
      setForceUpdate(forceUpdate + 1);
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Background with gradient */}
      <div className='fixed inset-0 bg-gradient-to-br from-purple-50 to-pink-50 -z-10' />

      <div className='flex flex-1 items-center justify-center p-4'>
        <div className='w-full max-w-md'>
          <div className='rounded-lg border bg-white shadow-lg p-8'>
            {/* Logo and Header */}
            <div className='flex flex-col items-center space-y-2 mb-8'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600'>
                <Headphones className='h-6 w-6 text-white' />
              </div>
              <h1 className='text-2xl font-bold'>RelaxFlow Admin</h1>
              <p className='text-sm text-muted-foreground text-center'>
                Sign in to access your admin dashboard
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className='space-y-4'
              data-np-autofill-form-type='login'
              data-np-checked='1'
            >
              <div className='flex flex-col space-y-2'>
                <label htmlFor='email' className='font-medium'>
                  Email
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  value={form.email}
                  onChange={handleChange}
                  placeholder='Enter email'
                  data-np-mark='1'
                  data-np-intersection-state='visible'
                  className='input p-2 border border-gray-300 rounded'
                />
                <div style={{color: 'red'}}>
                  {simpleValidator.current.message(
                    'email',
                    form.email,
                    'required|email'
                  )}
                </div>
              </div>
              <div className='flex flex-col space-y-2'>
                <label htmlFor='password' className='font-medium'>
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type={showPasswordFn(showPassword)}
                  value={form.password}
                  onChange={handleChange}
                  placeholder='Enter password'
                  className='input p-2 border border-gray-300 rounded'
                  data-np-intersection-state='visible'
                />
                <span
                  style={{
                    position: 'absolute',
                    left: 1120,
                    top: 510,
                    zIndex: 2
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                  role='button'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {toggleIconFn(showPassword)}
                </span>
                <div style={{color: 'red'}}>
                  {simpleValidator.current.message(
                    'password',
                    form.password,
                    'required|min:6'
                  )}
                </div>
              </div>
              <div className='flex flex-row-flex-col-reverse items-center space-x-2 space-y-0'>
                <input
                  id='rememberMe'
                  name='rememberMe'
                  type='checkbox'
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className='input p-2 border border-gray-300 rounded'
                />
                <label htmlFor='rememberMe' className='font-medium'>
                  Remember me
                </label>
                {simpleValidator.current.message(
                  'rememberMe',
                  form.rememberMe,
                  'boolean'
                )}
              </div>
              <button
                type='submit'
                className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-2 px-4 text-white'
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <Loader2 className='animate-spin' />
                    <p>Signing in...</p>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Additional Info */}
            <div className='mt-6 text-center text-xs text-muted-foreground'>
              <p>© 2024 RelaxFlow. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
