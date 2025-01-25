"use client";

import { useCart } from "@/context/cartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";


export default function CartPage() {
  const { cart, updateCartItem, removeCartItem, clearCart } = useCart();
  const [error, setError] = useState<{ [key: number]: string }>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [isCartLoading, setIsCartLoading] = useState(true); // Loading state for the cart
  const{ toast } = useToast();
  // Simulate cart loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsCartLoading(false); // Simulate cart being loaded
    }, 200); // Adjust this delay as needed
    return () => clearTimeout(timeout);
  }, []);

  // Update total price whenever cart changes
  useEffect(() => {
    const calculateTotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(calculateTotal);
  }, [cart]);

  const handleQuantityChange = (
    id: number,
    quantity: number,
    maxQuantity: number
  ) => {
    if (quantity <= 0) {
      setError((prev) => ({ ...prev, [id]: "Quantity must be at least 1." }));
      return;
    }

    if (quantity > maxQuantity) {
      setError((prev) => ({
        ...prev,
        [id]: "Quantity exceeds available stock.",
      }));
      return;
    }

    setError((prev) => ({ ...prev, [id]: "" }));
    updateCartItem(id, quantity);
  };
  
  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/update-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });

      if (response.ok) {
        clearCart();
        toast({title:"Checkout Successful!", description:"Your checkout was successful!", variant:"success"});
      } else {
        const data = await response.json();
        alert(data.error || "Failed to complete checkout.");
      }
    } catch (err) {
      console.error("Error during checkout:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (isCartLoading) {
    // Render a loading spinner or skeleton UI while the cart is loading
    return (
      <div className="p-6 text-center">
        <p className="text-lg font-semibold text-gray-700">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700 mt-4">
            Your cart is empty!
          </p>
          <Button
            className="mt-4 bg-green-600 hover:bg-green-700"
            onClick={() => {
              window.location.href = "/customer-home";
            }}
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
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
                  <p className="text-sm text-gray-600">
                    Price: ${item.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Available Quantity: {item.quantity}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor={`quantity-${item.id}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Quantity
                      </label>
                      <Input
                        id={`quantity-${item.id}`}
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            Number(e.target.value),
                            item.quantity
                          )
                        }
                        className="mt-1 block w-20"
                        min={1}
                        max={item.quantity}
                      />
                      {error[item.id] && (
                        <p className="text-red-500 text-sm">{error[item.id]}</p>
                      )}
                    </div>
                    <div>
                      <Button
                        variant="destructive"
                        onClick={() => removeCartItem(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Total price and checkout section */}
          {totalPrice > 0 && (
            <div className="mt-6 border-t pt-4">
              <p className="text-lg font-semibold">
                Total Price: ${totalPrice.toFixed(2)}
              </p>
              <Button
                className="mt-4 bg-green-600 hover:bg-green-700 w-full"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}