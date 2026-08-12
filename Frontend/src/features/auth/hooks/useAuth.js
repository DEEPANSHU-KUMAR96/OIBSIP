import { useDispatch, useSelector } from "react-redux";
import { login as loginAction, logout as logoutAction, setUser, setLoading, setError, clearError } from '../state/auth.slice';
import { register as registerApi, login as loginApi, logout as logoutApi, getMe as getMeApi } from '../services/auth.api';

export function useAuth() {
    const dispatch = useDispatch();
    const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

    async function handleRegister({ name, email, password }) {
        dispatch(setLoading(true));
        dispatch(clearError());
        try {
            const data = await registerApi({ name, email, password });
            dispatch(loginAction(data));
            return data;
        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({ email, password }) {
        dispatch(setLoading(true));
        dispatch(clearError());
        try {
            const data = await loginApi({ email, password });
            dispatch(loginAction(data));
            return data;
        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogout() {
        dispatch(setLoading(true));
        try {
            await logoutApi();
        } catch (err) {
            console.error("Logout API error:", err);
        } finally {
            dispatch(logoutAction());
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe() {
        dispatch(setLoading(true));
        try {
            const data = await getMeApi();
            dispatch(setUser(data));
            return data;
        } catch (err) {
            dispatch(logoutAction());
        } finally {
            dispatch(setLoading(false));
        }
    }

    function clearAuthError() {
        dispatch(clearError());
    }

    return {
        user,
        token,
        isAuthenticated,
        loading,
        error,
        handleRegister,
        handleLogin,
        handleLogout,
        handleGetMe,
        clearAuthError
    };
}