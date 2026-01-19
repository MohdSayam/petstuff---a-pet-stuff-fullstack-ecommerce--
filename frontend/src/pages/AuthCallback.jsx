import { useEffect, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import API from '../api/axios';
import FullPageLoader from '../loading/FullPageLoader';

// OAuth callback handler
function AuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useContext(AuthContext);

    // Prevent double execution in StrictMode
    const hasRun = useRef(false);

    useEffect(() => {
        const handleCallback = async () => {
            if (hasRun.current) return;
            hasRun.current = true;

            const token = searchParams.get('token');
            const error = searchParams.get('error');

            if (error) {
                toast.error('Google login failed. Please try again.');
                navigate('/login', { replace: true });
                return;
            }

            if (token) {
                try {
                    localStorage.setItem('token', token);

                    const response = await API.get('/auth/me');
                    const user = response.data;

                    login(user, token);
                    toast.success(`Welcome ${user.name}! 🐾`);

                    if (user.role === 'admin') {
                        navigate('/admin', { replace: true });
                    } else {
                        navigate('/shop', { replace: true });
                    }
                } catch (err) {
                    console.error('OAuth callback error:', err);
                    localStorage.removeItem('token');
                    toast.error('Authentication failed. Please try again.');
                    navigate('/login', { replace: true });
                }
            } else {
                navigate('/login', { replace: true });
            }
        };

        handleCallback();
    }, [searchParams, login, navigate]);

    return <FullPageLoader />;
}

export default AuthCallback;
