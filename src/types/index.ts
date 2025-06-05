export interface Category {
    id: string;
    name: string;
    icon?: string;
}

export interface ApiCategory {
    id: number | string;  // match whatever your API actually uses
    name: string;
    icon: string;
}