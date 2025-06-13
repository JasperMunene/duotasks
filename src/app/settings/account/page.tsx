'use client';

import { useState, useRef } from 'react';
import { User, MapPin, Calendar, Briefcase, Edit2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

export default function AccountSettings() {
    const [firstName, setFirstName] = useState('Jasper');
    const [lastName, setLastName] = useState('Munene');
    const [location, setLocation] = useState('Nairobi, Kenya');
    const [birthday, setBirthday] = useState('1985-03-15');
    const [tagline, setTagline] = useState('Experienced handyman and home repair specialist');
    const [accountType, setAccountType] = useState<'earn' | 'complete'>('earn');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const saveAccountDetails = async () => {
        toast({
            title: "Account Updated",
            description: "Your account details have been saved successfully",
        });
    };

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-6 h-6 text-emerald-600" />
                    Account Details
                </h1>
                <p className="text-slate-600 mt-1">
                    Manage your personal information and account preferences.
                </p>
            </div>

            <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Profile Image */}
                    <div className="space-y-4">
                        <Label>Profile Image</Label>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                                            <User className="w-8 h-8 text-emerald-600" />
                                        </div>
                                    )}
                                </div>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-white shadow-sm"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Edit2 className="w-3 h-3" />
                                </Button>
                            </div>
                            <div>
                                <Button
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-slate-200 hover:bg-emerald-50 hover:border-emerald-300"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Photo
                                </Button>
                                <p className="text-xs text-slate-500 mt-1">JPG, PNG up to 5MB</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleProfileImageChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Jasper"
                                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Munene"
                                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="pl-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                placeholder="Nairobi, Kenya"
                            />
                        </div>
                    </div>

                    {/* Birthday */}
                    <div className="space-y-2">
                        <Label htmlFor="birthday">Birthday</Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                id="birthday"
                                type="date"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                                className="pl-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    {/* Tagline */}
                    <div className="space-y-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Textarea
                            id="tagline"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            placeholder="Tell people about yourself..."
                            rows={3}
                            className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                    </div>

                    {/* Account Type */}
                    <div className="space-y-3">
                        <Label>I want to</Label>
                        <RadioGroup value={accountType} onValueChange={(value: 'earn' | 'complete') => setAccountType(value)}>
                            <div className="flex items-center space-x-3 bg-white border border-slate-200 rounded-lg p-3 hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                                <RadioGroupItem value="earn" id="earn" className="text-emerald-600" />
                                <Label htmlFor="earn" className="flex items-center gap-2 cursor-pointer flex-1">
                                    <Briefcase className="w-4 h-4 text-emerald-600" />
                                    Make money by completing tasks
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3 bg-white border border-slate-200 rounded-lg p-3 hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                                <RadioGroupItem value="complete" id="complete" className="text-emerald-600" />
                                <Label htmlFor="complete" className="flex items-center gap-2 cursor-pointer flex-1">
                                    <User className="w-4 h-4 text-emerald-600" />
                                    Post tasks for others to complete
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Save Button */}
                    <Button
                        onClick={saveAccountDetails}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        Save Changes
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}