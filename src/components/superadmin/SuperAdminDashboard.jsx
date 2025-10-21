import { useState, useEffect } from "react";
import {
  Building2,
  UserPlus,
  BarChart3,
  Home,
  Menu,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import api from "../../lib/api";
import Layout from "../screens/Layout";

export  function SuperAdminDashboard() {
  const [companies, setCompanies] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [inviteForm, setInviteForm] = useState({
    email: "",
    companyName: "",
    name: "",
  });

  // 🔹 Fetch Companies + Dashboards
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [companiesRes, dashboardsRes] = await Promise.all([
        api.get("/superadmin/companies"),
        api.get("/superadmin/dashboards"),
      ]);

      const companiesData = Array.isArray(companiesRes.data.data?.companies)
        ? companiesRes.data.data.companies.map((c) => ({
            _id: c._id,
            name: c.name,
            adminEmail: c.createdBy?.email || "N/A",
            adminName: c.createdBy?.name || "N/A",
            createdAt: c.createdAt,
          }))
        : [];

      const dashboardsData = Array.isArray(dashboardsRes.data.data)
        ? dashboardsRes.data.data
        : [];

      setCompanies(companiesData);
      setDashboards(dashboardsData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Invite Admin
  const handleInviteAdmin = async (e) => {
    e.preventDefault();
    setError("");
    setInviteLoading(true);
    try {
      await api.post("/superadmin/invite-admin", inviteForm);
      setInviteSuccess(true);
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteSuccess(false);
        setInviteForm({ email: "", companyName: "", name: "" });
        fetchData();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send invitation");
    } finally {
      setInviteLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex   min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div
          className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-blue-600">Super Admin</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 p-4">
            {[
              { key: "overview", label: "Overview", icon: Home },
              { key: "companies", label: "Companies", icon: Building2 },
              { key: "dashboards", label: "Dashboards", icon: BarChart3 },
              { key: "invite", label: "Invite Admin", icon: UserPlus },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  if (item.key === "invite") setShowInviteModal(true);
                  else setActiveTab(item.key);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.key
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between bg-white px-6 py-4 border-b shadow-sm">
            <button
              className="md:hidden text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">
              {activeTab === "overview"
                ? "Dashboard Overview"
                : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </header>

          {/* Dashboard Overview */}
          <main className="p-6">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow p-6 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Companies</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {companies.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Dashboards</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {dashboards.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white flex flex-col justify-between">
                  <p className="text-blue-100 mb-3">Add New Company</p>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50"
                  >
                    <UserPlus className="w-5 h-5" /> Invite Admin
                  </button>
                </div>
              </div>
            )}

            {/* Companies Tab */}
            {activeTab === "companies" && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Companies
                </h2>
                {companies.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No companies yet
                  </p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {companies.map((c) => (
                      <div
                        key={c._id}
                        className="py-4 flex items-center justify-between hover:bg-gray-50 px-2 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{c.name}</p>
                          <p className="text-sm text-gray-600">
                            {c.adminName} — {c.adminEmail}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Dashboards Tab */}
            {activeTab === "dashboards" && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Recent Dashboards
                </h2>
                {dashboards.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No dashboards yet
                  </p>
                ) : (
                  dashboards.slice(0, 5).map((d) => (
                    <div
                      key={d._id}
                      className="p-4 mb-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <h3 className="font-semibold text-gray-900">
                        {d.title || "Untitled Dashboard"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {d.description || "No description"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Invite Company Admin
            </h2>

            {inviteSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <p className="font-semibold text-gray-900">
                  Invitation Sent!
                </p>
                <p className="text-gray-600">
                  The admin will receive an email to set up their account.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInviteAdmin} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={inviteForm.companyName}
                    onChange={(e) =>
                      setInviteForm({
                        ...inviteForm,
                        companyName: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Name
                  </label>
                  <input
                    type="text"
                    value={inviteForm.name}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInviteModal(false);
                      setError("");
                      setInviteForm({ email: "", companyName: "", name: "" });
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {inviteLoading ? "Sending..." : "Send Invite"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
