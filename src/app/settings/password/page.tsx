'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function PasswordSettings() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { toast } = useToast();

    const changePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast({
                title: "Password Mismatch",
                description: "New password and confirmation don't match",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "Password Updated",
            description: "Your password has been changed successfully",
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const passwordRequirements = [
        { text: 'At least 8 characters', met: newPassword.length >= 8 },
        { text: 'Contains uppercase letter', met: /[A-Z]/.test(newPassword) },
        { text: 'Contains lowercase letter', met: /[a-z]/.test(newPassword) },
        { text: 'Contains number', met: /\d/.test(newPassword) },
        { text: 'Contains special character', met: /[!@#$%^&*]/.test(newPassword) },
    ];

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Lock className="w-6 h-6 text-emerald-600" />
                    Change Password
                </h1>
                <p className="text-slate-600 mt-1">
                    Update your password to keep your account secure.
                </p>
            </div>

            <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Password Security</CardTitle>
                    <p className="text-sm text-slate-600">Create a strong password to protect your account</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Current Password */}
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                            <Input
                                id="currentPassword"
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="pr-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                placeholder="Enter current password"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="pr-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                placeholder="Enter new password"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pr-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                placeholder="Confirm new password"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    {/* Password Requirements */}
                    {newPassword && (
                        <div className="space-y-2">
                            <Label>Password Requirements</Label>
                            <div className="space-y-1">
                                {passwordRequirements.map((req, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                        <div className={`w-2 h-2 rounded-full ${req.met ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                        <span className={req.met ? 'text-emerald-700' : 'text-slate-600'}>
                      {req.text}
                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Update Button */}
                    <Button
                        onClick={changePassword}
                        disabled={!currentPassword || !newPassword || !confirmPassword || passwordRequirements.some(req => !req.met)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        Update Password
                    </Button>

                    {/* Security Tips */}
                    <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-medium text-slate-900 mb-2">Security Tips:</h4>
                        <ul className="space-y-1 text-xs">
                            <li>• Use a unique password that you don't use elsewhere</li>
                            <li>• Consider using a password manager</li>
                            <li>• Avoid using personal information in your password</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}