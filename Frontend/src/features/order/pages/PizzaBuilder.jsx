import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useOrder } from '../hooks/useOrder';
import {
    Pizza,
    Check,
    AlertCircle,
    CheckCircle2,
    RotateCcw,
    ReceiptText,
    ArrowRight,
    Loader2
} from 'lucide-react';

function getGourmetItemMeta(item, category) {
    const rawName = item?.name || '';
    const lower = rawName.toLowerCase();

    if (category === 'base') {
        if (lower.includes('thin')) {
            return {
                displayName: 'Hand-Tossed Thin Crust',
                tag: "Chef's Pick",
                tagColor: 'bg-[#fff2cc] text-[#8a5d00]',
                description: 'Fermented 48 hrs. Airy, blistered rim with a crisp and light center.'
            };
        }
        if (lower.includes('heese') || lower.includes('cheese')) {
            return {
                displayName: 'Artisan Cheese Burst',
                tag: null,
                description: 'Ring-stuffed with fontina, smoked scamorza, and velvety mozzarella cream.'
            };
        }
        if (lower.includes('gluten') || lower.includes('cauliflower')) {
            return {
                displayName: 'Gluten-Free Cauliflower & Herb',
                tag: 'Grain-Free',
                tagColor: 'bg-[#ede8e3] text-[#5c5249]',
                description: 'Infused with rosemary and oregano. Baked golden for healthy crispness.'
            };
        }
        return {
            displayName: rawName,
            tag: null,
            description: 'Handcrafted sourdough base baked directly on stone hearth.'
        };
    }

    if (category === 'sauce') {
        if (lower.includes('tomato') || lower.includes('marzano')) {
            return {
                displayName: 'San Marzano Marinara',
                tag: 'Classic D.O.P.',
                tagColor: 'bg-[#fff2cc] text-[#8a5d00]',
                description: 'Sun-ripened Italian plum tomatoes slow-simmered with Sicilian oregano and garlic.'
            };
        }
        if (lower.includes('white') || lower.includes('garlic') || lower.includes('cream')) {
            return {
                displayName: 'Roasted Garlic & Parmesan Cream',
                tag: 'Velvety',
                tagColor: 'bg-[#ede8e3] text-[#5c5249]',
                description: 'Silky whipped cream infused with caramelized confit garlic and aged pecorino.'
            };
        }
        if (lower.includes('bbq') || lower.includes('barbecue')) {
            return {
                displayName: 'Smoked Hickory Barbecue',
                tag: 'Wood-Smoked',
                tagColor: 'bg-[#fff2cc] text-[#8a5d00]',
                description: 'Bold oak-smoked molasses reduction with tangy cider vinegar and cracked pepper.'
            };
        }
        return {
            displayName: rawName,
            tag: null,
            description: 'House-made artisanal sauce crafted daily from fresh pantry ingredients.'
        };
    }

    if (category === 'cheese') {
        if (lower.includes('mozzarella')) {
            return {
                displayName: 'Fresh Fior di Latte Mozzarella',
                tag: 'Traditional',
                tagColor: 'bg-[#fff2cc] text-[#8a5d00]',
                description: 'Delicate, creamy pulled curd cheese that melts into molten golden pools.'
            };
        }
        if (lower.includes('cheddar')) {
            return {
                displayName: 'Aged Farmhouse White Cheddar',
                tag: '12-Mo. Aged',
                tagColor: 'bg-[#fff2cc] text-[#8a5d00]',
                description: 'Sharp, buttery English cheddar providing robust savory depth and rich melt.'
            };
        }
        return {
            displayName: rawName,
            tag: null,
            description: 'Artisanal cheese curated for high melting point and savory aromatics.'
        };
    }

    if (category === 'veggie') {
        if (lower.includes('capsicum') || lower.includes('pepper')) {
            return {
                displayName: 'Farm Bell Peppers',
                tag: 'Crisp',
                tagColor: 'bg-[#e4f8ed] text-[#0d783e]',
                description: 'Tender garden-fresh bell peppers sliced for vibrant color and sweetness.'
            };
        }
        if (lower.includes('corn')) {
            return {
                displayName: 'Sweet Golden Kernel Corn',
                tag: 'Sweet',
                tagColor: 'bg-[#fff2cc] text-[#8a5d00]',
                description: 'Plump sun-drenched sweet corn roasted with a pinch of sea salt.'
            };
        }
        return {
            displayName: rawName,
            tag: null,
            description: 'Locally sourced fresh harvest vegetable topping.'
        };
    }

    return {
        displayName: rawName,
        tag: null,
        description: 'Fresh artisanal pizza ingredient.'
    };
}

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
        loadInventory,
        handleSelectBase,
        handleSelectSauce,
        handleSelectCheese,
        handleToggleVeggie,
        handleResetCustomization,
        handlePlaceOrder,
        clearOrderError
    } = useOrder();

    const [activeTab, setActiveTab] = useState('base');
    const [orderConfirmed, setOrderConfirmed] = useState(null);

    const [userSelectedSauce, setUserSelectedSauce] = useState(false);
    const [userSelectedCheese, setUserSelectedCheese] = useState(false);

    useEffect(() => {
        loadInventory();
    }, [loadInventory]);

    const handleBaseClick = (id) => {
        handleSelectBase(id);
    };

    const handleSauceClick = (id) => {
        setUserSelectedSauce(true);
        handleSelectSauce(id);
    };

    const handleCheeseClick = (id) => {
        setUserSelectedCheese(true);
        handleSelectCheese(id);
    };

    const handleReset = () => {
        handleResetCustomization();
        setUserSelectedSauce(false);
        setUserSelectedCheese(false);
        setActiveTab('base');
    };

    const handleSubmitOrder = async () => {
        try {
            const order = await handlePlaceOrder();
            if (order) {
                setOrderConfirmed(order);
            }
        } catch (err) {
            // Managed in order hook
        }
    };

    const steps = [
        { id: 'base', stepNum: 1, label: 'Crust' },
        { id: 'sauce', stepNum: 2, label: 'Sauce' },
        { id: 'cheese', stepNum: 3, label: 'Cheese' },
        { id: 'veggie', stepNum: 4, label: 'Veggies' },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === activeTab);

    const handleNextStep = () => {
        if (currentStepIndex < steps.length - 1) {
            setActiveTab(steps[currentStepIndex + 1].id);
            window.scrollTo({ top: 300, behavior: 'smooth' });
        } else {
            handleSubmitOrder();
        }
    };

    const nextButtonLabel = useMemo(() => {
        if (activeTab === 'base') return 'Next: Choose Sauce';
        if (activeTab === 'sauce') return 'Next: Choose Cheese';
        if (activeTab === 'cheese') return 'Next: Add Veggies';
        return 'Confirm & Place Order';
    }, [activeTab]);

    const sectionInfo = useMemo(() => {
        switch (activeTab) {
            case 'base':
                return {
                    title: 'Select Pizza Base',
                    subtitle: 'The foundation of true Italian flavor',
                    badge: 'REQUIRED (1)'
                };
            case 'sauce':
                return {
                    title: 'Select Artisanal Sauce',
                    subtitle: 'Slow-cooked authentic Italian bases',
                    badge: 'REQUIRED (1)'
                };
            case 'cheese':
                return {
                    title: 'Select Gourmet Cheese',
                    subtitle: 'Crafted from rich dairy & aged to perfection',
                    badge: 'REQUIRED (1)'
                };
            case 'veggie':
                return {
                    title: 'Select Fresh Veggies',
                    subtitle: 'Farm-to-table crisp toppings for added flavor',
                    badge: 'OPTIONAL'
                };
            default:
                return {
                    title: 'Select Options',
                    subtitle: '',
                    badge: 'REQUIRED (1)'
                };
        }
    }, [activeTab]);

    const sauceFillColor = useMemo(() => {
        const lower = (selectedSauceObj?.name || '').toLowerCase();
        if (lower.includes('bbq') || lower.includes('barbecue')) return '#6c2b14';
        if (lower.includes('white') || lower.includes('garlic') || lower.includes('cream')) return '#f2ebd9';
        if (lower.includes('pesto')) return '#3b6933';
        return '#c02626';
    }, [selectedSauceObj]);

    const baseMeta = useMemo(() => getGourmetItemMeta(selectedBaseObj, 'base'), [selectedBaseObj]);
    const sauceMeta = useMemo(() => getGourmetItemMeta(selectedSauceObj, 'sauce'), [selectedSauceObj]);
    const cheeseMeta = useMemo(() => getGourmetItemMeta(selectedCheeseObj, 'cheese'), [selectedCheeseObj]);

    return (
        <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18] flex flex-col font-body antialiased overflow-x-hidden">
            <Navbar />

            {/* Main responsive container */}
            <main className="flex-1 w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-28">
                {/* Horizontal Stepper Navigation Pills */}
                <nav aria-label="Customization steps" className="mb-5 sm:mb-6 w-full">
                    <div className="flex items-center justify-start sm:justify-center gap-1 sm:gap-2 overflow-x-auto py-1 px-1 no-scrollbar">
                        {steps.map((step, idx) => {
                            const isActive = activeTab === step.id;
                            return (
                                <React.Fragment key={step.id}>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab(step.id)}
                                        className={`flex items-center gap-1 sm:gap-1.5 px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer shrink-0 ${
                                            isActive
                                                ? 'bg-[#540c1a] text-white shadow-xs'
                                                : 'bg-[#f4eeea] text-[#6e635d] hover:bg-[#ede5df] hover:text-[#1e1b18]'
                                        }`}
                                    >
                                        <span className="font-extrabold">{step.stepNum}</span>
                                        <span>{step.label}</span>
                                        {isActive && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-0.5 inline-block" />
                                        )}
                                    </button>

                                    {idx < steps.length - 1 && (
                                        <div className="w-2.5 sm:w-4 h-[1.5px] bg-[#e3bebd]/80 shrink-0" />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </nav>

                {/* Error Banner */}
                {error && (
                    <div className="mb-5 p-3.5 rounded-2xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] flex items-center justify-between shadow-xs animate-fade-in">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 text-[#ba1a1a]" />
                            <span className="text-xs sm:text-sm font-semibold">{error}</span>
                        </div>
                        <button onClick={clearOrderError} className="text-xs font-bold underline ml-2 cursor-pointer">
                            Dismiss
                        </button>
                    </div>
                )}

                {/* LIVE OVEN CANVAS CARD */}
                <section className="bg-white rounded-3xl border border-[#ebdcd4] p-4 sm:p-7 shadow-xs mb-6 relative overflow-hidden">
                    {/* Top Canvas Bar */}
                    <div className="flex items-center justify-between mb-3 sm:mb-5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#fdf0f0] border border-[#fbd4d6] text-[#931525] text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase">
                            <span className="w-2 h-2 rounded-full bg-[#c92a2a] animate-pulse" />
                            <span>Live Oven Canvas</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#786a60] hover:text-[#1e1b18] transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-[#f4eeea]"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset</span>
                        </button>
                    </div>

                    {/* Interactive Wood-Fired Pizza Graphic */}
                    <div className="flex flex-col items-center justify-center my-1 sm:my-3">
                        <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-68 md:h-68 rounded-full shadow-xl transition-transform duration-300">
                            <svg
                                viewBox="0 0 300 300"
                                className="w-full h-full drop-shadow-md select-none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <defs>
                                    <radialGradient id="crustGradient" cx="50%" cy="50%" r="50%">
                                        <stop offset="70%" stopColor="#d58f4a" />
                                        <stop offset="88%" stopColor="#b36928" />
                                        <stop offset="97%" stopColor="#874712" />
                                        <stop offset="100%" stopColor="#542907" />
                                    </radialGradient>

                                    <radialGradient id="cheeseGradient" cx="45%" cy="45%" r="55%">
                                        <stop offset="0%" stopColor="#fff8db" />
                                        <stop offset="65%" stopColor="#fce7a2" />
                                        <stop offset="92%" stopColor="#f7d476" />
                                        <stop offset="100%" stopColor="#e2b449" />
                                    </radialGradient>

                                    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
                                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
                                    </filter>
                                </defs>

                                {/* 1. Base / Crust Rim */}
                                <circle cx="150" cy="150" r="142" fill="url(#crustGradient)" />

                                {/* Crust Blisters / Charred spots */}
                                <circle cx="48" cy="115" r="4" fill="#3a1b04" opacity="0.45" />
                                <circle cx="238" cy="95" r="5" fill="#3a1b04" opacity="0.5" />
                                <circle cx="215" cy="225" r="6" fill="#3a1b04" opacity="0.45" />
                                <circle cx="85" cy="235" r="4.5" fill="#3a1b04" opacity="0.5" />
                                <circle cx="160" cy="282" r="4" fill="#3a1b04" opacity="0.6" />
                                <circle cx="140" cy="16" r="3.5" fill="#3a1b04" opacity="0.55" />

                                {/* 2. Sauce Layer */}
                                <circle
                                    cx="150"
                                    cy="150"
                                    r="124"
                                    fill={sauceFillColor}
                                    className="transition-colors duration-500"
                                />

                                {/* 3. Cheese Melt Layer */}
                                <circle
                                    cx="150"
                                    cy="150"
                                    r="115"
                                    fill="url(#cheeseGradient)"
                                    filter="url(#softShadow)"
                                />

                                {/* Melted Cheese Spots */}
                                <ellipse cx="195" cy="115" rx="12" ry="8" fill="#e5b854" opacity="0.7" />
                                <ellipse cx="110" cy="190" rx="14" ry="9" fill="#e5b854" opacity="0.7" />
                                <ellipse cx="190" cy="185" rx="15" ry="11" fill="#dfad42" opacity="0.65" />
                                <ellipse cx="115" cy="110" rx="10" ry="7" fill="#edd07e" opacity="0.8" />

                                {/* Center Watermark: "Artisanal" */}
                                <text
                                    x="150"
                                    y="152"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontFamily="'Playfair Display', serif"
                                    fontStyle="italic"
                                    fontSize="20"
                                    fontWeight="600"
                                    fill="#8a612f"
                                    opacity="0.8"
                                    style={{ letterSpacing: '0.04em' }}
                                >
                                    Artisanal
                                </text>

                                {/* 4. Veggie Toppings */}
                                {selectedVeggieObjs.some(v => v.name.toLowerCase().includes('capsicum') || v.name.toLowerCase().includes('pepper')) && (
                                    <g className="animate-fade-in" filter="url(#softShadow)">
                                        <path d="M120,95 Q135,80 145,95" stroke="#1b6b33" strokeWidth="6" strokeLinecap="round" fill="none" />
                                        <path d="M175,85 Q190,100 185,115" stroke="#1b6b33" strokeWidth="6" strokeLinecap="round" fill="none" />
                                        <path d="M110,170 Q125,185 140,175" stroke="#1b6b33" strokeWidth="6" strokeLinecap="round" fill="none" />
                                        <path d="M170,205 Q185,190 200,205" stroke="#1b6b33" strokeWidth="6" strokeLinecap="round" fill="none" />
                                        <path d="M85,135 Q100,120 105,140" stroke="#1b6b33" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                                        <path d="M205,150 Q220,135 220,155" stroke="#1b6b33" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                                    </g>
                                )}

                                {selectedVeggieObjs.some(v => v.name.toLowerCase().includes('corn')) && (
                                    <g className="animate-fade-in" filter="url(#softShadow)">
                                        <circle cx="160" cy="110" r="4.5" fill="#f5c21b" stroke="#cf9c05" strokeWidth="1" />
                                        <circle cx="168" cy="116" r="4.5" fill="#f5c21b" stroke="#cf9c05" strokeWidth="1" />
                                        <circle cx="130" cy="130" r="4.5" fill="#f5c21b" stroke="#cf9c05" strokeWidth="1" />
                                        <circle cx="138" cy="136" r="4.5" fill="#f5c21b" stroke="#cf9c05" strokeWidth="1" />
                                        <circle cx="160" cy="190" r="4.5" fill="#f5c21b" stroke="#cf9c05" strokeWidth="1" />
                                        <circle cx="168" cy="195" r="4.5" fill="#f5c21b" stroke="#cf9c05" strokeWidth="1" />
                                        <circle cx="105" cy="155" r="4.5" fill="#f5c21b" stroke="#cf9c05" strokeWidth="1" />
                                        <circle cx="195" cy="135" r="4.5" fill="#f5c21b" stroke="#cf9c05" strokeWidth="1" />
                                    </g>
                                )}

                                <path d="M125,120 C118,110 135,105 130,125 Z" fill="#287a3e" filter="url(#softShadow)" />
                                <path d="M180,175 C190,165 175,158 172,178 Z" fill="#287a3e" filter="url(#softShadow)" />
                            </svg>
                        </div>

                        {/* Pizza Canvas Title & Subtitle */}
                        <div className="mt-3.5 text-center">
                            <h2 className="font-display text-lg sm:text-2xl font-bold text-[#1e1b18] tracking-tight">
                                {baseMeta.displayName || 'Hand-Tossed Thin Crust'}
                            </h2>
                            <p className="text-xs sm:text-sm text-[#7a6b61] mt-0.5 font-medium">
                                {baseMeta.displayName?.split(' ')[0] || 'Rustic Crust'} • {sauceMeta.displayName?.split(' ')[0] || 'San Marzano'} • {cheeseMeta.displayName?.split(' ')[0] || 'Fior di Latte'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION HEADER: Title & Required Badge */}
                <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3.5">
                    <div>
                        <h3 className="font-display text-lg sm:text-2xl font-bold text-[#1e1b18] tracking-tight">
                            {sectionInfo.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#7a6b61]">
                            {sectionInfo.subtitle}
                        </p>
                    </div>

                    <span className="shrink-0 px-2.5 sm:px-3 py-1 rounded-full bg-[#ffeaec] border border-[#fbd4d6] text-[#8e1526] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">
                        {sectionInfo.badge}
                    </span>
                </div>

                {/* INGREDIENT OPTION CARDS */}
                {inventoryLoading && !inventory.base?.length ? (
                    <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-7 h-7 text-[#540c1a] animate-spin" />
                        <p className="text-xs sm:text-sm text-[#7a6b61] font-semibold">
                            Fetching fresh ingredients from hearth pantry...
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-3.5 mb-6">
                        {/* 1. CRUST TAB */}
                        {activeTab === 'base' && (
                            <div className="space-y-3 sm:space-y-3.5 animate-fade-in">
                                {inventory.base.map((item) => {
                                    const meta = getGourmetItemMeta(item, 'base');
                                    const isSelected = customization.base === item._id;
                                    const isOutOfStock = item.stock <= 0;

                                    return (
                                        <button
                                            key={item._id}
                                            type="button"
                                            disabled={isOutOfStock}
                                            onClick={() => handleBaseClick(item._id)}
                                            className={`w-full rounded-2xl p-4 sm:p-5 text-left transition-all duration-150 cursor-pointer block ${
                                                isSelected
                                                    ? 'border-2 border-[#540c1a] bg-white ring-1 ring-[#540c1a]/10 shadow-sm'
                                                    : isOutOfStock
                                                        ? 'border border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                                        : 'border border-[#ebdcd4] bg-white hover:border-[#c5b4a8]'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                                    <span className="font-bold text-sm sm:text-lg text-[#1e1b18]">
                                                        {meta.displayName}
                                                    </span>
                                                    {meta.tag && (
                                                        <span className={`text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full ${meta.tagColor || 'bg-[#fff2cc] text-[#8a5d00]'}`}>
                                                            {meta.tag}
                                                        </span>
                                                    )}
                                                </div>

                                                {isSelected ? (
                                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#540c1a] text-white flex items-center justify-center shrink-0 shadow-xs">
                                                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                                                    </div>
                                                ) : (
                                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-[#d3c5bb] shrink-0" />
                                                )}
                                            </div>

                                            <p className="text-xs sm:text-sm text-[#61544c] leading-relaxed mt-1.5">
                                                {meta.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#f4eeea]">
                                                <span className="text-base sm:text-xl font-bold text-[#1e1b18]">
                                                    ₹{item.price}
                                                </span>

                                                {isOutOfStock ? (
                                                    <span className="text-[11px] sm:text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                                                        Out of stock
                                                    </span>
                                                ) : (
                                                    <span className={`text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                                                        isSelected
                                                            ? 'bg-[#e4f8ed] text-[#0d783e]'
                                                            : 'bg-[#f4eee9] text-[#6e635d]'
                                                    }`}>
                                                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0d783e]" />}
                                                        <span>{item.stock} left in stock</span>
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* 2. SAUCE TAB */}
                        {activeTab === 'sauce' && (
                            <div className="space-y-3 sm:space-y-3.5 animate-fade-in">
                                {inventory.sauce.map((item) => {
                                    const meta = getGourmetItemMeta(item, 'sauce');
                                    const isSelected = customization.sauce === item._id;
                                    const isOutOfStock = item.stock <= 0;

                                    return (
                                        <button
                                            key={item._id}
                                            type="button"
                                            disabled={isOutOfStock}
                                            onClick={() => handleSauceClick(item._id)}
                                            className={`w-full rounded-2xl p-4 sm:p-5 text-left transition-all duration-150 cursor-pointer block ${
                                                isSelected
                                                    ? 'border-2 border-[#540c1a] bg-white ring-1 ring-[#540c1a]/10 shadow-sm'
                                                    : isOutOfStock
                                                        ? 'border border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                                        : 'border border-[#ebdcd4] bg-white hover:border-[#c5b4a8]'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                                    <span className="font-bold text-sm sm:text-lg text-[#1e1b18]">
                                                        {meta.displayName}
                                                    </span>
                                                    {meta.tag && (
                                                        <span className={`text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full ${meta.tagColor || 'bg-[#fff2cc] text-[#8a5d00]'}`}>
                                                            {meta.tag}
                                                        </span>
                                                    )}
                                                </div>

                                                {isSelected ? (
                                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#540c1a] text-white flex items-center justify-center shrink-0 shadow-xs">
                                                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                                                    </div>
                                                ) : (
                                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-[#d3c5bb] shrink-0" />
                                                )}
                                            </div>

                                            <p className="text-xs sm:text-sm text-[#61544c] leading-relaxed mt-1.5">
                                                {meta.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#f4eeea]">
                                                <span className="text-base sm:text-xl font-bold text-[#1e1b18]">
                                                    ₹{item.price}
                                                </span>

                                                {isOutOfStock ? (
                                                    <span className="text-[11px] sm:text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                                                        Out of stock
                                                    </span>
                                                ) : (
                                                    <span className={`text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                                                        isSelected
                                                            ? 'bg-[#e4f8ed] text-[#0d783e]'
                                                            : 'bg-[#f4eee9] text-[#6e635d]'
                                                    }`}>
                                                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0d783e]" />}
                                                        <span>{item.stock} left in stock</span>
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* 3. CHEESE TAB */}
                        {activeTab === 'cheese' && (
                            <div className="space-y-3 sm:space-y-3.5 animate-fade-in">
                                {inventory.cheese.map((item) => {
                                    const meta = getGourmetItemMeta(item, 'cheese');
                                    const isSelected = customization.cheese === item._id;
                                    const isOutOfStock = item.stock <= 0;

                                    return (
                                        <button
                                            key={item._id}
                                            type="button"
                                            disabled={isOutOfStock}
                                            onClick={() => handleCheeseClick(item._id)}
                                            className={`w-full rounded-2xl p-4 sm:p-5 text-left transition-all duration-150 cursor-pointer block ${
                                                isSelected
                                                    ? 'border-2 border-[#540c1a] bg-white ring-1 ring-[#540c1a]/10 shadow-sm'
                                                    : isOutOfStock
                                                        ? 'border border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                                        : 'border border-[#ebdcd4] bg-white hover:border-[#c5b4a8]'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                                    <span className="font-bold text-sm sm:text-lg text-[#1e1b18]">
                                                        {meta.displayName}
                                                    </span>
                                                    {meta.tag && (
                                                        <span className={`text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full ${meta.tagColor || 'bg-[#fff2cc] text-[#8a5d00]'}`}>
                                                            {meta.tag}
                                                        </span>
                                                    )}
                                                </div>

                                                {isSelected ? (
                                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#540c1a] text-white flex items-center justify-center shrink-0 shadow-xs">
                                                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                                                    </div>
                                                ) : (
                                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-[#d3c5bb] shrink-0" />
                                                )}
                                            </div>

                                            <p className="text-xs sm:text-sm text-[#61544c] leading-relaxed mt-1.5">
                                                {meta.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#f4eeea]">
                                                <span className="text-base sm:text-xl font-bold text-[#1e1b18]">
                                                    ₹{item.price}
                                                </span>

                                                {isOutOfStock ? (
                                                    <span className="text-[11px] sm:text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                                                        Out of stock
                                                    </span>
                                                ) : (
                                                    <span className={`text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                                                        isSelected
                                                            ? 'bg-[#e4f8ed] text-[#0d783e]'
                                                            : 'bg-[#f4eee9] text-[#6e635d]'
                                                    }`}>
                                                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0d783e]" />}
                                                        <span>{item.stock} left in stock</span>
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* 4. VEGGIES TAB */}
                        {activeTab === 'veggie' && (
                            <div className="space-y-3 sm:space-y-3.5 animate-fade-in">
                                {inventory.veggie.map((item) => {
                                    const meta = getGourmetItemMeta(item, 'veggie');
                                    const isSelected = customization.veggies.includes(item._id);
                                    const isOutOfStock = item.stock <= 0;

                                    return (
                                        <button
                                            key={item._id}
                                            type="button"
                                            disabled={isOutOfStock}
                                            onClick={() => handleToggleVeggie(item._id)}
                                            className={`w-full rounded-2xl p-4 sm:p-5 text-left transition-all duration-150 cursor-pointer block ${
                                                isSelected
                                                    ? 'border-2 border-[#540c1a] bg-white ring-1 ring-[#540c1a]/10 shadow-sm'
                                                    : isOutOfStock
                                                        ? 'border border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                                        : 'border border-[#ebdcd4] bg-white hover:border-[#c5b4a8]'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                                    <span className="font-bold text-sm sm:text-lg text-[#1e1b18]">
                                                        {meta.displayName}
                                                    </span>
                                                    {meta.tag && (
                                                        <span className={`text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full ${meta.tagColor || 'bg-[#e4f8ed] text-[#0d783e]'}`}>
                                                            {meta.tag}
                                                        </span>
                                                    )}
                                                </div>

                                                {isSelected ? (
                                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[#540c1a] text-white flex items-center justify-center shrink-0 shadow-xs">
                                                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                                                    </div>
                                                ) : (
                                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 border-[#d3c5bb] shrink-0" />
                                                )}
                                            </div>

                                            <p className="text-xs sm:text-sm text-[#61544c] leading-relaxed mt-1.5">
                                                {meta.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#f4eeea]">
                                                <span className="text-base sm:text-xl font-bold text-[#1e1b18]">
                                                    +₹{item.price}
                                                </span>

                                                {isOutOfStock ? (
                                                    <span className="text-[11px] sm:text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                                                        Out of stock
                                                    </span>
                                                ) : (
                                                    <span className={`text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                                                        isSelected
                                                            ? 'bg-[#e4f8ed] text-[#0d783e]'
                                                            : 'bg-[#f4eee9] text-[#6e635d]'
                                                    }`}>
                                                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0d783e]" />}
                                                        <span>{item.stock} left in stock</span>
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* CURRENT SELECTION BREAKDOWN CARD */}
                <section className="bg-[#fbf7f4] sm:bg-white rounded-2xl border border-[#ebdcd4] p-4 sm:p-5 shadow-2xs space-y-2.5 mb-6">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#ebdcd4]/60">
                        <div className="flex items-center gap-1.5">
                            <ReceiptText className="w-4 h-4 text-[#786a60]" />
                            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#1e1b18]">
                                Current Selection Breakdown
                            </span>
                        </div>

                        <span className="text-[10px] sm:text-[11px] font-bold text-[#0d783e] bg-[#e4f8ed] border border-[#bbf0cf] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg">
                            Taxes Included
                        </span>
                    </div>

                    {/* Breakdown List */}
                    <div className="space-y-1.5 text-xs sm:text-sm text-[#5b4040]">
                        <div className="flex justify-between items-center">
                            <span>Base: {baseMeta.displayName || 'None'}</span>
                            <span className="font-bold text-[#1e1b18]">₹{selectedBaseObj?.price || 0}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span>
                                Sauce: {sauceMeta.displayName || 'None'} {!userSelectedSauce && selectedSauceObj ? '(Auto)' : ''}
                            </span>
                            <span className="font-bold text-[#1e1b18]">₹{selectedSauceObj?.price || 0}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span>
                                Cheese: {cheeseMeta.displayName || 'None'} {!userSelectedCheese && selectedCheeseObj ? '(Auto)' : ''}
                            </span>
                            <span className="font-bold text-[#1e1b18]">₹{selectedCheeseObj?.price || 0}</span>
                        </div>

                        {selectedVeggieObjs.map((v) => (
                            <div key={v._id} className="flex justify-between items-center pl-2 text-xs">
                                <span>+ {getGourmetItemMeta(v, 'veggie').displayName}</span>
                                <span className="font-bold text-[#1e1b18]">₹{v.price}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* STICKY FULLY RESPONSIVE BOTTOM BAR */}
            <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ebdcd4] shadow-[0_-4px_25px_rgba(0,0,0,0.08)] py-2.5 sm:py-3.5 px-3 sm:px-6">
                <div className="max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto flex items-center justify-between gap-2.5 sm:gap-6">
                    {/* Left: Total Price */}
                    <div className="flex flex-col shrink-0">
                        <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#786a60]">
                            Total Price
                        </span>
                        <div className="flex items-baseline">
                            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1e1b18] tracking-tight">
                                ₹{totalPrice}
                            </span>
                            <span className="text-[10px] sm:text-xs text-[#786a60] font-normal ml-1 whitespace-nowrap">
                                (Incl. VAT)
                            </span>
                        </div>
                    </div>

                    {/* Right: The Responsive Action Button */}
                    <button
                        type="button"
                        disabled={placingOrder || (!isCustomizationValid && activeTab === 'veggie')}
                        onClick={handleNextStep}
                        className="flex-1 sm:flex-initial min-w-0 max-w-[260px] sm:max-w-none py-2.5 sm:py-3.5 px-3 sm:px-8 rounded-full bg-[#540c1a] hover:bg-[#3f0813] active:scale-[0.98] text-white font-bold text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                        {placingOrder ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-white shrink-0" />
                                <span className="truncate">Placing Order...</span>
                            </>
                        ) : (
                            <>
                                <span className="truncate">{nextButtonLabel}</span>
                                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                            </>
                        )}
                    </button>
                </div>
            </footer>

            {/* SUCCESS CONFIRMATION MODAL */}
            {orderConfirmed && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 sm:space-y-5 border border-[#ebdcd4] shadow-2xl">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
                        </div>

                        <div>
                            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1e1b18]">
                                Order Placed Successfully!
                            </h3>
                            <p className="text-xs text-[#5b4040] mt-1">
                                Order ID:{' '}
                                <code className="font-mono font-bold bg-[#f4eeea] px-2 py-0.5 rounded text-[#1e1b18]">
                                    {orderConfirmed._id}
                                </code>
                            </p>
                        </div>

                        <div className="bg-[#fff8f5] p-4 rounded-2xl border border-[#ebdcd4] text-left text-xs space-y-1.5 text-[#5b4040]">
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className="font-bold text-[#540c1a]">{orderConfirmed.orderStatus || 'Order Received'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Paid:</span>
                                <span className="font-bold text-[#1e1b18]">₹{orderConfirmed.totalPrice}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                            <button
                                onClick={() => navigate('/my-orders')}
                                className="flex-1 py-2.5 sm:py-3 rounded-xl bg-[#540c1a] text-white text-xs font-bold shadow-sm hover:bg-[#3f0813] transition-all cursor-pointer"
                            >
                                Track Order Progress
                            </button>
                            <button
                                onClick={() => {
                                    setOrderConfirmed(null);
                                    handleReset();
                                }}
                                className="px-4 py-2.5 sm:py-3 rounded-xl bg-[#f4eeea] text-[#5b4040] text-xs font-semibold hover:bg-[#ede5df] transition-all cursor-pointer"
                            >
                                Build Another
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
