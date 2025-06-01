// src/types/mapbox-geocoding.d.ts
declare module '@mapbox/mapbox-sdk/services/geocoding' {
    import { GeocodingService } from '@mapbox/mapbox-sdk';
    const mbxGeocoding: (config: { accessToken: string }) => GeocodingService;
    export default mbxGeocoding;
}
