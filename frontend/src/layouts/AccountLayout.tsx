import { Link, Outlet } from "react-router-dom";

const AccountLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-6 border-r">
        <nav className="space-y-2">
          <Link
            to="profile"
            className="block px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Profile
          </Link>
          <Link
            to="orders"
            className="block px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Order History
          </Link>
          <Link
            to="change-password"
            className="block px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Change Password
          </Link>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AccountLayout;
