import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/auth.js";
import AuthLayout from "../components/AuthLayout.jsx";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState(searchParams.get('email') || '');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await verifyEmail(email, code);
            navigate('/login');
        } catch (err) {
            setError(err.message || "Invalid code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className={"flex flex-col gap-2"}>
                <h1 className={"font-medium text-2xl"}>Verify Email</h1>
                <p className={"font-light text-sm text-gray-500"}>Enter the 6-digit code sent to your email.</p>
            </div>

            {/* VERIFY EMAIL FORM */}
            <form className={"space-y-6 w-full"} onSubmit={handleVerify}>
                {error && <div className={"text-red-500 text-sm"}>{error}</div>}

                {/* EMAIL */}
                <div className={"flex flex-col space-y-2 w-full"}>
                    <label className={"text-sm"}>Email</label>
                    <input
                        type={"email"} value={email} disabled
                        className={"text-sm font-light w-full p-2.5 rounded-lg ring-1 ring-gray-300 cursor-not-allowed tracking-wide"}
                    />
                </div>

                {/* VERIFICATION CODE */}
                <div className={"flex flex-col space-y-2 w-full"}>
                    <label className={"text-sm"}>Confirmation Code</label>
                    <input
                        type={"text"} maxLength={6} placeholder={"123456"}
                        className={"text-center text-xl tracking-[0.5em] font-medium w-full p-2.5 rounded-lg ring-1 ring-gray-300 focus:ring-2 focus:shadow-md focus:outline-none"}
                        value={code} onChange={(e) => setCode(e.target.value)}
                    />
                </div>

                {/* SUBMIT BUTTON */}
                <button type={"submit"} disabled={loading} className={"w-full bg-green-600 text-white p-2.5 rounded-full font-light text-sm mt-2 hover:bg-green-500 transition duration-400 cursor-pointer disabled:opacity-50"}>
                    {loading ? 'Verifying...' : 'Verify Account'}
                </button>
            </form>
        </AuthLayout>
    );
}