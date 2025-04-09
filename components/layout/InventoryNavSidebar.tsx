import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Package2,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  SunMoon,
  Settings,
  ChevronDown,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const menuItems = [
    {
      title: "Products",
      path: "/products",
      icon: <Package2 className="h-5 w-5" />,
    },
    {
      title: "Add Product",
      path: "/products/add",
      icon: <PlusCircle className="h-5 w-5" />,
    },
    {
      title: "Profile",
      path: "/profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  const NavItems = () => (
    <div className="space-y-1">
      {menuItems.map((item) => (
        <Link href={item.path} key={item.path}>
          <Button
            variant={location === item.path ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setOpen(false)}
          >
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </Button>
        </Link>
      ))}
      <Button
        variant="ghost"
        className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5" />
        <span className="ml-2">Logout</span>
      </Button>
    </div>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-16 border-b bg-white">
        <div className="flex items-center">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex items-center h-16 px-4 border-b">
                <Link href="/">
                  <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent hover:brightness-110 cursor-pointer transition-all duration-200">InvenTrack Pro</h2>
                </Link>
              </div>
              <div className="px-4 py-4">
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/">
            <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent hover:brightness-110 cursor-pointer transition-all duration-200">InvenTrack Pro</h1>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="rounded-full">
            <SunMoon className="h-5 w-5" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random`} alt={user?.username || 'User'} />
                  <AvatarFallback>
                    {user?.username ? getInitials(user.username) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || "No email set"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onSelect={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:z-50 md:border-r md:bg-white">
        <div className="flex items-center h-16 px-4 border-b">
          <Link href="/">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent hover:brightness-110 cursor-pointer transition-all duration-200">InvenTrack Pro</h2>
          </Link>
        </div>
        <div className="flex-1 px-4 py-4 overflow-auto">
          <NavItems />
        </div>
        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-start p-2 hover:bg-gray-100 rounded-lg">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random`} alt={user?.username || 'User'} />
                  <AvatarFallback>
                    {user?.username ? getInitials(user.username) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 overflow-hidden flex-1 text-left">
                  <p className="text-sm font-medium">{user?.username}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "No email set"}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-56">
              <Link href="/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout} className="text-red-500 focus:text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDJhMTggMTggMCAwIDEgMCAzNiAxOCAxOCAwIDAgMSAwLTM2eiIvPjwvZz48L2c+PC9zdmc+')]">
      <Sidebar />
      <div className="md:pl-64 pt-16 md:pt-0">
        <main className="min-h-[calc(100vh-4rem)] p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
