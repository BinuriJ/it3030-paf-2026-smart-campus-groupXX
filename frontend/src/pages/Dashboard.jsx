import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";
  const role = localStorage.getItem("role") || "student";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuItems = [
    {
      title: "Maintenance Tickets",
      desc: "Report issues and request facilities maintenance.",
      icon: "🎫",
      path: "/tickets",
      gradient: "from-amber-400 to-orange-500",
      roles: ["student", "lecturer", "admin", "technician"]
    },
    {
      title: "Resource Booking",
      desc: "Book lecture halls, labs, and equipment.",
      icon: "🏢",
      path: "/bookings",
      gradient: "from-blue-400 to-indigo-500",
      roles: ["student", "lecturer", "admin"]
    },
    {
      title: "Facilities Status",
      desc: "View availability and status of campus facilities.",
      icon: "📊",
      path: "/facilities",
      gradient: "from-emerald-400 to-teal-500",
      roles: ["student", "lecturer", "admin"]
    },
    {
      title: "System Admin",
      desc: "Manage users, approvals, and system settings.",
      icon: "🔐",
      path: "/admin",
      gradient: "from-rose-400 to-red-500",
      roles: ["admin"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Inter']">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">
                Smart Campus
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-slate-800">{userName}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 lowercase capitalize">{role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Good Morning, {userName}.</h1>
          <p className="mt-3 text-lg text-slate-500 font-medium">Welcome to your personalized campus portal. What would you like to do today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.filter(item => item.roles.includes(role)).map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer transform hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              <div className="mt-6 flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                Explore Module <span className="ml-1">→</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
