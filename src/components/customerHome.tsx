"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cartContext";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface FoodItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl: string;
  provider: {
    location: string;
  };
}

export default function CustomerHome() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch("/api/food/get-food-items");

        if (response.ok) {
          const data = await response.json();
          setFoodItems(data.foodItems);
          setFilteredItems(data.foodItems);
        } else {
          const data = await response.json();
          setError(data.error || "Failed to fetch food items.");
        }
      } catch (err) {
        console.error("Error fetching food items:", err);
        setError("Something went wrong. Please try again.");
      }
    };

    fetchFoodItems();
  }, []);

  // Filter items based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredItems(foodItems);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredItems(
        foodItems.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, foodItems]);

  const handleAddToCart = () => {
    if (!selectedItem) return;

    if (selectedQuantity > selectedItem.quantity) {
      setError("Selected quantity exceeds available stock.");
      return;
    }

    addToCart({
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity: selectedQuantity,
      imageUrl: selectedItem.imageUrl,
      availableQuantity: selectedItem.quantity,
    });

    toast({
      title: `${selectedItem.name} successfully added to cart!`,
      description: `Total Quantity: ${selectedQuantity}`,
    });

    setSelectedItem(null);
    setSelectedQuantity(1);
    setError("");
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search for food items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Food Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center">
            <p className="text-lg font-semibold text-gray-700 mt-4">
              No matching food items found.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <Card
              key={item.id}
              className="shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-40 w-full object-cover rounded-t-md"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Price: ${item.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Available Quantity: {item.quantity}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Seller Location: {item.provider.location}
                </p>
                <div className="mt-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700 w-full"
                    onClick={() => setSelectedItem(item)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog for selecting quantity */}
      {selectedItem && (
        <Dialog
          open={!!selectedItem}
          onOpenChange={() => setSelectedItem(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedItem.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{selectedItem.description}</p>
              <p className="text-sm text-gray-500">
                Price: ${selectedItem.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                Available Quantity: {selectedItem.quantity}
              </p>
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={selectedItem.quantity}
                  value={selectedQuantity}
                  onChange={(e) =>
                    setSelectedQuantity(Number(e.target.value))
                  }
                  className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Total Price: ${(selectedItem.price * selectedQuantity).toFixed(2)}
              </p>
            </div>
            <DialogFooter>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSelectedItem(null)}
              >
                Cancel
              </Button>
            </DialogFooter>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}