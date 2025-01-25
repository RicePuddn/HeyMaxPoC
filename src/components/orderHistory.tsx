"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: number;
  sellerId: number;
  sellerName: string;
  foodItemId: number;
  foodItemName: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

export default function OrderHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await fetch("/api/order-history");

        if (response.ok) {
          const data = await response.json();
          setTransactions(data.transactions);
        } else {
          const data = await response.json();
          setError(data.error || "Failed to fetch order history.");
        }
      } catch (err) {
        console.error("Error fetching order history:", err);
        setError("Something went wrong. Please try again.");
      }
    };

    fetchOrderHistory();
  }, []);

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {transactions.length === 0 ? (
        <div className="col-span-full text-center">
          <p className="text-lg font-semibold text-gray-700 mt-4">
            You have no orders yet.
          </p>
          <Button
            className="mt-4 bg-green-600 hover:bg-green-700"
            onClick={() => (window.location.href = "/customer-home")}
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        transactions.map((transaction) => (
          <Card
            key={transaction.id}
            className="shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                {transaction.foodItemName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Seller: {transaction.sellerName}
              </p>
              <p className="text-sm text-gray-600">
                Quantity: {transaction.quantity.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                Total Price: ${transaction.totalPrice.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                Ordered At: {new Date(transaction.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}