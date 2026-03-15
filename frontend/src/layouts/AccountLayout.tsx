import { Link, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { to: "profile", label: "Profile" },
  { to: "orders", label: "Order History" },
  { to: "change-password", label: "Change Password" },
];

const AccountLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex gap-8 min-h-[60vh]">
      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0">
        <nav className="space-y-1">
          {navItems.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname.includes(to)
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AccountLayout;
