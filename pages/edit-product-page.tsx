import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { UpdateProduct, Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MainLayout } from "@/components/layout/sidebar";
import { ProductForm } from "@/components/product/product-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const productId = parseInt(params.id);

  // Fetch product details
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !isNaN(productId),
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (productData: UpdateProduct) => {
      const res = await apiRequest("PATCH", `/api/products/${productId}`, productData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Product Updated",
        description: "Your product has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}`] });
      setLocation("/products");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update product: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: UpdateProduct) => {
    updateProductMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout>
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
            <h1 className="text-2xl font-bold">Error Loading Product</h1>
            <p className="text-red-500">
              {error instanceof Error ? error.message : "An unknown error occurred"}
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
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
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">
            Update your product information
          </p>
        </div>

        {product && (
          <ProductForm
            defaultValues={product}
            onSubmit={handleSubmit}
            isSubmitting={updateProductMutation.isPending}
          />
        )}
      </div>
    </MainLayout>
  );
}
