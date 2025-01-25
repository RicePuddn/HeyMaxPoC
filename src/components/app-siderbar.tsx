"use client";
import { useState, useEffect } from "react";
import { Calendar, Home, Inbox, Search, Settings, User2, Package, ShoppingCart } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const menuItems = {
  seller: [
    {
      title: "Dashboard",
      url: "/seller-dashboard",
      icon: Home,
    },
    {
      title: "Manage Products",
      url: "/seller-products",
      icon: Package,
    },
    {
      title: "Sales Report",
      url: "/seller-sales",
      icon: Calendar,
    },
  ],
  customer: [
    {
      title: "Home",
      url: "/customer-home",
      icon: Home,
    },
    {
      title: "Orders",
      url: "/customer-orders",
      icon: ShoppingCart,
    },
    {
      title: "Search",
      url: "/customer-search",
      icon: Search,
    },
  ],
};

export function AppSidebar() {
  const router = useRouter();

  // States for username and role
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Fetch username and role on the client side
  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setRole(localStorage.getItem("role"));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Determine the menu items to render based on the role
  const items = role === "seller" ? menuItems.seller : menuItems.customer;

  return (
    <Sidebar>
      <SidebarHeader>
        <img src="/img/logo.png" alt="Logo" className="mx-auto h-20" />
        <p className="text-center">
          <span className="text-green-200">Welcome</span>{" "}
          <span className="text-gray-400">back</span>
        </p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Applications</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {username || "Loading..."} {/* Fallback while fetching */}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}