import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useOrder } from '../hooks/useOrder';
import {
    ShoppingBag,
    Clock,
    CheckCircle2,
    Utensils,
    Truck,
    RefreshCw,
    Pizza,
    ChevronRight
} from 'lucide-react';

export default function MyOrders() {
    const {
        myOrders,
        loading,
        error,
        handleGetMyOrders,
        clearOrderError
    } = useOrder();

    useEffect(() => {
        handleGetMyOrders();
    }, [handleGetMyOrders]);

    const getStatusStepIndex = (status = '') => {
        switch (status) {
            case 'Order Received':
                return 1;
            case 'In Kitchen':
                return 2;
            case 'Sent to Delivery':
                return 3;
            default:
                return 1;
        }
    };

    return (
        <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18] flex flex-col font-body">
            <Navbar />

            <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header title */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e3bebd]/40 pb-6 mb-8">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad6] text-[#9e0027] text-xs font-semibold uppercase tracking-wider mb-2">
                            <ShoppingBag className="w-3.5 h-3.5" /> Track Orders
                        </span>
                        <h1 className="font-display text-3xl font-bold text-[#1e1b18]">
                            My Pizza Orders
                        </h1>
                        <p className="text-xs text-[#5b4040] mt-1">
                            Real-time order progress tracking from our oven to your doorstep.
                        </p>
                    </div>

                    <button
                        onClick={handleGetMyOrders}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#5b4040] bg-[#e9e1dc]/60 hover:bg-[#e9e1dc] rounded-xl transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Live Status
                    </button>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 p-4 rounded-2xl bg-[#ffdad6] text-[#93000a] text-xs font-semibold flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={clearOrderError} className="underline">Dismiss</button>
                    </div>
                )}

                {/* Loading state */}
                {loading && !myOrders.length ? (
                    <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-full border-4 border-[#9e0027] border-t-transparent animate-spin" />
                        <p className="text-xs text-[#5b4040]">Loading your order history...</p>
                    </div>
                ) : !myOrders || myOrders.length === 0 ? (
                    /* Empty State */
                    <div className="bg-white rounded-3xl p-12 text-center border border-[#e3bebd]/60 max-w-md mx-auto my-12 space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-[#ffdad6]/40 text-[#9e0027] mx-auto flex items-center justify-center">
                            <Pizza className="w-8 h-8" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-[#1e1b18]">No Orders Yet</h3>
                        <p className="text-xs text-[#5b4040]">
                            You haven't ordered any artisanal pizzas yet. Start customizing your first pizza now!
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#9e0027] text-white text-xs font-bold shadow-md hover:bg-[#c41e3a] transition-all"
                        >
                            Build Your Pizza <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    /* Orders list */
                    <div className="space-y-6">
                        {myOrders.map((order) => {
                            const stepIndex = getStatusStepIndex(order.orderStatus);
                            const formattedDate = order.createdAt
                                ? new Date(order.createdAt).toLocaleString('en-US', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                })
                                : 'Recent';

                            return (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-3xl border border-[#e3bebd]/60 p-6 shadow-xs space-y-6 hover:shadow-md transition-shadow"
                                >
                                    {/* Order header bar */}
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#e3bebd]/30 pb-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono font-bold text-sm text-[#1e1b18]">
                                                    Order #{order._id.slice(-6).toUpperCase()}
                                                </span>
                                                <span className="text-[11px] font-semibold text-[#5b4040] flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-[#9e0027]" /> {formattedDate}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="font-display font-bold text-xl text-[#9e0027]">
                                                ₹{order.totalPrice}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Status Stepper */}
                                    <div className="bg-[#fff8f5] p-5 rounded-2xl border border-[#e3bebd]/40">
                                        <div className="flex justify-between items-center relative">
                                            {/* Progress connecting bar */}
                                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#e9e1dc] -translate-y-1/2 z-0" />
                                            <div
                                                className="absolute top-1/2 left-0 h-1 bg-[#9e0027] -translate-y-1/2 z-0 transition-all duration-500"
                                                style={{
                                                    width: stepIndex === 1 ? '0%' : stepIndex === 2 ? '50%' : '100%'
                                                }}
                                            />

                                            {/* Step 1: Order Received */}
                                            <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#fff8f5] px-2">
                                                <div
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-xs transition-all ${stepIndex >= 1
                                                            ? 'bg-[#9e0027] text-white ring-4 ring-[#ffdad6]'
                                                            : 'bg-[#e9e1dc] text-[#5b4040]'
                                                        }`}
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <span className="text-[11px] font-semibold text-[#1e1b18]">
                                                    Order Received
                                                </span>
                                            </div>

                                            {/* Step 2: In Kitchen */}
                                            <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#fff8f5] px-2">
                                                <div
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-xs transition-all ${stepIndex >= 2
                                                            ? 'bg-[#9e0027] text-white ring-4 ring-[#ffdad6]'
                                                            : 'bg-[#e9e1dc] text-[#5b4040]'
                                                        }`}
                                                >
                                                    <Utensils className="w-4 h-4" />
                                                </div>
                                                <span className="text-[11px] font-semibold text-[#1e1b18]">
                                                    In Kitchen
                                                </span>
                                            </div>

                                            {/* Step 3: Sent to Delivery */}
                                            <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#fff8f5] px-2">
                                                <div
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-xs transition-all ${stepIndex >= 3
                                                            ? 'bg-[#9e0027] text-white ring-4 ring-[#ffdad6]'
                                                            : 'bg-[#e9e1dc] text-[#5b4040]'
                                                        }`}
                                                >
                                                    <Truck className="w-4 h-4" />
                                                </div>
                                                <span className="text-[11px] font-semibold text-[#1e1b18]">
                                                    Sent to Delivery
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items composition */}
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold text-[#5b4040] uppercase tracking-wider">
                                            Pizza Customization Specs
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                            <div className="bg-[#fff8f5] p-3 rounded-xl border border-[#e3bebd]/30">
                                                <span className="text-[10px] text-[#5b4040] block font-medium">Base Crust</span>
                                                <span className="font-semibold text-[#1e1b18]">
                                                    {order.base?.name || 'Standard'}
                                                </span>
                                            </div>
                                            <div className="bg-[#fff8f5] p-3 rounded-xl border border-[#e3bebd]/30">
                                                <span className="text-[10px] text-[#5b4040] block font-medium">Sauce</span>
                                                <span className="font-semibold text-[#1e1b18]">
                                                    {order.sauce?.name || 'Classic'}
                                                </span>
                                            </div>
                                            <div className="bg-[#fff8f5] p-3 rounded-xl border border-[#e3bebd]/30">
                                                <span className="text-[10px] text-[#5b4040] block font-medium">Cheese</span>
                                                <span className="font-semibold text-[#1e1b18]">
                                                    {order.cheese?.name || 'Mozzarella'}
                                                </span>
                                            </div>
                                            <div className="bg-[#fff8f5] p-3 rounded-xl border border-[#e3bebd]/30">
                                                <span className="text-[10px] text-[#5b4040] block font-medium">Veggies ({order.veggies?.length || 0})</span>
                                                <span className="font-semibold text-[#1e1b18] truncate block">
                                                    {order.veggies && order.veggies.length > 0
                                                        ? order.veggies.map((v) => v.name).join(', ')
                                                        : 'None'}
                                                </span>
                                            </div>
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
