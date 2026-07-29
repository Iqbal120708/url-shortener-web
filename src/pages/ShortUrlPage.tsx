import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUrlList } from '../api/url';
import type { PaginatedResponse, ShortUrl } from '@/types';

export default function ShortUrlPage() {
    const [data, setData] = useState<PaginatedResponse<ShortUrl>>({
        count: 0,
        next: null,
        previous: null,
        results: [],
    });
    const navigate = useNavigate();

    const fetchUrls = (url?: string) => {
        getUrlList(url)
            .then((res) => setData(res.data))
            .catch((err) => {
                if (err.response?.status === 401) {
                    navigate('/login');
                } else {
                    navigate('/500');
                }
            });
    };

    useEffect(() => {
        fetchUrls();
    }, []);

    return (
        <div>
            <ul>
                {data.results.map((u) => (
                    <li key={u.id}>{u.short_code} → {u.original_url}</li>
                ))}
            </ul>

            <div className="flex justify-between mt-4">
                <button
                    disabled={!data.previous}
                    onClick={() => fetchUrls(data.previous!)}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    disabled={!data.next}
                    onClick={() => fetchUrls(data.next!)}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}