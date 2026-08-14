import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useOrder } from '../hooks/useOrder';
import {
    Pizza,
    Check,
    AlertCircle,
    ShoppingBag,
    Sparkles,
    CheckCircle2,
    RefreshCw,
    Info,
    ArrowRight
} from 'lucide-react';

export default function PizzaBuilder() {
    const navigate = useNavigate();
    const {
        inventory,
        inventoryLoading,
        customization,
        selectedBaseObj,
        selectedSauceObj,
        selectedCheeseObj,
        selectedVeggieObjs,
        totalPrice,
        isCustomizationValid,
        placingOrder,
        error,
        success,
        loadInventory,
        handleSelectBase,
        handleSelectSauce,
        handleSelectCheese,
        handleToggleVeggie,
        handlePlaceOrder,
        clearOrderError,
        clearOrderSuccess
    } = useOrder();

    const [activeTab, setActiveTab] = useState('base');
    const [orderConfirmed, setOrderConfirmed] = useState(null);

    useEffect(() => {
        loadInventory();
    }, [loadInventory]);

    const handleSubmitOrder = async () => {
        try {
            const order = await handlePlaceOrder();
            if (order) {
                setOrderConfirmed(order);
            }
        } catch (err) {
            // error handled in hook state
        }
    };

    const getSauceColor = (sauceName = '') => {
        const lower = sauceName.toLowerCase();
        if (lower.includes('barbecue') || lower.includes('bbq')) return 'bg-amber-800/80';
        if (lower.includes('garlic') || lower.includes('cream')) return 'bg-amber-100/90';
        if (lower.includes('pesto')) return 'bg-emerald-700/80';
        return 'bg-red-600/85'; // default tomato
    };

    return (
        <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18] flex flex-col font-body">
            <Navbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header title banner */}
                <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#e3bebd]/40 pb-6">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad6] text-[#9e0027] text-xs font-semibold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" /> Craft Your Masterpiece
                        </span>
                        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1e1b18] tracking-tight">
                            Custom Artisanal Pizza Builder
                        </h1>
                        <p className="text-[#5b4040] text-sm mt-1">
                            Choose your preferred crust, gourmet sauce, cheese & farm-fresh veggies in real-time.
                        </p>
                    </div>

                    <button
                        onClick={loadInventory}
                        disabled={inventoryLoading}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#5b4040] bg-[#e9e1dc]/60 hover:bg-[#e9e1dc] rounded-xl transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${inventoryLoading ? 'animate-spin' : ''}`} />
                        Refresh Ingredients
                    </button>
                </div>

                {/* Toast alerts */}
                {error && (
                    <div className="mb-6 p-4 rounded-2xl bg-[#ffdad6] border border-[#93000a]/20 text-[#93000a] flex items-center justify-between shadow-xs animate-fade-in">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                        <button onClick={clearOrderError} className="text-xs font-bold underline ml-4">
                            Dismiss
                        </button>
                    </div>
                )}

                {inventoryLoading && !inventory.base?.length ? (
                    <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full border-4 border-[#9e0027] border-t-transparent animate-spin" />
                        <p className="text-sm text-[#5b4040] font-medium">Fetching fresh ingredients from pantry...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* LEFT COLUMN: Customization Tabs & Options (7 cols) */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Step Navigation Tabs */}
                            <div className="flex bg-[#e9e1dc]/60 p-1.5 rounded-2xl gap-1 overflow-x-auto">
                                {[
                                    { id: 'base', label: '1. Crust Base', count: selectedBaseObj ? 1 : 0 },
                                    { id: 'sauce', label: '2. Sauce', count: selectedSauceObj ? 1 : 0 },
                                    { id: 'cheese', label: '3. Cheese', count: selectedCheeseObj ? 1 : 0 },
                                    { id: 'veggie', label: '4. Veggies', count: selectedVeggieObjs.length }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === tab.id
                                                ? 'bg-white text-[#9e0027] shadow-sm'
                                                : 'text-[#5b4040] hover:text-[#1e1b18]'
                                            }`}
                                    >
                                        <span>{tab.label}</span>
                                        {tab.count > 0 && (
                                            <span className="w-4 h-4 rounded-full bg-[#9e0027] text-white text-[10px] flex items-center justify-center font-bold">
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* TAB 1: BASE selection */}
                            {activeTab === 'base' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-[#1e1b18]">Select Pizza Base</h2>
                                        <span className="text-xs text-[#5b4040]">Required (Choose 1)</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {inventory.base.map((item) => {
                                            const isSelected = customization.base === item._id;
                                            const isOutOfStock = item.stock <= 0;
                                            return (
                                                <button
                                                    key={item._id}
                                                    type="button"
                                                    disabled={isOutOfStock}
                                                    onClick={() => handleSelectBase(item._id)}
                                                    className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between h-32 relative overflow-hidden ${isSelected
                                                            ? 'border-[#9e0027] bg-[#ffdad6]/20 ring-2 ring-[#9e0027]'
                                                            : isOutOfStock
                                                                ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                                                                : 'border-[#e3bebd]/60 bg-white hover:border-[#9e0027]/50 hover:shadow-xs'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold text-base text-[#1e1b18]">
                                                                {item.name}
                                                            </h3>
                                                            <span className="text-xs text-[#5b4040]">
                                                                Stock: {item.stock} left
                                                            </span>
                                                        </div>
                                                        {isSelected && (
                                                            <span className="w-6 h-6 rounded-full bg-[#9e0027] text-white flex items-center justify-center shadow-xs">
                                                                <Check className="w-4 h-4" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex justify-between items-center mt-auto">
                                                        <span className="text-sm font-bold text-[#9e0027]">
                                                            ₹{item.price}
                                                        </span>
                                                        {isOutOfStock && (
                                                            <span className="text-[10px] font-bold text-red-600 uppercase bg-red-100 px-2 py-0.5 rounded-md">
                                                                Out of Stock
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <button
                                            onClick={() => setActiveTab('sauce')}
                                            className="px-5 py-2.5 rounded-xl bg-[#9e0027] text-white text-xs font-semibold flex items-center gap-2 hover:bg-[#c41e3a] transition-all"
                                        >
                                            Next: Choose Sauce <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: SAUCE selection */}
                            {activeTab === 'sauce' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-[#1e1b18]">Select Artisanal Sauce</h2>
                                        <span className="text-xs text-[#5b4040]">Required (Choose 1)</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {inventory.sauce.map((item) => {
                                            const isSelected = customization.sauce === item._id;
                                            const isOutOfStock = item.stock <= 0;
                                            return (
                                                <button
                                                    key={item._id}
                                                    type="button"
                                                    disabled={isOutOfStock}
                                                    onClick={() => handleSelectSauce(item._id)}
                                                    className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between h-32 relative overflow-hidden ${isSelected
                                                            ? 'border-[#9e0027] bg-[#ffdad6]/20 ring-2 ring-[#9e0027]'
                                                            : isOutOfStock
                                                                ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                                                                : 'border-[#e3bebd]/60 bg-white hover:border-[#9e0027]/50 hover:shadow-xs'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold text-base text-[#1e1b18]">
                                                                {item.name}
                                                            </h3>
                                                            <span className="text-xs text-[#5b4040]">
                                                                Stock: {item.stock} left
                                                            </span>
                                                        </div>
                                                        {isSelected && (
                                                            <span className="w-6 h-6 rounded-full bg-[#9e0027] text-white flex items-center justify-center shadow-xs">
                                                                <Check className="w-4 h-4" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex justify-between items-center mt-auto">
                                                        <span className="text-sm font-bold text-[#9e0027]">
                                                            ₹{item.price}
                                                        </span>
                                                        {isOutOfStock && (
                                                            <span className="text-[10px] font-bold text-red-600 uppercase bg-red-100 px-2 py-0.5 rounded-md">
                                                                Out of Stock
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <button
                                            onClick={() => setActiveTab('base')}
                                            className="px-4 py-2 rounded-xl text-xs font-medium text-[#5b4040] hover:bg-[#e9e1dc]"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('cheese')}
                                            className="px-5 py-2.5 rounded-xl bg-[#9e0027] text-white text-xs font-semibold flex items-center gap-2 hover:bg-[#c41e3a] transition-all"
                                        >
                                            Next: Choose Cheese <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: CHEESE selection */}
                            {activeTab === 'cheese' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-[#1e1b18]">Select Gourmet Cheese</h2>
                                        <span className="text-xs text-[#5b4040]">Required (Choose 1)</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {inventory.cheese.map((item) => {
                                            const isSelected = customization.cheese === item._id;
                                            const isOutOfStock = item.stock <= 0;
                                            return (
                                                <button
                                                    key={item._id}
                                                    type="button"
                                                    disabled={isOutOfStock}
                                                    onClick={() => handleSelectCheese(item._id)}
                                                    className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between h-32 relative overflow-hidden ${isSelected
                                                            ? 'border-[#9e0027] bg-[#ffdad6]/20 ring-2 ring-[#9e0027]'
                                                            : isOutOfStock
                                                                ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                                                                : 'border-[#e3bebd]/60 bg-white hover:border-[#9e0027]/50 hover:shadow-xs'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold text-base text-[#1e1b18]">
                                                                {item.name}
                                                            </h3>
                                                            <span className="text-xs text-[#5b4040]">
                                                                Stock: {item.stock} left
                                                            </span>
                                                        </div>
                                                        {isSelected && (
                                                            <span className="w-6 h-6 rounded-full bg-[#9e0027] text-white flex items-center justify-center shadow-xs">
                                                                <Check className="w-4 h-4" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex justify-between items-center mt-auto">
                                                        <span className="text-sm font-bold text-[#9e0027]">
                                                            ₹{item.price}
                                                        </span>
                                                        {isOutOfStock && (
                                                            <span className="text-[10px] font-bold text-red-600 uppercase bg-red-100 px-2 py-0.5 rounded-md">
                                                                Out of Stock
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <button
                                            onClick={() => setActiveTab('sauce')}
                                            className="px-4 py-2 rounded-xl text-xs font-medium text-[#5b4040] hover:bg-[#e9e1dc]"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('veggie')}
                                            className="px-5 py-2.5 rounded-xl bg-[#9e0027] text-white text-xs font-semibold flex items-center gap-2 hover:bg-[#c41e3a] transition-all"
                                        >
                                            Next: Add Veggies <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: VEGGIE selection */}
                            {activeTab === 'veggie' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-[#1e1b18]">Select Fresh Veggies</h2>
                                        <span className="text-xs text-[#5b4040]">Optional (Select multiple)</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {inventory.veggie.map((item) => {
                                            const isSelected = customization.veggies.includes(item._id);
                                            const isOutOfStock = item.stock <= 0;
                                            return (
                                                <button
                                                    key={item._id}
                                                    type="button"
                                                    disabled={isOutOfStock}
                                                    onClick={() => handleToggleVeggie(item._id)}
                                                    className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between h-28 relative overflow-hidden ${isSelected
                                                            ? 'border-[#9e0027] bg-[#ffdad6]/20 ring-2 ring-[#9e0027]'
                                                            : isOutOfStock
                                                                ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                                                                : 'border-[#e3bebd]/60 bg-white hover:border-[#9e0027]/50 hover:shadow-xs'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold text-base text-[#1e1b18]">
                                                                {item.name}
                                                            </h3>
                                                            <span className="text-xs text-[#5b4040]">
                                                                Stock: {item.stock} left
                                                            </span>
                                                        </div>
                                                        <div
                                                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${isSelected
                                                                    ? 'bg-[#9e0027] border-[#9e0027] text-white'
                                                                    : 'border-gray-300 bg-white'
                                                                }`}
                                                        >
                                                            {isSelected && <Check className="w-3.5 h-3.5" />}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-auto">
                                                        <span className="text-sm font-bold text-[#9e0027]">
                                                            +₹{item.price}
                                                        </span>
                                                        {isOutOfStock && (
                                                            <span className="text-[10px] font-bold text-red-600 uppercase bg-red-100 px-2 py-0.5 rounded-md">
                                                                Out of Stock
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <button
                                            onClick={() => setActiveTab('cheese')}
                                            className="px-4 py-2 rounded-xl text-xs font-medium text-[#5b4040] hover:bg-[#e9e1dc]"
                                        >
                                            Back
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Interactive Pizza Preview & Order Summary (5 cols) */}
                        <div className="lg:col-span-5 space-y-6 sticky top-24">
                            {/* Live Interactive Pizza Canvas Preview */}
                            <div className="glass-card p-6 rounded-3xl shadow-sm border border-[#e3bebd]/60 flex flex-col items-center">
                                <h3 className="text-sm font-bold text-[#5b4040] uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Pizza className="w-4 h-4 text-[#9e0027]" /> Live Pizza Preview
                                </h3>

                                <div className="relative w-56 h-56 rounded-full bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 shadow-xl p-3 flex items-center justify-center overflow-hidden transition-all transform hover:scale-105 duration-300">
                                    {/* Crust Rim */}
                                    <div className="w-full h-full rounded-full border-4 border-amber-800/40 p-2 flex items-center justify-center">
                                        {/* Sauce Layer */}
                                        <div
                                            className={`w-full h-full rounded-full transition-colors duration-500 flex items-center justify-center p-2 shadow-inner ${getSauceColor(
                                                selectedSauceObj?.name
                                            )}`}
                                        >
                                            {/* Cheese Layer */}
                                            <div className="w-full h-full rounded-full bg-amber-200/90 shadow-xs flex items-center justify-center relative p-3 backdrop-blur-[1px]">
                                                {/* Melted cheese spots */}
                                                <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-amber-300/80" />
                                                <div className="absolute bottom-6 right-8 w-4 h-4 rounded-full bg-amber-300/80" />
                                                <div className="absolute top-10 right-6 w-3 h-3 rounded-full bg-amber-300/80" />

                                                {/* Veggie Toppings Overlay */}
                                                <div className="absolute inset-0 p-4 flex flex-wrap items-center justify-center gap-3">
                                                    {selectedVeggieObjs.map((v, i) => (
                                                        <span
                                                            key={v._id || i}
                                                            className="w-4 h-4 rounded-full bg-emerald-600 border border-emerald-400 shadow-xs animate-bounce"
                                                            style={{ animationDelay: `${i * 150}ms` }}
                                                            title={v.name}
                                                        />
                                                    ))}
                                                </div>

                                                <span className="text-center font-display font-bold text-[#9e0027] text-xs opacity-40">
                                                    Artisanal
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 text-center">
                                    <p className="text-sm font-semibold text-[#1e1b18]">
                                        {selectedBaseObj?.name || 'Select Base'}
                                    </p>
                                    <p className="text-xs text-[#5b4040]">
                                        {selectedSauceObj?.name || 'No Sauce'} • {selectedCheeseObj?.name || 'No Cheese'}
                                    </p>
                                </div>
                            </div>

                            {/* Order Summary Card */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#e3bebd]/60 space-y-4">
                                <h3 className="text-base font-bold text-[#1e1b18] border-b border-[#e3bebd]/40 pb-3 flex items-center gap-2">
                                    <ShoppingBag className="w-4 h-4 text-[#9e0027]" /> Order Summary
                                </h3>

                                <div className="space-y-2 text-xs text-[#5b4040]">
                                    <div className="flex justify-between items-center">
                                        <span>Base: {selectedBaseObj?.name || 'None'}</span>
                                        <span className="font-semibold text-[#1e1b18]">
                                            ₹{selectedBaseObj?.price || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Sauce: {selectedSauceObj?.name || 'None'}</span>
                                        <span className="font-semibold text-[#1e1b18]">
                                            ₹{selectedSauceObj?.price || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Cheese: {selectedCheeseObj?.name || 'None'}</span>
                                        <span className="font-semibold text-[#1e1b18]">
                                            ₹{selectedCheeseObj?.price || 0}
                                        </span>
                                    </div>

                                    {selectedVeggieObjs.length > 0 && (
                                        <div className="pt-2 border-t border-dashed border-[#e3bebd]/60 space-y-1">
                                            <span className="font-semibold text-[#1e1b18]">Selected Veggies:</span>
                                            {selectedVeggieObjs.map((v) => (
                                                <div key={v._id} className="flex justify-between items-center pl-2">
                                                    <span>+ {v.name}</span>
                                                    <span>₹{v.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-3 border-t border-[#e3bebd] flex justify-between items-center">
                                    <div>
                                        <span className="text-xs text-[#5b4040] block">Total Amount</span>
                                        <span className="font-display font-bold text-2xl text-[#9e0027]">
                                            ₹{totalPrice}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                        Taxes Included
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    disabled={!isCustomizationValid || placingOrder}
                                    onClick={handleSubmitOrder}
                                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#9e0027] to-[#c41e3a] text-white font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
                                >
                                    {placingOrder ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Placing Your Order...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Confirm & Place Order</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* SUCCESS CONFIRMATION MODAL */}
                {orderConfirmed && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 border border-[#e3bebd] shadow-2xl">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                                <CheckCircle2 className="w-10 h-10 animate-bounce" />
                            </div>

                            <div>
                                <h3 className="font-display text-2xl font-bold text-[#1e1b18]">
                                    Order Placed Successfully!
                                </h3>
                                <p className="text-xs text-[#5b4040] mt-1">
                                    Order ID: <code className="font-mono font-bold bg-[#e9e1dc] px-2 py-0.5 rounded">{orderConfirmed._id}</code>
                                </p>
                            </div>

                            <div className="bg-[#fff8f5] p-4 rounded-2xl border border-[#e3bebd]/50 text-left text-xs space-y-1.5 text-[#5b4040]">
                                <div className="flex justify-between">
                                    <span>Status:</span>
                                    <span className="font-bold text-[#9e0027]">{orderConfirmed.orderStatus || 'Order Received'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Paid:</span>
                                    <span className="font-bold text-[#1e1b18]">₹{orderConfirmed.totalPrice}</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    onClick={() => navigate('/my-orders')}
                                    className="flex-1 py-3 rounded-xl bg-[#9e0027] text-white text-xs font-bold shadow-sm hover:bg-[#c41e3a] transition-all"
                                >
                                    Track Order Progress
                                </button>
                                <button
                                    onClick={() => setOrderConfirmed(null)}
                                    className="px-4 py-3 rounded-xl bg-[#e9e1dc]/60 text-[#5b4040] text-xs font-semibold hover:bg-[#e9e1dc] transition-all"
                                >
                                    Build Another
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
