import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.js";
import AuthLayout from "../components/AuthLayout.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";

export default function Login() {
    const [email, setEmail] = useState(' ');
    const [password, setPassword] = useState(' ');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(' ');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await loginUser(email.trim(), password.trim());
            navigate('/');
        } catch (err) {
            console.error("LOGIN ERROR:", err);
            if (err.name === 'UserNotConfirmedException') {
                navigate(`/verify?email=${encodeURIComponent(email)}`);
            } else {
                setError(`Debug: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className={"flex flex-col gap-2"}>
                <h1 className={"font-medium text-2xl"}>Pick Up Where You Left Off</h1>
                <p className={"font-light text-sm text-gray-500"}>Login to access your personalized travel plans, join group trips, and see what's next on your itinerary.</p>
            </div>

            {/* LOGIN FORM */}
            <form className={"space-y-6 w-full"} onSubmit={handleLogin}>
                {error && <div className={"text-red-500 text-sm"}>{error}</div>}

                {/* EMAIL */}
                <div className={"flex flex-col space-y-2 w-full"}>
                    <label htmlFor={"email"} className={"text-sm"}>Email</label>
                    <input
                        id={"email"} type={"email"} placeholder={"Enter your email address"}
                        className={"text-sm font-light w-full p-2.5 rounded-lg ring-1 ring-gray-300 focus:ring-2 focus:shadow-md focus:outline-none tracking-wide"}
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* PASSWORD */}
                <div className={"flex flex-col space-y-2"}>
                    <label htmlFor={"password"} className={"text-sm"}>Password</label>
                    <div className={"relative"}>
                        <input
                            id={"password"} type={showPassword ? "text" : "password"} placeholder={"Enter you password"}
                            className={"text-sm font-light w-full p-2.5 rounded-lg ring-1 ring-gray-300 focus:ring-2 focus:shadow-md focus:outline-none tracking-wide"}
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* SHOW PASSWORD BUTTON */}
                        <button type={"button"} onClick={() => setShowPassword(!showPassword)}
                                className={"absolute inset-y-0 right-0 grid w-10 place-items-center text-gray-400 hover:text-blue-500 cursor-pointer"}>
                            {showPassword ? <VisibilityOffIcon style={{ fontSize: 20 }} /> : <VisibilityIcon style={{ fontSize: 20 }} />}
                        </button>
                    </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button type={"submit"} disabled={loading} className={"w-full bg-blue-600 text-white p-2.5 rounded-full font-light text-sm mt-2 hover:bg-blue-500 transition duration-400 cursor-pointer disabled:opacity-50"}>
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>

                {/* FORGOT PASSWORD */}
                <div className={"flex justify-end w-full items-center"}>
                    <a href={"/forgot-password"} className={"text-sm text-gray-500 font-light hover:underline hover:text-yellow-500 cursor-pointer"}>
                        Forgot Password?
                    </a>
                </div>
            </form>

            {/* DIVIDER */}
            <div className={"flex flex-row justify-center items-center w-full mt-4"}>
                <span className={"flex-1 border-t border[1.5px] border-gray-200"}></span>
                <div className={"px-4 font-light text-xs whitespace-nowrap text-gray-400"}>or Sign In With</div>
                <span className={"flex-1 border-t border-[1.5px] border-gray-200"}></span>
            </div>

            {/* OAUTH SIGN-IN */}
            <div className={"flex flex-row justify-center items-center w-full mt-4 gap-4"}>
                <div className={"flex-1 rounded-full bg-gray-900 text-white p-3 flex justify-center items-center gap-2 hover:bg-gray-800 transition duration-400 cursor-pointer"}>
                    <GoogleIcon fontSize={"small"} style={{ color: "white" }} />
                    <span className={"text-[12px] lg:text-sm m-0 leading-none"}>Google</span>
                </div>
                <div className={"flex-1 rounded-full bg-gray-900 text-white p-3 flex justify-center items-center gap-2 hover:gray-gray-800 transition duration-400 cursor-pointer"}>
                    <AppleIcon fontSize={"small"} style={{ color: "white" }} />
                    <span className={"text-[12px] lg:text-sm m-0 leading-none"}>Apple</span>
                </div>
            </div>

            {/* SIGN-UP NAVIGATION */}
            <div className={"flex flex-row justify-center items-center w-full gap-1 mt-4"}>
                <p className={"text-[12px] lg:text-sm text-gray-500 font-light"}>Don't have an account?</p>
                <a href={"/signup"} className={"text-blue-600 text-[12px] lg:text-sm hover:text-yellow-500 transition duration-400 cursor-pointer"}>Sign Up</a>
            </div>
        </AuthLayout>
    )
}