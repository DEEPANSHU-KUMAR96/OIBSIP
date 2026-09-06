import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Flame } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function OAuthSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { handleOAuthSuccess } = useAuth();
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;
        processedRef.current = true;

        const token = searchParams.get('accessToken');
        const error = searchParams.get('error');

        if (error) {
            navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
            return;
        }

        if (!token) {
            navigate('/login?error=Authentication%20token%20missing', { replace: true });
            return;
        }

        handleOAuthSuccess(token)
            .then(() => {
                navigate('/', { replace: true });
            })
            .catch((err) => {
                navigate(`/login?error=${encodeURIComponent(err.message || 'Authentication failed')}`, { replace: true });
            });
    }, [searchParams, handleOAuthSuccess, navigate]);

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-[#fff8f5] text-[#1e1b18] px-4">
            <div className="flex flex-col items-center text-center p-8 max-w-sm w-full rounded-2xl bg-white border border-[#e3bebd]/60 shadow-lg shadow-[#c41e3a]/5 animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#9e0027] to-[#c41e3a] flex items-center justify-center text-white shadow-md shadow-[#c41e3a]/25 mb-5">
                    <Flame className="w-8 h-8 animate-pulse" />
                </div>
                <h2 className="font-display text-2xl font-bold text-[#1e1b18] mb-2">
                    Completing Sign In...
                </h2>
                <p className="text-xs text-[#5b4040] mb-6">
                    Connecting your Google account with OIBSIP Pizza.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-[#9e0027]">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Please wait...</span>
                </div>
            </div>
        </main>
    );
}
