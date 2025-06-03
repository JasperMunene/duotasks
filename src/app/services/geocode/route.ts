import type { NextApiRequest, NextApiResponse } from 'next';

const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_SERVER_API_KEY!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { place_id } = req.body as { place_id?: string };
    if (!place_id) {
        return res.status(400).json({ error: 'Missing place_id' });
    }

    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.set('place_id', place_id);
    url.searchParams.set('key', GOOGLE_MAPS_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK') {
        return res.status(500).json({ error: data.status, details: data.error_message });
    }

    const loc = data.results[0].geometry.location;
    res.status(200).json({ latitude: loc.lat, longitude: loc.lng });
}
