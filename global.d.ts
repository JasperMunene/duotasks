// global.d.ts
export {};  // this file needs to be a module

declare global {
    interface Window {
        initMap: () => void;
    }
}
