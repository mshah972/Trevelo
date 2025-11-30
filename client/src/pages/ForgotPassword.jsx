import { useState } from "react";
import { initiatePasswordReset, completePasswordRest } from "../services/auth.js";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await initiatePasswordReset(email);
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await completePasswordRest(email, code, newPassword);
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className={"flex flex-col gap-2"}>
                <h1 className={"font-medium text-2xl"}>{step === 1 ? "Reset Password" : "Set New Password"}</h1>
                <p className={"font-light text-sm text-gray-500"}>
                    {step === 1 ? "Enter your email to receive a reset code." : "Enter the code and your new password."}
                </p>
            </div>

            {/* SET NEW PASSWORD */}
            {step === 1 ? (

                /* RESET VERIFICATION CODE */
                <form className={"space-y-6 w-full"} onSubmit={handleRequestCode}>
                    {error && <div className={"text-red-500 text-sm"}>{error}</div>}

                    {/* EMAIL */}
                    <div className={"flex flex-col space-y-2 w-full"}>
                        <label className={"text-sm"}>Email</label>
                        <input
                            type={"email"}
                            placeholder={"Enter your email"}
                            className={"text-sm font-light w-full p-2.5 rounded-lg ring-1 ring-gray-300 focus:ring-2 focus:shadow-md focus:outline-none tracking-wide"}
                            value={email} onChange={(e) => setEmail(e.target.value)} required
                        />
                    </div>

                    {/* SEND VERIFICATION CODE */}
                    <button type={"submit"} disabled={loading} className={"w-full bg-blue-600 text-white p-2.5 rounded-full font-light text-sm mt-2 hover:bg-blue-500 transition duration-400 cursor-pointer disabled:opacity-50"}>
                        {loading ? "Sending..." : "Send Reset Code"}
                    </button>
                </form>
            ) : (

                /* HANDLE THE PASSWORD RESET */
                <form className={"space-y-6 w-full"} onSubmit={handleResetSubmit}>
                    {error && <div className={"text-red-500 text-sm"}>{error}</div>}

                    {/* EMAIL */}
                    <div className={"flex flex-col space-y-2 w-full"}>
                        <label className={"text-sm"}>Confirmation Code</label>
                        <input
                            type={"text"} placeholder={"123456"}
                            className={"text-sm font-light w-full p-2.5 rounded-lg ring-1 ring-gray-300 focus:ring-2 focus:shadow-md focus:outline-none tracking-wide"}
                            value={code} onChange={(e) => setCode(e.target.value)} required
                        />
                    </div>

                    {/* NEW PASSWORD */}
                    <div className={"flex flex-col space-y-2"}>
                        <label className={"text-sm"}>New Password</label>
                        <div className={"relative"}>
                            <input
                                type={showPassword ? "text": "password"} placeholder={"Enter New Password"}
                                className={"text-sm font-light w-full p-2.5 rounded-lg ring-1 ring-gray-300 focus:ring-2 focus:shadow-md focus:outline-none tracking-wide"}
                                value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                            />
                            <button
                                type={"button"} onClick={() => setShowPassword(!showPassword)}
                                className={"absolute inset-y-0 right-0 grid w-10 place-items-center text-gray-400 hover:text-blue-500 cursor-pointer"}>
                                {showPassword ? <VisibilityOffIcon style={{ fontSize: 20}} /> : <VisibilityIcon style={{ fontSize: 20 }} />}
                            </button>
                        </div>
                    </div>

                    {/* SUBMIT PASSWORD BUTTON */}
                    <button type={"submit"} disabled={loading} className={"w-full bg-blue-600 text-white p-2.5 rounded-full font-light text-sm mt-2 hover:bg-blue-500 transition duration-400 cursor-pointer disabled:opacity-50"}>
                        {loading ? "Resetting..." : "Set Password"}
                    </button>
                </form>
            )}

            {/* NAVIGATION TO SIGN-IN */}
            <div className={"flex flex-col justify-center items-center w-full mt-4"}>
                <span className={"w-full border-t border-[1px] border-gray-200"}></span>
                <a href={"/login"} className={"flex px-4 py-4 font-light text-sm whitespace-nowrap text-gray-500 gap-2 hover:text-yellow-500 transition duration-400"}>
                    <span>&larr;</span> Back to Sign In
                </a>
            </div>
        </AuthLayout>
    )
}