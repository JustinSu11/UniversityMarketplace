'use client';

import { useState, useEffect } from 'react';

export default function TestSimple() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/listings');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p>API Response:</p>
      <pre className="bg-gray-100 p-4 rounded mt-2">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
