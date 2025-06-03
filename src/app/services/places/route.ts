import type { NextApiRequest, NextApiResponse } from 'next';

const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_SERVER_API_KEY!;
type Prediction = { description: string; place_id: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { input } = req.body as { input?: string };
    if (!input || input.length < 3) {
        return res.status(400).json({ error: 'Invalid or too-short input' });
    }

    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
    url.searchParams.set('input', input);
    url.searchParams.set('components', 'country:ke');
    url.searchParams.set('key', GOOGLE_MAPS_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK') {
        return res.status(500).json({ error: data.status, details: data.error_message });
    }

    const suggestions: Prediction[] = data.predictions.map((p: any) => ({
        description: p.description,
        place_id: p.place_id,
    }));

    res.status(200).json({ suggestions });
}
