import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { Redirect } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package2 } from "lucide-react";

// Extended schema for client-side validation
const loginSchema = insertUserSchema.extend({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Extending for registration with password confirmation
const registerSchema = insertUserSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login form setup
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form setup
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...rest } = data;
    registerMutation.mutate(rest);
  };

  // If user is already logged in, redirect to products page
  if (user) {
    return <Redirect to="/products" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Hero Section - Right on large screens */}
      <div className="flex-1 flex flex-col justify-center p-8 text-center lg:text-left lg:max-w-2xl bg-primary text-white">
        <div className="max-w-md mx-auto lg:mx-0">
          <div className="flex justify-center lg:justify-start mb-6">
            <Package2 className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold mb-4">ProductHub</h1>
          <p className="text-xl mb-6">
            The comprehensive product management solution for businesses of all sizes
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white/20">
                ✓
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">Easy Product Management</h3>
                <p className="mt-1 text-white/70">
                  Create, update, and manage your product catalog with ease
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white/20">
                ✓
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">Powerful Search & Filtering</h3>
                <p className="mt-1 text-white/70">
                  Find products quickly with advanced filtering options
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white/20">
                ✓
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">Secure Authentication</h3>
                <p className="mt-1 text-white/70">
                  Your product data is safe with our secure JWT authentication
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Forms - Left on large screens */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {activeTab === "login" ? "Sign in to your account" : "Create an account"}
            </CardTitle>
            <CardDescription>
              {activeTab === "login"
                ? "Enter your credentials to access your account"
                : "Fill out the form to create a new account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Signing in..." : "Sign in"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit"
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating account..." : "Create account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
