import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Menu, 
  ChevronDown, 
  LogOut, 
  User,
  Sun,
  Moon,
  Package2,
  LayoutDashboard,
  Plus,
  Settings
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";

// Helper function to get user initials
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Navigation menu items
const NavItems = () => {
  const [location] = useLocation();
  
  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5 mr-3" />
    },
    {
      name: "Products",
      href: "/products",
      icon: <Package2 className="h-5 w-5 mr-3" />
    },
    {
      name: "Add Product",
      href: "/products/add",
      icon: <Plus className="h-5 w-5 mr-3" />
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <Settings className="h-5 w-5 mr-3" />
    }
  ];
  
  return (
    <nav className="space-y-1">
      {navItems.map(item => {
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <div className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
              isActive 
                ? 'bg-primary text-white font-medium' 
                : 'text-foreground hover:bg-accent'
            }`}>
              {React.cloneElement(item.icon, { 
                className: `${item.icon.props.className} ${isActive ? 'text-white' : 'text-primary'}` 
              })}
              {item.name}
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export function MainNavigation() {
  const { user, logoutMutation } = useAuth();
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between h-16 px-4 border-b bg-background fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="mr-4">
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
          <Button variant="ghost" size="sm" className="rounded-full" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:z-50 md:border-r md:bg-background">
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
              <Button variant="ghost" className="w-full flex items-center justify-start p-2 hover:bg-accent rounded-lg">
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
              <DropdownMenuItem onSelect={toggleTheme}>
                {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                <span>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
              </DropdownMenuItem>
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