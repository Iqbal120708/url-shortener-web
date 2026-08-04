import { Check, Copy, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import type { PaginatedResponse, ShortUrl } from '@/types';

import { deleteUrl, getUrlList, postUrl } from '../api/url';

const SHORT_BASE =
    import.meta.env.VITE_SHORT_URL_BASE ?? window.location.origin;

export default function ShortUrlPage() {
    const [items, setItems] = useState<ShortUrl[]>([]);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<number | string | null>(null);
    const [inputUrl, setInputUrl] = useState('');
    const [idempotencyKey, setIdempotencyKey] = useState(() =>
        crypto.randomUUID()
    );
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const fetchUrls = useCallback(
        (url?: string) => {
            if (loading) return;
            setLoading(true);
            getUrlList(url)
                .then((res) => {
                    const data: PaginatedResponse<ShortUrl> = res.data;
                    setItems((prev) =>
                        url ? [...prev, ...data.results] : data.results
                    );
                    setNextUrl(data.next);
                    setCount(data.count);
                })
                .catch(() => {
                    navigate('/500');
                })
                .finally(() => {
                    setLoading(false);
                    setInitialLoading(false);
                });
        },
        [loading, navigate]
    );

    // initial load
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUrls();
    }, []);

    // infinite scroll observer
    useEffect(() => {
        if (!sentinelRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && nextUrl && !loading) {
                    fetchUrls(nextUrl);
                }
            },
            { rootMargin: '200px' }
        );
        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [nextUrl, loading, fetchUrls]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputUrl(e.target.value);
        setIdempotencyKey(crypto.randomUUID());
    };

    const handleCopy = (u: ShortUrl) => {
        navigator.clipboard.writeText(`${SHORT_BASE}/${u.short_code}`);
        setCopiedId(u.id);
        setTimeout(
            () => setCopiedId((cur) => (cur === u.id ? null : cur)),
            1500
        );
    };

    const handleDelete = (u: ShortUrl) => {
        if (!confirm('Do you want delete short URL?')) return;
        deleteUrl(u.id)
            .then(() => setItems((prev) => prev.filter((i) => i.id !== u.id)))
            .catch(() => toast.error('Failed to delete short URL.'));
    };

    const handleShorten = (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);

        postUrl(inputUrl, idempotencyKey)
            .then((res) => {
                setItems((prev) => [res.data, ...prev]);
                setCount((prev) => prev + 1);
                setInputUrl('');
                setIdempotencyKey(crypto.randomUUID());
            })
            .catch(() => {
                toast.error('Failed to create short URL. Enter a valid URL.');
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            {/* Form shorten URL */}
            <form
                onSubmit={handleShorten}
                className="flex flex-col md:flex-row gap-2 mb-6"
            >
                <input
                    type="url"
                    value={inputUrl}
                    onChange={handleInputChange}
                    placeholder="Paste URL here"
                    required
                    className="flex-1 border border-neutral-300 rounded-md px-3 py-2 text-sm"
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-black text-white rounded-md px-4 py-2 text-sm md:w-auto"
                >
                    {submitting ? 'Shortening...' : 'Shorten'}
                </button>
            </form>

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold text-black">My Links</h1>
                <span className="text-sm text-neutral-500">{count} links</span>
            </div>

            {initialLoading && (
                <p className="text-sm text-neutral-500">Loading...</p>
            )}

            {!initialLoading && items.length === 0 && (
                <p className="text-sm text-neutral-500 border border-dashed border-neutral-300 rounded-md py-8 text-center">
                    There is no short URL yet.
                </p>
            )}

            {/* Desktop table */}
            {items.length > 0 && (
                <table className="hidden md:table w-full text-sm border-collapse">
                    <thead>
                        <tr className="text-left text-neutral-500 border-b border-neutral-200">
                            <th className="py-2 font-medium">Original URL</th>
                            <th className="py-2 font-medium">Short Link</th>
                            <th className="py-2 font-medium">Clicks</th>
                            <th className="py-2 font-medium w-24"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((u) => (
                            <tr
                                key={u.id}
                                className="border-b border-neutral-100 group"
                            >
                                <td
                                    className="py-3 pr-4 truncate max-w-xs text-neutral-700"
                                    title={u.original_url}
                                >
                                    {u.original_url}
                                </td>
                                <td className="py-3 pr-4 text-black font-medium">
                                    {SHORT_BASE.replace(/^https?:\/\//, '')}/
                                    {u.short_code}
                                </td>
                                <td className="py-3 pr-4">
                                    <button
                                        onClick={() =>
                                            navigate(`/links/${u.id}/analytics`)
                                        }
                                        className="text-neutral-700 underline underline-offset-2 hover:text-black"
                                    >
                                        Analytics
                                    </button>
                                </td>
                                <td className="py-3 text-right space-x-2">
                                    <button
                                        onClick={() => handleCopy(u)}
                                        className="p-1.5 rounded hover:bg-neutral-100"
                                        aria-label="Copy"
                                    >
                                        {copiedId === u.id ? (
                                            <Check size={16} />
                                        ) : (
                                            <Copy size={16} />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(u)}
                                        className="p-1.5 rounded hover:bg-neutral-100"
                                        aria-label="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
                {items.map((u) => (
                    <div
                        key={u.id}
                        className="border border-neutral-200 rounded-lg p-3"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-black truncate">
                                {SHORT_BASE.replace(/^https?:\/\//, '')}/
                                {u.short_code}
                            </span>
                            <button
                                onClick={() => handleCopy(u)}
                                className="p-2 -mr-2 rounded hover:bg-neutral-100"
                                aria-label="Copy"
                            >
                                {copiedId === u.id ? (
                                    <Check size={18} />
                                ) : (
                                    <Copy size={18} />
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-neutral-500 truncate mt-1">
                            {u.original_url}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                            <button
                                onClick={() =>
                                    navigate(`/links/${u.id}/analytics`)
                                }
                                className="text-xs text-neutral-700 underline underline-offset-2"
                            >
                                Analytics
                            </button>
                            <button
                                onClick={() => handleDelete(u)}
                                className="p-2 -mr-2 rounded hover:bg-neutral-100 text-neutral-500"
                                aria-label="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div
                ref={sentinelRef}
                className="h-8 flex items-center justify-center"
            >
                {loading && !initialLoading && (
                    <span className="text-xs text-neutral-400">
                        Loading more...
                    </span>
                )}
            </div>
        </div>
    );
}
