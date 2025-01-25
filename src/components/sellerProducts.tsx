"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl: string;
}

export default function SellerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formState, setFormState] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/display-food-by-seller-id");

        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
        } else {
          const data = await response.json();
          setError(data.error || "Failed to fetch products.");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Something went wrong. Please try again.");
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormState({
      name: product.name,
      quantity: product.quantity.toString(),
      price: product.price.toFixed(2),
      description: product.description,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/food/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== id));
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete product.");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!editingProduct) return;
  
    try {
      const response = await fetch(`/api/food/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          quantity: parseInt(formState.quantity, 10),
          price: parseFloat(formState.price), // Parse price to a float
          description: formState.description,
        }),
      });
  
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(
          products.map((product) =>
            product.id === editingProduct.id ? updatedProduct.product : product
          )
        );
        setEditingProduct(null);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update product.");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.length === 0 ? (
        <div className="col-span-full text-center">
          <img
            src="/img/logo.png"
            alt="No products"
            className="mx-auto h-80 w-80"
          />
          <p className="text-lg font-semibold text-gray-700 mt-4">
            Add some products to start selling!
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Your customers are hungry and waiting.
          </p>
          <Button
            className="mt-4 bg-green-600 hover:bg-green-700"
            onClick={() => {
              router.push("/seller-dashboard");
            }}
          >
            Add Product
          </Button>
        </div>
      ) : (
        products.map((product) => (
          <Card
            key={product.id}
            className="shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-lg"
          >
            <CardHeader>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-40 w-full object-cover rounded-t-md"
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-sm text-gray-500 mt-2">Quantity: {product.quantity}</p>
              <p className="text-sm text-gray-500 mt-2">Price: ${product.price.toFixed(2)}</p>
              <div className="mt-4 flex justify-between">
                <Button
                  className="bg-slate-700 hover:bg-slate-800"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="edit-name" className="text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  id="edit-name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Product Name"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="edit-quantity" className="text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={formState.quantity}
                  onChange={(e) =>
                    setFormState({ ...formState, quantity: e.target.value })
                  }
                  placeholder="Quantity"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="edit-price" className="text-sm font-medium text-gray-700 mb-1">
                  Price (per product)
                </label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01" // Allows decimal input
                  value={formState.price}
                  onChange={(e) =>
                    setFormState({ ...formState, price: e.target.value })
                  }
                  placeholder="Price"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="edit-description" className="text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  id="edit-description"
                  value={formState.description}
                  onChange={(e) =>
                    setFormState({ ...formState, description: e.target.value })
                  }
                  placeholder="Description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}