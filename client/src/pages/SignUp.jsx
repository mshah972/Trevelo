import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth.js";
import AuthLayout from "../components/AuthLayout.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import {Visibility} from "@mui/icons-material";

export default function SignUp() {
    const [ formData, setFormData ] = useState({ name: '', email: '', password: '' });
    const [ showPassword, setShowPassword ] = useState(false);
    const [ error, setError ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await registerUser(formData.email, formData.password, formData.name);
            navigate(`/verify?email=${encodeURIComponent(formData.email)}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
      <AuthLayout>
          {/* Header Text */}
          <div className={"flex flex-col gap-2"}>
              <h1 className={"font-medium text-2xl"}>Start Your Next Journey</h1>
              <p className={"font-light text-sm text-gray-500"}>Sign up to unlock a smarter way to travel together. Plan, share and vote trips that everyone will love.</p>
          </div>

          {/* Form */}
          <form className={"space-y-6 w-full"} onSubmit={handleSignup}>
              {error && <div className={"text-red-500 text-sm"}>{error}</div>}

              {/* Name */}
              <div className={"flex flex-col space-y-2"}>
                  <label htmlFor={"name"} className={"text-sm"}>Name</label>
                  <input
                      id={"name"}
                      type={"text"}
                      placeholder={"Enter your name"}
                      className={"text-sm font-light w-full p-2.5 rounded-lg ring-1 ring-gray-300 focus:shadow-md focus:outline-none tracking-wide"}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                  />
              </div>

              {/* Email */}
              <div className={"flex flex-col space-y-2"}>
                  <label htmlFor={"email"} className={"text-sm"}>Email</label>
                  <input
                      id={"email"}
                      type={"email"}
                      placeholder={"Enter your email address"}
                      className={"text-sm font-light w-full p-2.5 rounded-lg ring-1 ring-gray-300 focus:shadow-md focus:outline-none tracking-wide"}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                  />
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-2">
                  <label htmlFor="password" className="text-sm">Password</label>
                  <div className="relative">
                      <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a secure password"
                          className="text-sm font-light w-full p-2.5 rounded-lg ring-1 ring-gray-300 focus:ring-2 focus:shadow-md focus:outline-none tracking-wide"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required
                      />
                      <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 grid w-10 place-items-center text-gray-400 hover:text-blue-500 cursor-pointer"
                      >
                          {showPassword ? <VisibilityOffIcon style={{ fontSize: 20 }} /> : <VisibilityIcon style={{ fontSize: 20 }} />}
                      </button>
                  </div>
              </div>

              {/* Create Account Button */}
              <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white p-2.5 rounded-full font-light text-sm mt-2 hover:bg-blue-500 transition duration-400 cursor-pointer disabled:opacity-50"
              >
                  {loading ? 'Creating Account...' : 'Create Account'}
              </button>
          </form>

          {/* Divider */}
          <div className="flex flex-row justify-center items-center w-full mt-4">
              <span className="flex-1 border-t border-[1.5px] border-gray-200"></span>
              <div className="px-4 font-light text-xs whitespace-nowrap text-gray-400">or Sign Up With</div>
              <span className="flex-1 border-t border-[1.5px] border-gray-200"></span>
          </div>

          {/* OAuth Options */}
          <div className="flex flex-row justify-center items-center w-full mt-4 gap-4">
              <div className="flex-1 rounded-full bg-gray-900 text-white p-3 flex justify-center items-center gap-2 hover:bg-gray-800 transition duration-400 cursor-pointer">
                  <GoogleIcon fontSize="small" style={{color: "white"}} />
                  <span className="text-[12px] lg:text-sm m-0 leading-none">Google</span>
              </div>
              <div className="flex-1 rounded-full bg-gray-900 text-white p-3 flex justify-center items-center gap-2 hover:bg-gray-800 transition duration-400 cursor-pointer">
                  <AppleIcon fontSize="small" style={{color: "white"}} />
                  <span className="text-[12px] lg:text-sm m-0 leading-none">Apple</span>
              </div>
          </div>

          {/* Login Route */}
          <div className="flex flex-row justify-center items-center w-full gap-1 mt-4">
              <p className="text-[12px] lg:text-sm text-gray-500 font-light">Already have an account?</p>
              <a href="/login" className="text-blue-600 text-[12px] lg:text-sm hover:text-yellow-500 transition duration-400 cursor-pointer">Sign In</a>
          </div>

      </AuthLayout>
    );
}