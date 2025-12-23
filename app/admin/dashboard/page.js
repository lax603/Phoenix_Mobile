'use client';

import React, { useEffect, useState } from 'react';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Products: {data.products}</p>
      <p>Orders: {data.orders}</p>
      <p>Stores: {data.stores}</p>
      <p>Total Revenue: {data.revenue}</p>
      <p>Users: {data.users}</p>
      <p>Coupons: {data.coupons}</p>
    </div>
  );
};

export default AdminDashboardPage;
