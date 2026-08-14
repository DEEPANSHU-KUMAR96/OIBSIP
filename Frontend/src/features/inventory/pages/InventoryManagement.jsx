import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../../order/components/Navbar';
import { useInventory } from '../hooks/useInventory';
import {
    Boxes,
    Plus,
    AlertTriangle,
    CheckCircle2,
    RefreshCw,
    Search,
    Filter,
    Trash2,
    Save,
    AlertCircle,
    X,
    TrendingDown,
    IndianRupee,
    Layers
} from 'lucide-react';

export default function InventoryManagement() {
    const {
        items,
        loading,
        error,
        success,
        loadAdminInventory,
        handleAddItem,
        handleUpdateStock,
        handleDeleteItem,
        clearInventoryError,
        clearInventorySuccess
    } = useInventory();

    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [stockFilter, setStockFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingStocks, setEditingStocks] = useState({});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [submittingAdd, setSubmittingAdd] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        category: 'base',
        stock: '',
        price: '',
        lowStockThreshold: 20
    });

    useEffect(() => {
        loadAdminInventory();
    }, [loadAdminInventory]);

    const stats = useMemo(() => {
        const totalItems = items.length;
        const lowStockCount = items.filter(
            (i) => i.stock > 0 && i.stock <= (i.lowStockThreshold || 20)
        ).length;
        const outOfStockCount = items.filter((i) => i.stock === 0).length;
        const totalValuation = items.reduce(
            (acc, curr) => acc + (curr.price || 0) * (curr.stock || 0),
            0
        );

        return { totalItems, lowStockCount, outOfStockCount, totalValuation };
    }, [items]);

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesCategory =
                categoryFilter === 'ALL' || item.category === categoryFilter;

            let matchesStock = true;
            if (stockFilter === 'OUT_OF_STOCK') {
                matchesStock = item.stock === 0;
            } else if (stockFilter === 'LOW_STOCK') {
                matchesStock = item.stock > 0 && item.stock <= (item.lowStockThreshold || 20);
            } else if (stockFilter === 'IN_STOCK') {
                matchesStock = item.stock > (item.lowStockThreshold || 20);
            }

            const matchesSearch = item.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            return matchesCategory && matchesStock && matchesSearch;
        });
    }, [items, categoryFilter, stockFilter, searchQuery]);

    const handleStockInputChange = (id, value) => {
        setEditingStocks((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSaveStock = async (id) => {
        const newStock = editingStocks[id];
        if (newStock === undefined || newStock === '' || isNaN(newStock)) return;
        await handleUpdateStock(id, Number(newStock));
        setEditingStocks((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    };

    const handleStockStep = (id, currentStock, delta) => {
        const effectiveStock =
            editingStocks[id] !== undefined ? Number(editingStocks[id]) : currentStock;
        const nextStock = Math.max(0, effectiveStock + delta);
        handleStockInputChange(id, nextStock);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || formData.stock === '' || formData.price === '') {
            return;
        }

        setSubmittingAdd(true);
        try {
            await handleAddItem({
                name: formData.name.trim(),
                category: formData.category,
                stock: Number(formData.stock),
                price: Number(formData.price),
                lowStockThreshold: Number(formData.lowStockThreshold || 20)
            });
            setIsAddModalOpen(false);
            setFormData({
                name: '',
                category: 'base',
                stock: '',
                price: '',
                lowStockThreshold: 20
            });
        } catch (err) {
            // error captured by hook
        } finally {
            setSubmittingAdd(false);
        }
    };

    const getCategoryBadgeClass = (category) => {
        switch (category) {
            case 'base':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'sauce':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'cheese':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'veggie':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18] flex flex-col font-body">
            <Navbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e3bebd]/40 pb-6 mb-8">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2">
                            <Boxes className="w-3.5 h-3.5 text-amber-600" /> Stock Control
                        </span>
                        <h1 className="font-display text-3xl font-bold text-[#1e1b18]">
                            Pantry & Inventory Management
                        </h1>
                        <p className="text-xs text-[#5b4040] mt-1">
                            Monitor stock levels in real time, configure replenishment alerts, and manage ingredient catalogue.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={loadAdminInventory}
                            disabled={loading}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-[#5b4040] bg-[#e9e1dc]/60 hover:bg-[#e9e1dc] rounded-xl transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                            Sync
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#9e0027] hover:bg-[#c41e3a] rounded-xl shadow-xs transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Add Ingredient
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                {error && (
                    <div className="mb-6 p-4 rounded-2xl bg-[#ffdad6] text-[#93000a] text-xs font-semibold flex justify-between items-center animate-fade-in">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                        <button onClick={clearInventoryError} className="underline font-bold">Dismiss</button>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-900 text-xs font-semibold flex justify-between items-center border border-emerald-200 animate-fade-in">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{success}</span>
                        </div>
                        <button onClick={clearInventorySuccess} className="underline font-bold">Dismiss</button>
                    </div>
                )}

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-3xl border border-[#e3bebd]/60 shadow-xs">
                        <div className="flex items-center justify-between text-[#5b4040]">
                            <span className="text-xs font-semibold uppercase tracking-wider">Total Items</span>
                            <Layers className="w-4 h-4 text-[#9e0027]" />
                        </div>
                        <div className="mt-2 text-2xl font-bold font-display text-[#1e1b18]">
                            {stats.totalItems}
                        </div>
                        <span className="text-[11px] text-[#5b4040]">Active in pizza builder</span>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-[#e3bebd]/60 shadow-xs">
                        <div className="flex items-center justify-between text-amber-800">
                            <span className="text-xs font-semibold uppercase tracking-wider">Low Stock Alerts</span>
                            <TrendingDown className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="mt-2 text-2xl font-bold font-display text-amber-700">
                            {stats.lowStockCount}
                        </div>
                        <span className="text-[11px] text-[#5b4040]">Below threshold limits</span>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-[#e3bebd]/60 shadow-xs">
                        <div className="flex items-center justify-between text-red-800">
                            <span className="text-xs font-semibold uppercase tracking-wider">Out of Stock</span>
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="mt-2 text-2xl font-bold font-display text-red-600">
                            {stats.outOfStockCount}
                        </div>
                        <span className="text-[11px] text-[#5b4040]">Requires immediate restock</span>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-[#e3bebd]/60 shadow-xs">
                        <div className="flex items-center justify-between text-emerald-800">
                            <span className="text-xs font-semibold uppercase tracking-wider">Stock Valuation</span>
                            <IndianRupee className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="mt-2 text-2xl font-bold font-display text-emerald-700">
                            ₹{stats.totalValuation}
                        </div>
                        <span className="text-[11px] text-[#5b4040]">Inventory market worth</span>
                    </div>
                </div>

                {/* Filters and Controls */}
                <div className="bg-white p-4 rounded-3xl border border-[#e3bebd]/60 shadow-xs mb-6 space-y-3">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Category filter pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
                            <Filter className="w-4 h-4 text-[#5b4040] mr-1 hidden sm:block shrink-0" />
                            {[
                                { id: 'ALL', label: 'All' },
                                { id: 'base', label: 'Crust Bases' },
                                { id: 'sauce', label: 'Sauces' },
                                { id: 'cheese', label: 'Cheeses' },
                                { id: 'veggie', label: 'Veggies' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setCategoryFilter(tab.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${categoryFilter === tab.id
                                            ? 'bg-[#9e0027] text-white shadow-xs'
                                            : 'text-[#5b4040] hover:bg-[#e9e1dc]/60 hover:text-[#1e1b18]'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search and stock status filter */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <select
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value)}
                                className="px-3 py-2 text-xs bg-[#fff8f5] border border-[#e3bebd]/60 rounded-xl text-[#1e1b18] focus:outline-none focus:border-[#9e0027]"
                            >
                                <option value="ALL">All Stock Levels</option>
                                <option value="IN_STOCK">In Stock (Healthy)</option>
                                <option value="LOW_STOCK">Low Stock (Alert)</option>
                                <option value="OUT_OF_STOCK">Out of Stock</option>
                            </select>

                            <div className="relative flex-1 sm:w-64">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5b4040]" />
                                <input
                                    type="text"
                                    placeholder="Search ingredient..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 text-xs bg-[#fff8f5] border border-[#e3bebd]/60 rounded-xl focus:outline-none focus:border-[#9e0027] text-[#1e1b18]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory Table */}
                {loading && !items.length ? (
                    <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-full border-4 border-[#9e0027] border-t-transparent animate-spin" />
                        <p className="text-xs text-[#5b4040]">Loading pantry inventory...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-[#e3bebd]/60 max-w-md mx-auto my-8">
                        <p className="text-sm font-semibold text-[#1e1b18]">No ingredients found</p>
                        <p className="text-xs text-[#5b4040] mt-1">Try changing filters or add a new item.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-[#e3bebd]/60 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="bg-[#fff8f5] border-b border-[#e3bebd]/50 text-[#5b4040] font-semibold uppercase tracking-wider">
                                        <th className="py-3.5 px-5">Ingredient</th>
                                        <th className="py-3.5 px-4">Category</th>
                                        <th className="py-3.5 px-4">Price</th>
                                        <th className="py-3.5 px-4">Stock & Restock</th>
                                        <th className="py-3.5 px-4">Threshold</th>
                                        <th className="py-3.5 px-4">Status</th>
                                        <th className="py-3.5 px-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e3bebd]/30">
                                    {filteredItems.map((item) => {
                                        const currentVal =
                                            editingStocks[item._id] !== undefined
                                                ? editingStocks[item._id]
                                                : item.stock;
                                        const isModified =
                                            editingStocks[item._id] !== undefined &&
                                            editingStocks[item._id] !== item.stock;

                                        const isLow = item.stock > 0 && item.stock <= (item.lowStockThreshold || 20);
                                        const isOut = item.stock === 0;

                                        return (
                                            <tr key={item._id} className="hover:bg-[#fff8f5]/60 transition-colors">
                                                {/* Ingredient name */}
                                                <td className="py-4 px-5">
                                                    <span className="font-bold text-sm text-[#1e1b18] block">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-[#5b4040]">
                                                        ID: {item._id.slice(-6).toUpperCase()}
                                                    </span>
                                                </td>

                                                {/* Category */}
                                                <td className="py-4 px-4">
                                                    <span
                                                        className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getCategoryBadgeClass(
                                                            item.category
                                                        )}`}
                                                    >
                                                        {item.category}
                                                    </span>
                                                </td>

                                                {/* Price */}
                                                <td className="py-4 px-4 font-display font-bold text-sm text-[#9e0027]">
                                                    ₹{item.price}
                                                </td>

                                                {/* Stock Editor */}
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleStockStep(item._id, item.stock, -5)}
                                                            className="w-6 h-6 rounded-lg bg-[#e9e1dc]/80 hover:bg-[#e9e1dc] text-[#5b4040] font-bold flex items-center justify-center text-xs"
                                                            title="Subtract 5"
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={currentVal}
                                                            onChange={(e) =>
                                                                handleStockInputChange(item._id, e.target.value)
                                                            }
                                                            className={`w-16 text-center py-1 px-1.5 rounded-lg border text-xs font-bold ${isModified
                                                                    ? 'border-[#9e0027] bg-[#ffdad6]/20'
                                                                    : 'border-[#e3bebd]/60 bg-[#fff8f5]'
                                                                }`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleStockStep(item._id, item.stock, 5)}
                                                            className="w-6 h-6 rounded-lg bg-[#e9e1dc]/80 hover:bg-[#e9e1dc] text-[#5b4040] font-bold flex items-center justify-center text-xs"
                                                            title="Add 5"
                                                        >
                                                            +
                                                        </button>

                                                        {isModified && (
                                                            <button
                                                                onClick={() => handleSaveStock(item._id)}
                                                                className="ml-1 p-1.5 rounded-lg bg-[#9e0027] text-white hover:bg-[#c41e3a] shadow-xs"
                                                                title="Save Stock"
                                                            >
                                                                <Save className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Alert Threshold */}
                                                <td className="py-4 px-4 text-[#5b4040] font-mono text-xs">
                                                    &le; {item.lowStockThreshold || 20}
                                                </td>

                                                {/* Status indicator */}
                                                <td className="py-4 px-4">
                                                    {isOut ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                                                            Out of Stock
                                                        </span>
                                                    ) : isLow ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                                                            Low Stock
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                                                            Healthy
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-5 text-right">
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                window.confirm(
                                                                    `Are you sure you want to deactivate "${item.name}"?`
                                                                )
                                                            ) {
                                                                handleDeleteItem(item._id, item.name);
                                                            }
                                                        }}
                                                        className="p-2 rounded-xl text-[#5b4040] hover:text-red-600 hover:bg-red-50 transition-colors"
                                                        title="Deactivate Item"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ADD INGREDIENT MODAL */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#e3bebd] shadow-2xl space-y-6">
                            <div className="flex justify-between items-center border-b border-[#e3bebd]/40 pb-4">
                                <div>
                                    <h3 className="font-display text-xl font-bold text-[#1e1b18]">
                                        Add New Ingredient
                                    </h3>
                                    <p className="text-xs text-[#5b4040]">
                                        Add an artisanal item to the pantry repository.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="p-1.5 rounded-xl text-[#5b4040] hover:bg-[#e9e1dc]"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#5b4040] mb-1">
                                        Ingredient Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Sourdough Crust, Truffle Garlic..."
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        className="w-full px-3.5 py-2.5 text-xs bg-[#fff8f5] border border-[#e3bebd]/60 rounded-xl focus:outline-none focus:border-[#9e0027] text-[#1e1b18]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#5b4040] mb-1">
                                        Category *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) =>
                                            setFormData({ ...formData, category: e.target.value })
                                        }
                                        className="w-full px-3.5 py-2.5 text-xs bg-[#fff8f5] border border-[#e3bebd]/60 rounded-xl focus:outline-none focus:border-[#9e0027] text-[#1e1b18] capitalize"
                                    >
                                        <option value="base">Crust Base</option>
                                        <option value="sauce">Sauce</option>
                                        <option value="cheese">Cheese</option>
                                        <option value="veggie">Veggie Topping</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#5b4040] mb-1">
                                            Initial Stock *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            placeholder="50"
                                            value={formData.stock}
                                            onChange={(e) =>
                                                setFormData({ ...formData, stock: e.target.value })
                                            }
                                            className="w-full px-3.5 py-2.5 text-xs bg-[#fff8f5] border border-[#e3bebd]/60 rounded-xl focus:outline-none focus:border-[#9e0027] text-[#1e1b18]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#5b4040] mb-1">
                                            Unit Price (₹) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            placeholder="120"
                                            value={formData.price}
                                            onChange={(e) =>
                                                setFormData({ ...formData, price: e.target.value })
                                            }
                                            className="w-full px-3.5 py-2.5 text-xs bg-[#fff8f5] border border-[#e3bebd]/60 rounded-xl focus:outline-none focus:border-[#9e0027] text-[#1e1b18]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#5b4040] mb-1">
                                        Low Stock Alert Threshold
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="20"
                                        value={formData.lowStockThreshold}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                lowStockThreshold: e.target.value
                                            })
                                        }
                                        className="w-full px-3.5 py-2.5 text-xs bg-[#fff8f5] border border-[#e3bebd]/60 rounded-xl focus:outline-none focus:border-[#9e0027] text-[#1e1b18]"
                                    />
                                    <span className="text-[10px] text-[#5b4040] mt-1 block">
                                        Alerts when inventory level dips below this quantity.
                                    </span>
                                </div>

                                <div className="flex gap-3 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 py-3 rounded-xl bg-[#e9e1dc]/60 text-[#5b4040] text-xs font-semibold hover:bg-[#e9e1dc]"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingAdd}
                                        className="flex-1 py-3 rounded-xl bg-[#9e0027] text-white text-xs font-bold hover:bg-[#c41e3a] disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {submittingAdd ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            'Create Item'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
