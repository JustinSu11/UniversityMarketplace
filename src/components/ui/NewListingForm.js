'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';

export default function NewListingForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quality, setQuality] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleImageChange(e) {
    setImages([...e.target.files]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('quality', quality);
    formData.append('description', description);
    images.forEach((file, idx) => formData.append(`image_${idx}`, file));

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data?.error || `Error (${res.status})`);
        return;
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-lg border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Create a New Listing</CardTitle>
        <CardDescription>Fill out the details of the item you want to sell.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quality">Quality</Label>
            <Input
              id="quality"
              placeholder="e.g., New, Like New, Used"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              required
            />
          </div>

        <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <textarea
            id="description"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Describe your item"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            />
        </div>


          <div className="grid gap-2">
            <Label htmlFor="images">Upload Images</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating…' : 'Create Listing'}
          </Button>
        </form>
      </CardContent>
      <CardFooter />
    </Card>
  );
}
