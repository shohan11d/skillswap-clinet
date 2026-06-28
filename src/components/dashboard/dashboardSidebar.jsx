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
  FolderKanban,
  UserPen,
  ReceiptText,
  ListChecks,
  BadgeDollarSign,
  ShieldCheck,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import Logo from "@/components/Logo";

export default async function DashboardSidebar() {
  const headerList = await headers();
  const session = await auth.api.getSession({
    headers: headerList,
  });

  const currentPath = headerList.get("x-url") || "";

  const user = session?.user;
  const role = user?.role;

  const dashboardItems = {
    freelancer: [
      { icon: LayoutDashboard, label: "Overview",       link: "/dashboard/freelancer" },
      { icon: ShoppingBag,     label: "Browse Tasks",   link: "/dashboard/freelancer/tasks" },
      { icon: FileText,        label: "My Proposals",   link: "/dashboard/freelancer/proposals" },
      { icon: FolderKanban,    label: "Active Projects",link: "/dashboard/freelancer/projects" },
      { icon: BadgeDollarSign, label: "Earnings",       link: "/dashboard/freelancer/earnings" },
      { icon: UserPen,         label: "Edit Profile",   link: "/dashboard/freelancer/profile" },
    ],
    client: [
      { icon: LayoutDashboard, label: "Overview",  link: "/dashboard/client" },
      { icon: Briefcase,       label: "My Tasks",  link: "/dashboard/client/tasks" },
      { icon: PlusCircle,      label: "Post Task", link: "/dashboard/client/tasks/new" },
      { icon: ListChecks,      label: "Proposals", link: "/dashboard/client/proposals" },
      { icon: CreditCard,      label: "Payments",  link: "/dashboard/client/payments" },
    ],
    admin: [
      { icon: LayoutDashboard, label: "Overview",          link: "/dashboard/admin" },
      { icon: Users,           label: "User Manage",       link: "/dashboard/admin/users" },
      { icon: ShieldCheck,     label: "Task Manage",       link: "/dashboard/admin/tasks" },
      { icon: ReceiptText,     label: "Transactions",      link: "/dashboard/admin/transactions" },
    ],
  };

  const navItems = dashboardItems[role] || [];

  return (
    <Drawer>
      <Button className="hidden" variant="secondary">
        <Bars />
        Menu
      </Button>

      <nav className="flex flex-col gap-1 w-[240px] min-h-screen bg-[#262626] border-r border-neutral-800 text-neutral-200">
        <div className="border-b border-neutral-800 flex items-center px-6 py-4">
          <Logo />
        </div>

        <div className="flex flex-col gap-1.5 px-3 pt-4">
          {navItems.map((item) => {
            const isActive =
              currentPath === item.link ||
              currentPath.startsWith(`${item.link}/`);

            return (
              <Link key={item.label} href={item.link} className="w-full">
                <button
                  type="button"
                  className={`flex w-full items-center gap-3.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 group outline-none
                    ${isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/10"
                      : "text-neutral-400 hover:bg-[#212121] hover:text-white"
                    }`}
                >
                  <item.icon
                    size={18}
                    className={`shrink-0 transition-colors duration-150
                      ${isActive
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
                          ${isActive
                            ? "bg-blue-600 text-white"
                            : "text-neutral-400 hover:bg-[#212121] hover:text-white"
                          }`}
                      >
                        <item.icon
                          size={18}
                          className={isActive
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