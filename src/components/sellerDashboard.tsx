"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function SellerDashboard() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const { toast } = useToast();

  const [stats, setStats] = useState({
    totalSales: 1500,
    foodSavings: 300,
    totalCustomers: 120,
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!name || !quantity || !price || !description || !image) {
      toast({title:"All fields are required!",description:"Please fill up all fields, thank you!", variant:"destructive"});
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("quantity", quantity);
      formData.append("price", price); // Add price to form data
      formData.append("description", description);
      formData.append("image", image);

      const response = await fetch("/api/upload-food", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast({title:"Food item published successfully!",description:"You can check the product out at Manage Products", variant:"success"});
        // Reset the form fields
        setName("");
        setQuantity("");
        setPrice(""); // Reset price field
        setDescription("");
        setImage(null);
      } else {
        const data = await response.json();
        toast({title:`${data.error||"Failed to publish food item."}`,variant:"destructive"})
      }
    } catch (err) {
      console.error("Error publishing food item:", err);
      toast({title:`Error publishing food item 😵‍💫: ${err}`,variant:"destructive"})

    }
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Statistics Section */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Statistics (These are static for now)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Sales:</span>
                <span>${stats.totalSales}</span>
              </div>
              <div className="flex justify-between">
                <span>Food Savings:</span>
                <span>{stats.foodSavings} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Total Customers:</span>
                <span>{stats.totalCustomers}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Publish Food Item Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Publish Food Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Food Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter food name"
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price (per item)
                </label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price per item"
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Food Image
                </label>
                <Input
                  id="image"
                  type="file"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="mt-1 block w-full"
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Publish
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}