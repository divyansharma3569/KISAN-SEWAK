import { useState } from "react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/features/userSlice";
import { axiosInstance } from "../../axios.config";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../LangaugeSelector";
import { useTranslation } from "react-i18next";
import logo from "../../assets/images/Kisan-Sewak.png";
import { MdArrowForward } from "react-icons/md";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigation = [
    { name: t("description.nav.0"), href: "/", icon: "🏠" },
    { name: t("description.nav.1"), href: "/dashboard", icon: "📊" },
    {
      name: t("description.nav.2"),
      href: "/disease-detection",
      icon: "🔍",
    },
    { name: t("description.nav.3"), href: "/teleconsulting", icon: "📞" },
  ];

  const handleLogout = async () => {
    await axiosInstance
      .get("/auth/logout")
      .then(() => {
        dispatch(logout());
      })
      .catch((error) => {
        console.log(error.response);
      });
    navigate("/");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 backdrop-blur-sm border border-amber-200/20"
        >
          {sidebarOpen ? (
            <XIcon className="w-6 h-6" />
          ) : (
            <MenuIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 lg:w-64 lg:relative lg:translate-x-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-amber-200/10 transform transition-transform duration-300 z-40 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="pl-4 pr-4 py-4 flex items-center gap-3 border-b border-amber-200/10 flex-shrink-0">
          <Link to="/" onClick={() => setSidebarOpen(false)} className="flex-shrink-0">
            {/* Clean sizing: h-16 w-16 gives a large but manageable size, with scale-110 to reduce the image's internal transparent padding without overlapping */}
            <img src={logo} alt="Kisan Sewak Logo" className="h-10 w-10 object-contain transform scale-110" />
          </Link>
          <span className="text-xl font-bold text-amber-200 whitespace-nowrap">Kisan Sewak</span>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-4 py-8">
          <div className="space-y-3">
            {navigation.map((item, key) => {
              if (!user && key > 1) return null;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-amber-500/20 text-amber-200 border-l-2 border-amber-300"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/30"
                    }`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section - Fixed */}
        <div className="flex-shrink-0 p-6 border-t border-amber-200/10 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent">
          <div className="mb-4">
            <LanguageSelector />
          </div>
          
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/30 rounded-lg">
                <img
                  className="h-8 w-8 rounded-full"
                  src={
                    user.avatar ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  }
                  alt="User"
                />
                <span className="text-sm text-slate-200 truncate">
                  {user?.username || "User"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-amber-200 hover:bg-amber-500/20 rounded-lg transition-colors"
              >
                {t("description.nav.5")}
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-amber-500 text-slate-950 rounded-lg font-medium hover:bg-amber-400 transition-colors"
            >
              {t("description.nav.6")}
              <MdArrowForward />
            </Link>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
