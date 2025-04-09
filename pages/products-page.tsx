import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Product, ProductFilter } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AppLayout } from "@/layout/AppLayout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ProductFilterBar } from "@/components/product/product-filter";
import { useToast } from "@/hooks/use-toast";
import { Plus, Star, Loader2, Package2, ArrowRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProductsPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<ProductFilter>({});
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

  // Fetch products with filters
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["/api/products", filters],
    queryFn: async ({ queryKey }) => {
      const [path, filterParams] = queryKey;
      const url = new URL(path as string, window.location.origin);
      
      // Add filter parameters to URL
      Object.entries(filterParams as ProductFilter).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
      
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
      setDeleteProductId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete product: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Column definitions for the data table
  const columns = [
    {
      header: "Product",
      accessor: (product: Product) => (
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-4">
            {product.imageUrl ? (
              <AvatarImage src={product.imageUrl} alt={product.name} />
            ) : (
              <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-muted-foreground truncate max-w-xs">
              {product.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      className: "capitalize",
    },
    {
      header: "Price",
      accessor: (product: Product) => `$${product.price.toFixed(2)}`,
    },
    {
      header: "Rating",
      accessor: (product: Product) => (
        <div className="flex items-center">
          <div className="flex text-yellow-400 mr-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(product.rating)
                    ? "fill-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating.toFixed(1)}
          </span>
        </div>
      ),
    },
  ];

  // Actions for the data table
  const actions = [
    {
      label: "Edit",
      onClick: (product: Product) => setLocation(`/products/edit/${product.id}`),
      variant: "outline" as const,
    },
    {
      label: "Delete",
      onClick: (product: Product) => setDeleteProductId(product.id),
      variant: "destructive" as const,
    },
  ];

  const handleFilterChange = (newFilters: ProductFilter) => {
    setFilters(newFilters);
  };

  return (
    <AppLayout>
      <div className="dot-pattern rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-3">
              <Package2 className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">My Products</h1>
            <p className="text-muted-foreground">Manage and organize your product inventory</p>
          </div>
          <Button 
            onClick={() => setLocation("/products/add")} 
            size="lg"
            className="rounded-full bg-gradient-to-r from-primary to-indigo-600 shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>
      </div>

      <div className="glass-card p-4 mb-6">
        <ProductFilterBar
          onFilterChange={handleFilterChange}
          initialFilters={filters}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="glass-card p-10 text-center text-red-500">
          Error loading products. Please try again later.
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden border border-border/50">
          <DataTable
            data={products}
            columns={columns}
            actions={actions}
            emptyMessage="No products found. Try adjusting your filters or add new products."
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={deleteProductId !== null} 
        onOpenChange={(open) => !open && setDeleteProductId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProductId && deleteProductMutation.mutate(deleteProductId)}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteProductMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
