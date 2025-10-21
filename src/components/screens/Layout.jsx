// import { useState } from "react";
// import { useAuth } from "../AuthContext";
// import {
//   BarChart3,
//   LayoutDashboard,
//   Users,
//   Building2,
//   LogOut,
//   Menu,
//   X,
//   User,
//   FileText,
// } from "lucide-react";

// export default function Layout({ children }) {
//   const { user, logout } = useAuth();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const navigation = (user) => [
//     { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "ADMIN", "USER"] },
//     ...(user?.role === "SUPER_ADMIN"
//       ? [
//           { name: "Manage Companies", href: "/superadmin", icon: Building2 },
//           { name: "Reports", href: "/view-report/1", icon: FileText },
//         ]
//       : []),
//     ...(user?.role === "ADMIN"
//       ? [
//           { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
//           { name: "Users", href: "/users", icon: Users },
//           { name: "Analytics", href: "/view-dashboard/1", icon: BarChart3 },
//         ]
//       : []),
//     ...(user?.role === "USER"
//       ? [
//           { name: "User Dashboard", href: "/user", icon: LayoutDashboard },
//           { name: "Reports", href: "/view-report/1", icon: FileText },
//         ]
//       : []),
//   ];

//   const getRoleBadge = (role) => {
//     const badges = {
//       SUPER_ADMIN: "bg-red-100 text-red-700 border-red-200",
//       ADMIN: "bg-blue-100 text-blue-700 border-blue-200",
//       USER: "bg-green-100 text-green-700 border-green-200",
//     };
//     return badges[role?.toUpperCase()] || badges.USER;
//   };

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       {/* Sidebar (mobile + desktop) */}
//       <aside
//         className={`fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-slate-200 z-50 transform transition-transform lg:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="flex flex-col h-full">
//           <div className="p-6 border-b border-slate-200 flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
//               <BarChart3 className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="font-bold text-slate-900">PowerBI Portal</h1>
//               <p className="text-xs text-slate-500">Dashboard Sharing</p>
//             </div>
//           </div>

//           <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
//             {navigation(user).map((item) => {
//               const Icon = item.icon;
//               const isActive = window.location.pathname === item.href;
//               return (
//                 <a
//                   key={item.name}
//                   href={item.href}
//                   onClick={() => setSidebarOpen(false)}
//                   className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                     isActive
//                       ? "bg-blue-50 text-blue-700 font-medium"
//                       : "text-slate-700 hover:bg-slate-50"
//                   }`}
//                 >
//                   <Icon className="w-5 h-5" />
//                   <span>{item.name}</span>
//                 </a>
//               );
//             })}
//           </nav>

//           <div className="p-4 border-t border-slate-200">
//             <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg mb-3">
//               <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
//                 <User className="w-5 h-5 text-slate-600" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-slate-900 truncate">
//                   {user?.name}
//                 </p>
//                 <p className="text-xs text-slate-500 truncate">{user?.email}</p>
//               </div>
//             </div>
//             <div className="flex items-center justify-between mb-3">
//               <span
//                 className={`text-xs px-3 py-1 rounded-full border font-medium ${getRoleBadge(
//                   user?.role
//                 )}`}
//               >
//                 {user?.role?.toUpperCase()}
//               </span>
//               {user?.companyName && (
//                 <span className="text-xs text-slate-500 truncate">
//                   {user.companyName}
//                 </span>
//               )}
//             </div>
//             <button
//               onClick={logout}
//               className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
//             >
//               <LogOut className="w-4 h-4" />
//               <span className="font-medium">Sign Out</span>
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Mobile topbar */}
//       <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-40">
//         <div className="flex items-center justify-between p-4">
//           <div className="flex items-center gap-2">
//             <BarChart3 className="w-6 h-6 text-blue-600" />
//             <span className="font-bold text-slate-900">PowerBI Portal</span>
//           </div>
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
//           >
//             {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main content */}
//       <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 overflow-y-auto">
//         <div className="p-4 sm:p-6">{children}</div>
//       </main>
//     </div>
//   );
// }
import { useState } from "react";
import { useAuth } from "../AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation setup based on user role
  const navigation = (user) => [
    { name: "Dashboard", href: "/", roles: ["SUPER_ADMIN", "ADMIN", "USER"] },
    ...(user?.role === "SUPER_ADMIN"
      ? [
          { name: "Manage Companies", href: "/superadmin", roles: ["SUPER_ADMIN"] },
          { name: "Reports", href: "/view-report/1", roles: ["ADMIN"] },
        ]
      : []),
    ...(user?.role === "ADMIN"
      ? [
          { name: "Admin Dashboard", href: "/admin", roles: ["ADMIN"] },
          { name: "Users", href: "/users", roles: ["ADMIN"] },
          { name: "Analytics", href: "/view-dashboard/1", roles: ["ADMIN"] },
        ]
      : []),
    ...(user?.role === "USER"
      ? [
          { name: "User Dashboard", href: "/user", roles: ["USER"] },
          { name: "Reports", href: "/view-report/1", roles: ["USER"] },
        ]
      : []),
  ];

  // Role badge helper (returns class or type label)
  const getRoleBadge = (role) => {
    const badges = {
      superadmin: "SUPER_ADMIN",
      admin: "ADMIN",
      user: "USER",
    };
    return badges[role?.toLowerCase()] || "USER";
  };

  // Event handlers
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
  };

  // Return just the logic hooks and children render
  return (
    <>
      {/* Logic only — UI removed */}
      {children}
    </>
  );
}
