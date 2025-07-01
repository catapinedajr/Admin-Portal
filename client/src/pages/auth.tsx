import { useState } from 'react';
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

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  email: z.string().email('Valid email is required for account recovery'),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

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
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

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
    },
    mode: 'onChange',
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return await response.json() as AuthResponse;
    },
    onSuccess: (data) => {
      // Store session in localStorage
      localStorage.setItem('hodlearn_session', data.sessionId);
      localStorage.setItem('hodlearn_user', JSON.stringify(data.user));
      
      toast({
        title: 'Welcome back!',
        description: `Logged in as ${data.user.username}`,
      });
      
      // Redirect to home
      window.location.href = '/';
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
      const response = await apiRequest('POST', '/api/auth/register', data);
      return await response.json() as AuthResponse;
    },
    onSuccess: (data) => {
      // Store session in localStorage
      localStorage.setItem('hodlearn_session', data.sessionId);
      localStorage.setItem('hodlearn_user', JSON.stringify(data.user));
      
      toast({
        title: 'Welcome to HODLearn!',
        description: `Account created for ${data.user.username}`,
      });
      
      // Redirect to home
      window.location.href = '/';
    },
    onError: (error: any) => {
      toast({
        title: 'Registration failed',
        description: error.message || 'Username might already exist',
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

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-orange-500">Welcome to HODLearn</h1>
            <p className="text-lg md:text-xl text-zinc-300">Understanding Bitcoin takes time</p>
            <p className="text-lg md:text-xl text-zinc-300">Building conviction takes discipline</p>
            <p className="text-xl md:text-2xl font-bold text-orange-400">This is HODLearn</p>
          </div>
        </div>

        <Card className="border-zinc-700 bg-zinc-800 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-zinc-200">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </CardTitle>
            <p className="text-sm text-zinc-400">
              {isLogin 
                ? 'Continue your Bitcoin learning journey' 
                : 'Start your Bitcoin education today'
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {isLogin ? (
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
                    {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Choose a username"
                    value={registerForm.watch('username') || ''}
                    onChange={(e) => registerForm.setValue('username', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {registerForm.formState.errors.username && (
                    <p className="text-sm text-red-500 mt-1">
                      {registerForm.formState.errors.username.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={registerForm.watch('password') || ''}
                    onChange={(e) => registerForm.setValue('password', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={registerForm.watch('email') || ''}
                    onChange={(e) => registerForm.setValue('email', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button 
                  onClick={registerForm.handleSubmit(onRegisterSubmit)}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
                </Button>
              </div>
            )}
            
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => {
                  setIsLogin(!isLogin);
                  // Reset both forms when switching
                  loginForm.reset();
                  registerForm.reset();
                }}
                className="text-orange-500 hover:text-orange-600"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}