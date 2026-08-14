import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { useOrder } from '../hooks/useOrder';
import {
    ShieldCheck,
    RefreshCw,
    Search,
    Filter,
    Clock,
    User,
    CheckCircle2,
    Utensils,
    Truck,
    AlertCircle
} from 'lucide-react';

export default function AdminOrders() {
    const {
        allOrders,
        loading,
        error,
        success,
        handleGetAllOrders,
        handleUpdateOrderStatus,
        clearOrderError,
        clearOrderSuccess
    } = useOrder();

    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        handleGetAllOrders();
    }, [handleGetAllOrders]);

    const filteredOrders = useMemo(() => {
        return allOrders.filter((order) => {
            const matchesStatus =
                statusFilter === 'ALL' || order.orderStatus === statusFilter;

            const userName = order.user?.name || '';
            const userEmail = order.user?.email || '';
            const orderId = order._id || '';

            const matchesSearch =
                userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                orderId.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesStatus && matchesSearch;
        });
    }, [allOrders, statusFilter, searchQuery]);

    const handleStatusChange = (orderId, newStatus) => {
        handleUpdateOrderStatus(orderId, newStatus);
    };

    return (
        <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18] flex flex-col font-body">
            <Navbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e3bebd]/40 pb-6 mb-8">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Admin Command Center
                        </span>
                        <h1 className="font-display text-3xl font-bold text-[#1e1b18]">
                            Customer Orders Dashboard
                        </h1>
                        <p className="text-xs text-[#5b4040] mt-1">
                            Monitor incoming orders, track kitchen workflows, and update delivery dispatch states.
                        </p>
                    </div>

                    <button
                        onClick={handleGetAllOrders}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#5b4040] bg-[#e9e1dc]/60 hover:bg-[#e9e1dc] rounded-xl transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Live Queue
                    </button>
                </div>

                {/* Toast alerts */}
                {error && (
                    <div className="mb-6 p-4 rounded-2xl bg-[#ffdad6] text-[#93000a] text-xs font-semibold flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                        <button onClick={clearOrderError} className="underline">Dismiss</button>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-900 text-xs font-semibold flex justify-between items-center border border-emerald-200">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{success}</span>
                        </div>
                        <button onClick={clearOrderSuccess} className="underline">Dismiss</button>
                    </div>
                )}

                {/* Filter and Search Bar */}
                <div className="bg-white p-4 rounded-2xl border border-[#e3bebd]/60 shadow-xs mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Status filter tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto">
                        <Filter className="w-4 h-4 text-[#5b4040] mr-2 shrink-0 hidden sm:block" />
                        {[
                            { id: 'ALL', label: 'All Orders' },
                            { id: 'Order Received', label: 'Order Received' },
                            { id: 'In Kitchen', label: 'In Kitchen' },
                            { id: 'Sent to Delivery', label: 'Sent to Delivery' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusFilter(tab.id)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${statusFilter === tab.id
                                        ? 'bg-[#9e0027] text-white shadow-xs'
                                        : 'text-[#5b4040] hover:bg-[#e9e1dc]/60 hover:text-[#1e1b18]'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-72">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5b4040]" />
                        <input
                            type="text"
                            placeholder="Search by customer or order ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-xs bg-[#fff8f5] border border-[#e3bebd]/60 rounded-xl focus:outline-none focus:border-[#9e0027] text-[#1e1b18]"
                        />
                    </div>
                </div>

                {/* Orders List / Table */}
                {loading && !allOrders.length ? (
                    <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-full border-4 border-[#9e0027] border-t-transparent animate-spin" />
                        <p className="text-xs text-[#5b4040]">Loading all customer orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-[#e3bebd]/60 max-w-md mx-auto my-8">
                        <p className="text-sm font-semibold text-[#1e1b18]">No matching orders found</p>
                        <p className="text-xs text-[#5b4040] mt-1">Try resetting your filter or search query.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => {
                            const formattedDate = order.createdAt
                                ? new Date(order.createdAt).toLocaleString('en-US', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                })
                                : 'Recent';

                            return (
                                <div
                                    key={order._id}
                                    className="bg-white p-5 rounded-3xl border border-[#e3bebd]/60 shadow-xs hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
                                >
                                    {/* Column 1: Order & User info (4 cols) */}
                                    <div className="lg:col-span-4 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-sm text-[#1e1b18]">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </span>
                                            <span className="text-[10px] text-[#5b4040] flex items-center gap-1 font-medium">
                                                <Clock className="w-3 h-3 text-[#9e0027]" /> {formattedDate}
                                            </span>
                                        </div>
                                        <div className="text-xs text-[#5b4040] flex items-center gap-1.5 pt-1">
                                            <User className="w-3.5 h-3.5 text-[#9e0027]" />
                                            <span className="font-semibold text-[#1e1b18]">
                                                {order.user?.name || 'Customer'}
                                            </span>
                                            <span className="text-[10px] font-mono text-[#5b4040]">
                                                ({order.user?.email || 'N/A'})
                                            </span>
                                        </div>
                                    </div>

                                    {/* Column 2: Items Spec (5 cols) */}
                                    <div className="lg:col-span-5 text-xs space-y-1">
                                        <div className="flex flex-wrap gap-2 text-[#5b4040]">
                                            <span className="bg-[#fff8f5] px-2.5 py-1 rounded-lg border border-[#e3bebd]/40">
                                                Base: <strong className="text-[#1e1b18]">{order.base?.name || 'N/A'}</strong>
                                            </span>
                                            <span className="bg-[#fff8f5] px-2.5 py-1 rounded-lg border border-[#e3bebd]/40">
                                                Sauce: <strong className="text-[#1e1b18]">{order.sauce?.name || 'N/A'}</strong>
                                            </span>
                                            <span className="bg-[#fff8f5] px-2.5 py-1 rounded-lg border border-[#e3bebd]/40">
                                                Cheese: <strong className="text-[#1e1b18]">{order.cheese?.name || 'N/A'}</strong>
                                            </span>
                                        </div>
                                        {order.veggies && order.veggies.length > 0 && (
                                            <p className="text-[11px] text-[#5b4040] pt-0.5 truncate">
                                                Veggies: {order.veggies.map((v) => v.name).join(', ')}
                                            </p>
                                        )}
                                    </div>

                                    {/* Column 3: Price & Status Control (3 cols) */}
                                    <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-end justify-between gap-2 border-t lg:border-t-0 border-[#e3bebd]/40 pt-3 lg:pt-0">
                                        <span className="font-display font-bold text-lg text-[#9e0027]">
                                            ₹{order.totalPrice}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <select
                                                value={order.orderStatus || 'Order Received'}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className="text-xs font-bold py-1.5 px-3 rounded-xl border border-[#9e0027]/40 bg-[#fff8f5] text-[#9e0027] focus:outline-none focus:ring-2 focus:ring-[#9e0027] cursor-pointer"
                                            >
                                                <option value="Order Received">Order Received</option>
                                                <option value="In Kitchen">In Kitchen</option>
                                                <option value="Sent to Delivery">Sent to Delivery</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
