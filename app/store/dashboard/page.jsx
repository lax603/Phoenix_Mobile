'use client';

import React, { useEffect, useState } from 'react';

const StoreDashboardPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/store/dashboard');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (!data && !error) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const totalRevenue = data.orders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Store Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Total Revenue</h2>
          <p className="text-3xl font-bold">{"$" + totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Total Orders</h2>
          <p className="text-3xl font-bold">{data.orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Total Products</h2>
          <p className="text-3xl font-bold">{data.products.length}</p>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ul>
            {data.orders.slice(0, 5).map((order) => (
              <li key={order.id} className="flex justify-between items-center py-2 border-b">
                <span>Order #{order.id}</span>
                <span>{"$" + order.total.toFixed(2)}</span>
                <span className={`px-2 py-1 text-sm rounded-full ${order.status === 'delivered' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                  {order.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboardPage;
