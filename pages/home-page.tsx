import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Package2, Plus, User, Filter, BarChart4, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // We're no longer redirecting automatically - let users explore the home page
  // The automatic redirect has been removed to improve user experience

  return (
    <AppLayout>
      {/* Hero Section with Wave Pattern Background */}
      <div className="wave-pattern py-16 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="page-header mb-10 text-center">
            <h1 className="text-5xl font-bold mb-6">Welcome to <span className="gradient-text">InvenTrack Pro</span></h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your all-in-one inventory management solution for modern businesses
            </p>
            
            <div className="mt-10 flex justify-center">
              <Button 
                onClick={() => setLocation('/products')}
                variant="default" 
                className="rounded-full text-lg px-8 py-6 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 shadow-md"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 animate-fade-in">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 -mt-16">
          <div className="highlight-card bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/10 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Package2 className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Manage Products</h3>
                  <p className="text-muted-foreground">View, filter, and organize your inventory</p>
                </div>
              </div>
              <Button 
                onClick={() => setLocation('/products')}
                variant="default" 
                className="w-full rounded-full bg-gradient-to-r from-primary to-indigo-600 hover:shadow-md transition-all mt-4"
              >
                Browse Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="highlight-card bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/10 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Plus className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Add New Product</h3>
                  <p className="text-muted-foreground">Create and add new products</p>
                </div>
              </div>
              <Button 
                onClick={() => setLocation('/products/add')}
                variant="default" 
                className="w-full rounded-full bg-gradient-to-r from-primary to-indigo-600 hover:shadow-md transition-all mt-4"
              >
                Create Product
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="highlight-card bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/10 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Profile Settings</h3>
                  <p className="text-muted-foreground">Manage account settings</p>
                </div>
              </div>
              <Button 
                onClick={() => setLocation('/profile')}
                variant="default" 
                className="w-full rounded-full bg-gradient-to-r from-primary to-indigo-600 hover:shadow-md transition-all mt-4"
              >
                View Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Features Section with Dot Pattern */}
        <div className="dot-pattern rounded-2xl p-10 mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Key Features of <span className="gradient-text">InvenTrack Pro</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Designed to streamline your inventory workflow with powerful tools and intuitive interfaces
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="bg-primary/20 p-3 rounded-full mr-4">
                  <Package2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl">Intelligent Product Management</h3>
              </div>
              <p className="text-muted-foreground ml-[60px]">
                Create, update, and track your product inventory with our intuitive dashboard and real-time updates.
              </p>
            </div>
            
            <div className="glass-card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="bg-primary/20 p-3 rounded-full mr-4">
                  <Filter className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl">Advanced Filtering & Search</h3>
              </div>
              <p className="text-muted-foreground ml-[60px]">
                Quickly locate products with powerful search and filtering options by category, price range, and custom attributes.
              </p>
            </div>
            
            <div className="glass-card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="bg-primary/20 p-3 rounded-full mr-4">
                  <BarChart4 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl">Analytics Dashboard</h3>
              </div>
              <p className="text-muted-foreground ml-[60px]">
                Gain valuable insights with comprehensive analytics on your inventory, sales trends, and product performance.
              </p>
            </div>
            
            <div className="glass-card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="bg-primary/20 p-3 rounded-full mr-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl">Enterprise-Grade Security</h3>
              </div>
              <p className="text-muted-foreground ml-[60px]">
                Built with secure authentication, data encryption, and persistent storage to keep your inventory data safe.
              </p>
            </div>
          </div>
        </div>
        
        {/* Welcome Back Card with Call-to-Action */}
        <div className="glass-card p-8 mb-16 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-full mb-6">
            <User className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-3">
            Welcome back, <span className="gradient-text">{user?.username}</span>!
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Ready to manage your inventory? Access all your products with a single click.
          </p>
          <Button 
            onClick={() => setLocation('/products')} 
            className="rounded-full bg-gradient-to-r from-primary to-indigo-600 px-8 py-6 text-lg hover:shadow-lg transition-all"
          >
            Go to My Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
