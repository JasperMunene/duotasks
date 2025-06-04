export interface TaskPayload {
    title: string;
    description: string;
    work_mode: 'remote' | 'physical';
    budget: number;
    images: string[];
    schedule_type?: 'specific_day' | 'before_day' | 'flexible';
    specific_date?: string;
    deadline_date?: string;
    preferred_time?: 'morning' | 'midday' | 'afternoon' | 'evening';
    latitude?: number;
    longitude?: number;
    city?: string;
    state?: string;
    country?: string;
    area?: string;
}
