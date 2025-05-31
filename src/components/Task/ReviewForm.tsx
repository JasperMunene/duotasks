'use client';

export default function ReviewForm({
                                       data,
                                       onBack,
                                       onPublish,
                                   }: {
    data: {
        title: string;
        date: string;
        location: string;
        description: string;
        budget: string;
    };
    onBack: () => void;
    onPublish: () => void;
}) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-900">Review your task</h2>
            <p className="text-gray-600">Make sure everything looks good before posting.</p>

            <div className="space-y-4">
                <ReviewItem label="Title" value={data.title} />
                <ReviewItem label="Date" value={data.date} />
                <ReviewItem label="Location" value={data.location} />
                <ReviewItem label="Description" value={data.description} />
                <ReviewItem label="Budget" value={`KES ${data.budget}`} />
            </div>

            <div className="flex justify-between pt-6">
                <button
                    onClick={onBack}
                    className="bg-emerald-50 text-emerald-900 py-3 px-6 rounded-full font-semibold"
                >
                    Back
                </button>
                <button
                    onClick={onPublish}
                    className="bg-emerald-500 text-white py-3 px-6 rounded-full font-semibold"
                >
                    Publish Task
                </button>
            </div>
        </div>
    );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <h4 className="text-sm font-medium text-emerald-900">{label}</h4>
            <p className="text-gray-700 bg-gray-100 px-4 py-2 rounded-lg mt-1">{value}</p>
        </div>
    );
}
