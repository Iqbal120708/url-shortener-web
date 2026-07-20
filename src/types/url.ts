interface ShortUrlRequest {
    originalUrl: string
}

interface ShortUrl {
    id: number,
    originalUrl: string,
    shortCode: string,
    is_active: bool
}