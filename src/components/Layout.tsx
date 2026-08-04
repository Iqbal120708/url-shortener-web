import { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { setAccessTokenRef } from '../api/client';
import { logout } from '../api/auth';

export default function Layout() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setAccessTokenRef(null);
        setMenuOpen(false);
        navigate('/login');
    
        logout().catch(() => {
            setTimeout(() => logout().catch(() => {}), 3000);
        });
    };

    return (
        <div className="min-h-screen bg-white">
            <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
                <span className="font-semibold text-black">ShortLink</span>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen((o) => !o)}
                        className="p-2 rounded hover:bg-neutral-100"
                        aria-label="Menu"
                    >
                        <Menu size={20} className="text-black" />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-neutral-200 rounded-md shadow-sm z-10">
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm text-black hover:bg-neutral-50 w-full text-left"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}