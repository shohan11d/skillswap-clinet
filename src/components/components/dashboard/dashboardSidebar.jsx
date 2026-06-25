import { auth } from "@/lib/auth";
import {
  Bars,
  Bell,
  Envelope,
  Gear,
  House,
  Magnifier,
  Person,
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { ChartArea, User2 } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { BiMoney } from "react-icons/bi";
import { TbAsset } from "react-icons/tb";
import Logo from "../Logo";

export default async function DashboardSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const role = user?.role || "client";
  console.log(user)
  const daashboardItems = {
    freelancer: [
      { icon: ChartArea, label: "Overview", link: "/dashboard/freelancer" },
      { icon: TbAsset, label: "Products", link: "/dashboard/freelancer/products" },
      {
        icon: BiMoney,
        label: "Transaction",
        link: "/dashboard/freelancer/transaction",
      },
    ],

    client: [
      { icon: ChartArea, label: "Overview", link: "/dashboard/client" },
      { icon: TbAsset, label: "My Tasks", link: "/dashboard/client/tasks" },
      { icon: TbAsset, label: "Post Task", link: "/dashboard/client/posttask" },
      { icon: TbAsset, label: "Proposals", link: "/dashboard/client/proposals" },
      {
        icon: BiMoney,
        label: "Payments",
        link: "/dashboard/client/transaction",
      },
    ],

    admin: [
      { icon: ChartArea, label: "Overview", link: "/dashboard/client" },
      { icon: User2, label: "User Manage", link: "/dashboard/client/products" },
      {
        icon: BiMoney,
        label: "Transaction",
        link: "/dashboard/client/transaction",
      },
    ],
  };

  const navItems = daashboardItems[role];

  //   console.log(navItems)
  // //   const navItems = [
  // //     { icon: House, label: "Home" },
  // //     { icon: Magnifier, label: "Search" },
  // //     { icon: Bell, label: "Notifications" },
  // //     { icon: Envelope, label: "Messages" },
  // //     { icon: Person, label: "Profile" },
  // //     { icon: Gear, label: "Settings" },
  // //   ];

  return (
    <Drawer>
      <Button className={"hidden "} variant="secondary">
        <Bars />
        Menu
      </Button>

      <nav className="flex flex-col gap-1 w-[200px] border border-right-1">
        <div className="border-b flex items-center  px-6 py-2">
          <Logo height={50} width={50}/>

        </div>

        {navItems.map((item) => (
          <Link key={item.label} href={item.link}>
            <button
              key={item.label}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
              type="button"
            >
              <item.icon className="size-5 text-yellow-400" />
              {item.label}
            </button>
          </Link>
        ))}
      </nav>

      <Drawer.Backdrop>
        <Drawer.Content placement="left">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>Navigation</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link key={item.label} href={item.link}>
                    <button
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                      type="button"
                    >
                      <item.icon className="size-5 text-muted" />
                      {item.label}
                    </button>
                  </Link>
                ))}
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
