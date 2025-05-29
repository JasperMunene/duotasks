'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormValues, loginSchema } from '@/lib/auth-validation';
import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthDivider } from '@/components/auth/auth-divider';
import { GoogleButton } from '@/components/ui/google-button';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Success notification
            toast({
                title: 'Success!',
                description: 'You have been logged in.',
            });

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Invalid email or password. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            heading="Welcome back"
            subheading="Enter your credentials to sign in to your account"
            backTo={{ href: '/', label: 'Back to home' }}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="name@example.com"
                                        autoComplete="email"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel>Password</FormLabel>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <EyeIcon className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                    Remember me
                                </FormLabel>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>
            </Form>

            <AuthDivider />

            <GoogleButton />

            <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Don't have an account?</span>{' '}
                <Link
                    href="/auth/signup"
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                    Sign up
                </Link>
            </div>
        </AuthLayout>
    );
}