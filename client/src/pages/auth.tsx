import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  email: z.string().email('Valid email is required for account recovery'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  acceptedTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the Terms of Service and Privacy Policy to create an account'
  }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().uuid('Invalid reset token'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;
type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

interface AuthResponse {
  user: {
    id: number;
    username: string;
    email?: string;
    currentStreak: number;
    longestStreak: number;
    completedLessons: number;
    lastActivityDate?: string;
  };
  sessionId: string;
  message: string;
}

export function AuthPage() {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot-password' | 'reset-password'>('login');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if we have a reset token in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get('token');
  
  // If we have a reset token, show the reset password form
  useEffect(() => {
    if (resetToken && authMode !== 'reset-password') {
      setAuthMode('reset-password');
    }
  }, [resetToken, authMode]);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      acceptedTerms: false,
    },
    mode: 'onChange',
  });

  const forgotPasswordForm = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const resetPasswordForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: resetToken || '',
      newPassword: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return await response.json() as AuthResponse;
    },
    onSuccess: (data) => {
      // Store session in localStorage
      try {
        localStorage.setItem('hodlearn_session', data.sessionId);
        localStorage.setItem('hodlearn_user', JSON.stringify(data.user));
      } catch (error) {
      }
      
      toast({
        title: 'Welcome back!',
        description: `Logged in as ${data.user.username}`,
      });
      
      // Use React Router navigation to prevent white screen flash
      setLocation('/');
    },
    onError: (error: any) => {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid username or password',
        variant: 'destructive',
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      let utmData = null;
      try {
        const stored = localStorage.getItem('hodlearn_utm');
        if (stored) {
          utmData = JSON.parse(stored);
        }
      } catch (e) {}
      
      const payload = {
        ...data,
        utmSource: utmData?.utm_source || null,
        utmMedium: utmData?.utm_medium || null,
        utmCampaign: utmData?.utm_campaign || null,
        utmContent: utmData?.utm_content || null,
      };
      
      const response = await apiRequest('POST', '/api/auth/register', payload);
      return await response.json() as AuthResponse;
    },
    onSuccess: (data) => {
      try {
        localStorage.setItem('hodlearn_session', data.sessionId);
        localStorage.setItem('hodlearn_user', JSON.stringify(data.user));
        localStorage.removeItem('hodlearn_utm');
      } catch (error) {
      }
      
      toast({
        title: 'Welcome to HODLearn!',
        description: `Account created for ${data.user.username}`,
      });
      
      setLocation('/');
    },
    onError: (error: any) => {
      toast({
        title: 'Registration failed',
        description: error.message || 'Username might already exist',
        variant: 'destructive',
      });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordForm) => {
      const response = await apiRequest('POST', '/api/auth/forgot-password', data);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Reset link sent',
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send reset email',
        variant: 'destructive',
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordForm) => {
      const response = await apiRequest('POST', '/api/auth/reset-password', data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Password reset successful',
        description: 'You can now log in with your new password',
      });
      setAuthMode('login');
    },
    onError: (error: any) => {
      toast({
        title: 'Reset failed',
        description: error.message || 'Invalid or expired token',
        variant: 'destructive',
      });
    },
  });

  const onLoginSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  const onForgotPasswordSubmit = (data: ForgotPasswordForm) => {
    forgotPasswordMutation.mutate(data);
  };

  const onResetPasswordSubmit = (data: ResetPasswordForm) => {
    resetPasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, orange 1px, transparent 1px),
            radial-gradient(circle at 80% 50%, orange 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 120px 120px'
        }} />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6">Welcome</h1>
            <p className="text-xl md:text-2xl text-zinc-300 font-medium">Stop wondering about Bitcoin</p>
            <p className="text-lg md:text-xl text-zinc-400">Start Learning</p>
            <div className="text-center space-y-1 mt-8">
              <p className="text-xl md:text-2xl font-bold text-orange-400">This is</p>
              <p className="text-3xl md:text-4xl font-bold text-orange-400">HODLearn</p>
              <p className="text-xs md:text-sm text-zinc-400">How-to-learn BTC</p>
            </div>
          </div>
        </div>

        <Card className="border-zinc-700 bg-zinc-800 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-zinc-200">
              {authMode === 'login' && 'Welcome Back'}
              {authMode === 'register' && 'Create Your Account'}
              {authMode === 'forgot-password' && 'Reset Password'}
              {authMode === 'reset-password' && 'Set New Password'}
            </CardTitle>
            <p className="text-sm text-zinc-400">
              {authMode === 'login' && 'Continue your Bitcoin learning journey'}
              {authMode === 'register' && 'Start your Bitcoin education today'}
              {authMode === 'forgot-password' && 'Enter your email to receive a reset link'}
              {authMode === 'reset-password' && 'Enter your new password'}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Login Form */}
            {authMode === 'login' && (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your username" 
                            {...field}
                            autoComplete="username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter your password" 
                            {...field}
                            autoComplete="current-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : 'Sign In'}
                  </Button>
                  
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setAuthMode('forgot-password')}
                      className="text-orange-500 hover:text-orange-600 text-sm"
                    >
                      Forgot password?
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            {/* Register Form */}
            {authMode === 'register' && (
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <div className="space-y-4">
                    {/* First and Last Name */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          placeholder="John"
                          value={registerForm.watch('firstName')}
                          onChange={(e) => registerForm.setValue('firstName', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          autoComplete="given-name"
                        />
                        {registerForm.formState.errors.firstName && (
                          <p className="mt-1 text-sm text-red-400">
                            {registerForm.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          placeholder="Doe"
                          value={registerForm.watch('lastName')}
                          onChange={(e) => registerForm.setValue('lastName', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          autoComplete="family-name"
                        />
                        {registerForm.formState.errors.lastName && (
                          <p className="mt-1 text-sm text-red-400">
                            {registerForm.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">
                        Username / Community Alias
                      </label>
                      <input
                        type="text"
                        placeholder="Choose a username for community forums"
                        value={registerForm.watch('username')}
                        onChange={(e) => registerForm.setValue('username', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        autoComplete="username"
                      />
                      {registerForm.formState.errors.username && (
                        <p className="mt-1 text-sm text-red-400">
                          {registerForm.formState.errors.username.message}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-zinc-400">
                        This will be your public alias in community discussions
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Create a password (minimum 6 characters)"
                        value={registerForm.watch('password')}
                        onChange={(e) => registerForm.setValue('password', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        autoComplete="new-password"
                      />
                      {registerForm.formState.errors.password && (
                        <p className="mt-1 text-sm text-red-400">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">
                        Email <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email for account recovery"
                        value={registerForm.watch('email')}
                        onChange={(e) => registerForm.setValue('email', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        autoComplete="email"
                      />
                      {registerForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-400">
                          {registerForm.formState.errors.email.message}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-zinc-400">
                        Required for password recovery
                      </p>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="acceptedTerms"
                          checked={registerForm.watch('acceptedTerms')}
                          onChange={(e) => registerForm.setValue('acceptedTerms', e.target.checked)}
                          className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500 border-zinc-600 rounded bg-zinc-700"
                        />
                        <label htmlFor="acceptedTerms" className="text-sm text-zinc-300 leading-tight">
                          I agree to the{' '}
                          <a 
                            href="/terms" 
                            target="_blank" 
                            className="text-orange-500 hover:text-orange-400 underline"
                          >
                            Terms of Service
                          </a>
                          {' '}and{' '}
                          <a 
                            href="/privacy" 
                            target="_blank" 
                            className="text-orange-500 hover:text-orange-400 underline"
                          >
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                      {registerForm.formState.errors.acceptedTerms && (
                        <p className="text-sm text-red-400 ml-7">
                          {registerForm.formState.errors.acceptedTerms.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : 'Create Account'}
                  </Button>
                </form>
              </Form>
            )}

            {/* Forgot Password Form */}
            {authMode === 'forgot-password' && (
              <Form {...forgotPasswordForm}>
                <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={forgotPasswordForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="Enter your email address" 
                            {...field}
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={forgotPasswordMutation.isPending}
                  >
                    {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                  
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setAuthMode('login')}
                      className="text-orange-500 hover:text-orange-600 text-sm"
                    >
                      Back to Sign In
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            {/* Reset Password Form */}
            {authMode === 'reset-password' && (
              <Form {...resetPasswordForm}>
                <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={resetPasswordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="Enter your new password" 
                            {...field}
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
                  </Button>
                  
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setAuthMode('login')}
                      className="text-orange-500 hover:text-orange-600 text-sm"
                    >
                      Back to Sign In
                    </Button>
                  </div>
                </form>
              </Form>
            )}
            
            {/* Mode Switch Buttons */}
            {(authMode === 'login' || authMode === 'register') && (
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'register' : 'login');
                    // Reset forms when switching
                    loginForm.reset();
                    registerForm.reset();
                  }}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {authMode === 'login'
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Sign in'
                  }
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Value Proposition at Bottom */}
        <div className="text-center mt-8">
          <p className="text-sm text-zinc-500">
            Master Bitcoin through easy daily 5-minute lessons
          </p>
        </div>
      </div>
    </div>
  );
}