import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ListTree,
  ShoppingCart,
  Users,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <nav className="mt-6">
          <Link
            href="/admin/dashboard"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            <LayoutDashboard className="inline-block w-5 h-5 mr-2" />
            Dashboard
          </Link>
          <Link
            href="/admin/dashboard/products"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            <Package className="inline-block w-5 h-5 mr-2" />
            Products
          </Link>
          <Link
            href="/admin/dashboard/categories"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            <ListTree className="inline-block w-5 h-5 mr-2" />
            Categories
          </Link>
          <Link
            href="/admin/dashboard/orders"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            <ShoppingCart className="inline-block w-5 h-5 mr-2" />
            Orders
          </Link>
          <Link
            href="/admin/dashboard/customers"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            <Users className="inline-block w-5 h-5 mr-2" />
            Customers
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
