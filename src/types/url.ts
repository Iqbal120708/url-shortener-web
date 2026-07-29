interface ShortUrlRequest {
    originalUrl: string
}

interface ShortUrl {
    id: number,
    original_url: string,
    short_code: string,
    is_active: bool
}

interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}