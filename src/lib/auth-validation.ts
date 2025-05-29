import * as z from 'zod';

export const loginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(8, {
        message: 'Password must be at least 8 characters',
    }),
    rememberMe: z.boolean().default(false),
});

export const signupSchema = z.object({
    name: z.string().min(2, {
        message: 'Name must be at least 2 characters',
    }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z
        .string()
        .min(8, {
            message: 'Password must be at least 8 characters',
        })
        .regex(/[A-Z]/, {
            message: 'Password must contain at least one uppercase letter',
        })
        .regex(/[a-z]/, {
            message: 'Password must contain at least one lowercase letter',
        })
        .regex(/[0-9]/, {
            message: 'Password must contain at least one number',
        }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
        message: 'You must agree to the terms and conditions',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
});

export const otpSchema = z.object({
    otp: z.string().length(6, {
        message: 'OTP must be 6 characters',
    }),
});

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, {
            message: 'Password must be at least 8 characters',
        })
        .regex(/[A-Z]/, {
            message: 'Password must contain at least one uppercase letter',
        })
        .regex(/[a-z]/, {
            message: 'Password must contain at least one lowercase letter',
        })
        .regex(/[0-9]/, {
            message: 'Password must contain at least one number',
        }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;