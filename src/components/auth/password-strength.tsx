'use client';

import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface PasswordStrengthProps {
    password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
    const [strength, setStrength] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const calculateStrength = () => {
            if (!password) {
                setStrength(0);
                setMessage('');
                return;
            }

            let score = 0;

            // Length check
            if (password.length >= 8) score += 1;
            if (password.length >= 12) score += 1;

            // Complexity checks
            if (/[A-Z]/.test(password)) score += 1;
            if (/[a-z]/.test(password)) score += 1;
            if (/[0-9]/.test(password)) score += 1;
            if (/[^A-Za-z0-9]/.test(password)) score += 1;

            // Calculate final strength (0-4)
            const normalizedScore = Math.min(4, Math.floor(score / 1.5));
            setStrength(normalizedScore);

            // Set message based on strength
            const messages = [
                'Too weak',
                'Weak',
                'Fair',
                'Good',
                'Strong',
            ];
            setMessage(messages[normalizedScore]);
        };

        calculateStrength();
    }, [password]);

    return (
        <div className="space-y-2 mt-2">
            <div className="flex h-2 gap-1">
                {[0, 1, 2, 3].map((index) => (
                    <div
                        key={index}
                        className={cn(
                            'h-full w-full rounded-sm transition-all duration-300',
                            {
                                'bg-destructive opacity-100': strength > index,
                                'bg-destructive/30': strength <= index,
                                'bg-yellow-500 opacity-100': strength > index && strength === 2,
                                'bg-green-500 opacity-100': strength > index && strength >= 3,
                            }
                        )}
                    />
                ))}
            </div>
            {message && (
                <p
                    className={cn('text-xs transition-colors', {
                        'text-destructive': strength < 2,
                        'text-yellow-500': strength === 2,
                        'text-green-500': strength >= 3,
                    })}
                >
                    {message}
                </p>
            )}
        </div>
    );
}