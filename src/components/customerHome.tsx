"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FoodItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl: string;
  providerId: number;
}

export default function CustomerHome() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch("/api/food-items");

        if (response.ok) {
          const data = await response.json();
          setFoodItems(data.foodItems);
          setFilteredItems(data.foodItems); // Initialize filteredItems
        } else {
          console.error("Failed to fetch food items.");
        }
      } catch (err) {
        console.error("Error fetching food items:", err);
      }
    };

    fetchFoodItems();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredItems(
      foodItems.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      )
    );
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search food items..."
          className="w-full"
        />
      </div>

      {/* Food Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <p className="text-center col-span-full">No food items found!</p>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className="shadow-md">
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
                <div className="mt-4">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}