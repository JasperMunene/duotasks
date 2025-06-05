import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export type SortOption =
    | 'recommended'
    | 'recent'
    | 'due-soon'
    | 'closest'
    | 'price-low'
    | 'price-high';

interface SortFilterProps {
    onApply: (option: SortOption) => void;
    initialValue?: SortOption;
}

export default function SortFilter({
                                       onApply,
                                       initialValue = 'recommended',
                                   }: SortFilterProps) {
    const [selectedOption, setSelectedOption] = useState<SortOption>(initialValue);

    const sortOptions = [
        { value: 'recommended', label: 'Recommended', description: 'Tasks that best match your skills and preferences' },
        { value: 'recent', label: 'Most recently posted', description: 'Newest tasks first' },
        { value: 'due-soon', label: 'Due soon', description: 'Tasks that need to be completed soon' },
        { value: 'closest', label: 'Closest to me', description: 'Tasks nearest to your location' },
        { value: 'price-low', label: 'Lowest price', description: 'Tasks with the lowest budget first' },
        { value: 'price-high', label: 'Highest price', description: 'Tasks with the highest budget first' },
    ] as const;

    const handleSelect = (value: SortOption) => {
        setSelectedOption(value);
        onApply(value);
    };

    return (
        <div className="w-[400px] bg-white rounded-lg">
            <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Sort by</h3>
            </div>

            <div className="p-4">
                <RadioGroup
                    value={selectedOption}
                    onValueChange={(value) => handleSelect(value as SortOption)}
                    className="space-y-3"
                >
                    {sortOptions.map((option) => (
                        <div
                            key={option.value}
                            className="flex items-center space-x-3 bg-white border border-slate-200 rounded-lg p-3 hover:bg-slate-50 cursor-pointer transition-colors duration-200"
                            onClick={() => handleSelect(option.value)}
                        >
                            <RadioGroupItem
                                value={option.value}
                                id={option.value}
                                className="text-emerald-600"
                            />
                            <Label
                                htmlFor={option.value}
                                className="flex-1 cursor-pointer"
                            >
                                <div className="font-medium text-slate-900">{option.label}</div>
                                <div className="text-sm text-slate-500">{option.description}</div>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
        </div>
    );
}
