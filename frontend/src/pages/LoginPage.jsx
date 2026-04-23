import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !password.trim()) {
      alert("Please enter a username and password to continue.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/api/auth/login", {
        email: userName,
        password: password
      });

      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("userName", user.fullName);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("role", user.role.toLowerCase());

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] relative overflow-hidden font-['Inter']">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
        <div className="absolute top-[20%] -right-[10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 transform transition-all hover:scale-[1.01] duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 mb-6 shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Smart Campus</h2>
          <p className="text-gray-300 text-sm font-medium">Log in to manage your campus experience</p>
        </div>

        <form onSubmit={login} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-200 ml-1">Username / Email</label>
            <input
              type="text"
              placeholder="Enter your university ID"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-200 ml-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Sign In to Portal
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">Secure AES-256 Authentication Setup</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
