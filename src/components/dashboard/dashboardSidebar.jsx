import { auth } from "@/lib/auth";
import { Bars } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  FileText,
  CreditCard,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import Logo from "@/components/Logo";

export default async function DashboardSidebar() {
  // Retrieve session data server-side
  const headerList = await headers();
  const session = await auth.api.getSession({
    headers: headerList,
  });

  // Extract the current path for active link highlighting
  const currentPath = headerList.get("x-url") || "";

  const user = session?.user;
  const role = user?.role;

  // Context-specific refined icon routing mappings
  const dashboardItems = {
    freelancer: [
      {
        icon: LayoutDashboard,
        label: "Overview",
        link: "/dashboard/freelancer",
      },
      {
        icon: ShoppingBag,
        label: "Browse Tasks",
        link: "/dashboard/freelancer/tasks",
      },
      {
        icon: Wallet,
        label: "My Proposals",
        link: "/dashboard/freelancer/proposals",
      },
      {
        icon: Wallet,
        label: "Active Projects",
        link: "/dashboard/freelancer/projects",
      },
        {
        icon: Wallet,
        label: "Earnings",
        link: "/dashboard/freelancer/earnings",
      },
      {
        icon: Wallet,
        label: "Edit Profile",
        link: "/dashboard/freelancer/profile",
      },
    ],
    client: [
      { icon: LayoutDashboard, label: "Overview", link: "/dashboard/client" },
      { icon: Briefcase, label: "My Tasks", link: "/dashboard/client/tasks" },
      {
        icon: PlusCircle,
        label: "Post Task",
        link: "/dashboard/client/tasks/new",
      },
      {
        icon: FileText,
        label: "Proposals",
        link: "/dashboard/client/proposals",
      },
      {
        icon: CreditCard,
        label: "Payments",
        link: "/dashboard/client/payments",
      },
    ],
    admin: [
      { icon: LayoutDashboard, label: "Overview", link: "/dashboard/admin" }, // Fallback placeholder path preserved
      { icon: Users, label: "User Manage", link: "/dashboard/admin/users" },
      { icon: Users, label: "Task Manage", link: "/dashboard/admin/tasks" },
      { icon: Users, label: "Total Transaction", link: "/dashboard/admin/transactions" },
    ],
  };

  const navItems = dashboardItems[role] || [];

  return (
    <Drawer>
      {/* Drawer trigger button hidden on desktop workspace monitors */}
      <Button className="hidden" variant="secondary">
        <Bars />
        Menu
      </Button>

      {/* Primary Sidebar Container */}
      <nav className="flex flex-col gap-1 w-[240px] min-h-screen bg-[#262626] border-r border-neutral-800 text-neutral-200">
        {/* Brand Header */}
        <div className="border-b border-neutral-800 flex items-center px-6 py-4">
          <Logo />
        </div>

        {/* Dynamic Navigation Map */}
        <div className="flex flex-col gap-1.5 px-3 pt-4">
          {navItems.map((item) => {
            // Evaluates exact route path matches or child route matching states
            const isActive =
              currentPath === item.link ||
              currentPath.startsWith(`${item.link}/`);

            return (
              <Link key={item.label} href={item.link} className="w-full">
                <button
                  type="button"
                  className={`flex w-full items-center gap-3.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 group outline-none
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-900/10"
                        : "text-neutral-400 hover:bg-[#212121] hover:text-white"
                    }`}
                >
                  <item.icon
                    size={18}
                    className={`shrink-0 transition-colors duration-150
                      ${
                        isActive
                          ? "text-white"
                          : "text-neutral-500 group-hover:text-neutral-300"
                      }`}
                  />
                  <span>{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop / Responsive Mobile Overlay Drawers */}
      <Drawer.Backdrop>
        <Drawer.Content
          placement="left"
          className="bg-[#262626] text-neutral-200 border-r border-neutral-800"
        >
          <Drawer.Dialog>
            <Drawer.CloseTrigger className="text-neutral-400 hover:text-white" />
            <Drawer.Header className="border-b border-neutral-800">
              <Drawer.Heading className="text-white text-base font-semibold">
                Navigation
              </Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body className="px-3 py-4">
              <nav className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const isActive =
                    currentPath === item.link ||
                    currentPath.startsWith(`${item.link}/`);

                  return (
                    <Link key={item.label} href={item.link} className="w-full">
                      <button
                        type="button"
                        className={`flex w-full items-center gap-3.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 group
                          ${
                            isActive
                              ? "bg-blue-600 text-white"
                              : "text-neutral-400 hover:bg-[#212121] hover:text-white"
                          }`}
                      >
                        <item.icon
                          size={18}
                          className={
                            isActive
                              ? "text-white"
                              : "text-neutral-500 group-hover:text-neutral-300"
                          }
                        />
                        <span>{item.label}</span>
                      </button>
                    </Link>
                  );
                })}
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
