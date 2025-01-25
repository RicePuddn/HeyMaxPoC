"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SalesReport() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        const response = await fetch(`/api/sales-report`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          const data = await response.json();
          setError(data.error || "Failed to fetch sales report.");
        }
      } catch (err) {
        console.error("Error fetching sales report:", err);
        setError("Something went wrong. Please try again.");
      }
    };

    fetchSalesReport();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!stats) {
    return <p>Loading sales report...</p>;
  }

  const { totalRevenue, uniqueCustomers, topSellingProducts, returningCustomers } = stats;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold">${totalRevenue.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unique Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold">{uniqueCustomers}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Returning Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold">{returningCustomers}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top-Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {topSellingProducts.map((product: any) => (
              <li key={product.foodItemId}>
                Product ID: {product.foodItemId} - Sales: ${product._sum.totalPrice.toFixed(2)} - Quantity Sold: {product._count.foodItemId}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}