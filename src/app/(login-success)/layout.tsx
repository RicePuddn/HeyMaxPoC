import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-siderbar";
import { CartProvider } from "@/context/cartContext";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full h-screen bg-slate-50">
          <div className="flex gap-3 items-center">
          </div>
          <CartProvider>{children}</CartProvider>
        </main>
        <Toaster/>
    </SidebarProvider>
  );
}