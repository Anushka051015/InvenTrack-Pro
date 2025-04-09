import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { InsertProduct } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AppLayout } from "@/layout/AppLayout";
import { ProductForm } from "@/components/product/product-form";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddProductPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const addProductMutation = useMutation({
    mutationFn: async (productData: InsertProduct) => {
      const res = await apiRequest("POST", "/api/products", productData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Product Added",
        description: "Your product has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setLocation("/products");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to add product: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertProduct) => {
    addProductMutation.mutate(data);
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/products")}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">
            Create a new product in your inventory
          </p>
        </div>

        <ProductForm
          onSubmit={handleSubmit}
          isSubmitting={addProductMutation.isPending}
        />
      </div>
    </AppLayout>
  );
}