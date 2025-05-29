'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupFormValues, signupSchema } from '@/lib/auth-validation';
import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthDivider } from '@/components/auth/auth-divider';
import { GoogleButton } from '@/components/ui/google-button';
import { PasswordStrength } from '@/components/auth/password-strength';
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

export default function SignupPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            terms: false,
        },
        mode: 'onChange',
    });

    const password = form.watch('password');

    const onSubmit = async (values: SignupFormValues) => {
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                }),
            });

            if (res.status === 201) {
                toast({
                    title: 'Account created!',
                    description: 'Please check your email for the verification code.',
                });
                router.push('/auth/verify-email');
                return;
            }

            // Safely parse JSON (or fallback to empty object)
            const errorData = await res.json().catch(() => ({} as { message?: string }));
            const errorMessage =
                res.status === 409
                    ? errorData.message ?? 'Email already in use'
                    : errorData.message ?? 'Registration failed';

            throw new Error(errorMessage);
        } catch (unknownError: unknown) {
            console.error('Signup error:', unknownError);

            // Narrow down unknownError to Error to safely access message
            const message =
                unknownError instanceof Error
                    ? unknownError.message
                    : 'Something went wrong. Please try again.';

            toast({
                variant: 'destructive',
                title: 'Error',
                description: message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            heading="Create an account"
            subheading="Sign up to get started with Duotasks"
            backTo={{ href: '/', label: 'Back to home' }}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="John Doe"
                                        autoComplete="name"
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
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            autoComplete="new-password"
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
                                <PasswordStrength password={password} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? (
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
                        name="terms"
                        render={({ field }) => (
                            <FormItem className="flex items-start space-x-2 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm font-normal cursor-pointer">
                                        I agree to the{' '}
                                        <Link
                                            href="/terms"
                                            className="text-primary hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Terms of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link
                                            href="/privacy"
                                            className="text-primary hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Privacy Policy
                                        </Link>
                                    </FormLabel>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </Button>
                </form>
            </Form>

            <AuthDivider />

            <GoogleButton />

            <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account?</span>{' '}
                <Link
                    href="/auth/login"
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                    Sign in
                </Link>
            </div>
        </AuthLayout>
    );
}