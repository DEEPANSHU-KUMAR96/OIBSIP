import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { Pizza, ShoppingBag, ShieldCheck, LogOut, User, Boxes } from 'lucide-react';

export default function Navbar() {
    const { user, handleLogout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 bg-[#fff8f5]/90 backdrop-blur-md border-b border-[#e3bebd]/50 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9e0027] to-[#c41e3a] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
                            <Pizza className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                            <span className="font-display font-bold text-xl tracking-tight text-[#9e0027]">
                                Artisanal Hearth
                            </span>
                            <span className="hidden sm:block text-[10px] text-[#5b4040] uppercase tracking-widest font-semibold">
                                Gourmet Pizza Builder
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="flex items-center gap-2 sm:gap-4">
                        <Link
                            to="/"
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                                isActive('/')
                                    ? 'bg-[#9e0027] text-white shadow-sm'
                                    : 'text-[#5b4040] hover:bg-[#e9e1dc]/60 hover:text-[#1e1b18]'
                            }`}
                        >
                            <Pizza className="w-4 h-4" />
                            <span>Build Pizza</span>
                        </Link>

                        <Link
                            to="/my-orders"
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                                isActive('/my-orders')
                                    ? 'bg-[#9e0027] text-white shadow-sm'
                                    : 'text-[#5b4040] hover:bg-[#e9e1dc]/60 hover:text-[#1e1b18]'
                            }`}
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span>My Orders</span>
                        </Link>

                        {user?.role === 'admin' && (
                            <>
                                <Link
                                    to="/admin/orders"
                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                                        isActive('/admin/orders')
                                            ? 'bg-[#9e0027] text-white shadow-sm'
                                            : 'text-[#5b4040] hover:bg-[#e9e1dc]/60 hover:text-[#1e1b18]'
                                    }`}
                                >
                                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                                    <span>Orders Queue</span>
                                </Link>
                                <Link
                                    to="/admin/inventory"
                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                                        isActive('/admin/inventory')
                                            ? 'bg-[#9e0027] text-white shadow-sm'
                                            : 'text-[#5b4040] hover:bg-[#e9e1dc]/60 hover:text-[#1e1b18]'
                                    }`}
                                >
                                    <Boxes className="w-4 h-4 text-amber-500" />
                                    <span>Pantry Inventory</span>
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* User profile & Logout */}
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-semibold text-[#1e1b18] flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-[#9e0027]" />
                                {user?.name || 'Guest'}
                            </span>
                            <span className="text-[11px] text-[#5b4040] font-mono capitalize">
                                {user?.role || 'Customer'}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            title="Sign Out"
                            className="p-2 rounded-xl text-[#5b4040] hover:text-[#9e0027] hover:bg-[#ffdad6]/50 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
