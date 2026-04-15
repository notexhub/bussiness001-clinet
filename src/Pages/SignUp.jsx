import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Eye, EyeOff, Mail, Lock, ArrowRight
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from './AuthLayout';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const dispatch = useDispatch();
    const { loading: isLoading, error: authError } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [serverError, setServerError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        const { firstName, lastName, email, password, confirmPassword, terms } = formData;

        if (!email || !password) {
            setServerError('Email and password are required');
            return;
        }

        if (password !== confirmPassword) {
            setServerError("Passwords don't match");
            return;
        }

        if (!terms) {
            setServerError('You must accept the terms to continue');
            return;
        }

        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

        const resultAction = await dispatch(signup({ email, password, name: fullName }));
        if (signup.fulfilled.match(resultAction)) {
            toast.success('Account created successfully!');
            navigate("/plans");
        } else {
            setServerError(resultAction.payload || 'Signup failed');
        }
    };

    return (
        <AuthLayout
            title={
                <span className="flex items-center justify-center gap-2 tracking-tight">
                    Join <span className="font-extrabold text-slate-900">NotexHub</span>
                </span>
            }
            subtitle="Your premium workspace for seamless digital management."
            isSignUp={true}
        >
            <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-slate-700 font-medium">
                            First name
                        </Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="bg-slate-50/50 border-slate-200 focus:ring-amber-500"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-slate-700 font-medium">
                            Last name
                        </Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="bg-slate-50/50 border-slate-200 focus:ring-amber-500"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-slate-700 font-medium">
                        Work Email
                    </Label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@notexhub.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10 bg-slate-50/50 border-slate-200 focus:ring-amber-500"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-slate-700 font-medium">
                        Password
                    </Label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            className="pl-10 pr-10 bg-slate-50/50 border-slate-200 focus:ring-amber-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                        Confirm Password
                    </Label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="pl-10 pr-10 bg-slate-50/50 border-slate-200 focus:ring-amber-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        checked={formData.terms}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="terms" className="text-xs text-slate-500 leading-none cursor-pointer">
                        I accept the{' '}
                        <a href="#" className="text-amber-700 font-semibold hover:underline">
                            Terms of Service
                        </a>
                    </Label>
                </div>

                {(serverError || authError) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md text-xs text-red-700"
                    >
                        {serverError || authError}
                    </motion.div>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98] group"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Creating account...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2 font-bold text-lg">
                            Create Account
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    )}
                </Button>

                <p className="text-center text-sm text-slate-500">
                    Already an NotexHub member?{' '}
                    <a href="/signin" className="font-bold text-amber-700 hover:text-amber-600 transition-colors">
                        Sign in here
                    </a>
                </p>
            </form>
        </AuthLayout>
    );
}
