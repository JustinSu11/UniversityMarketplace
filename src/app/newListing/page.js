'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { 
  getCategoryOptions, 
  getConditionOptions, 
  priceToCents, 
  validateListingData 
} from '@/lib/listings';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceDollars: '',
    category: 'OTHER',
    condition: 'GOOD',
    location: '',
    tags: '',
    imageUrls: '', // comma-separated URLs
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Convert tags string to array
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // Convert imageUrls string to an array of objects for Prisma
    const photosToCreate = formData.imageUrls
      .split(',')
      .map(url => url.trim())
      .filter(Boolean)
      .map(url => ({ url }));

    const { imageUrls, priceDollars, ...restOfFormData } = formData;

    const listingData = {
      ...restOfFormData,
      priceCents: priceDollars ? priceToCents(parseFloat(priceDollars)) : null,
      tags: tagsArray,
      photos: {
        create: photosToCreate,
      },
      sellerId: 1, // Replace with actual authenticated user ID
    };

    // Validate data
    const validation = validateListingData(listingData);
    if (!validation.isValid) {
      setError(Object.values(validation.errors).join(', '));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/detailedListing/${data.id}`);
      } else {
        setError(data.error || 'Failed to create listing');
      }
    } catch (err) {
      setError('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Listings
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Create New Listing</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Enter a descriptive title for your item"/>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your item in detail..."
              />
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="priceDollars" className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <Input type="number" id="priceDollars" name="priceDollars" value={formData.priceDollars} onChange={handleInputChange} min="0" step="0.01" placeholder="0.00" />
                <p className="text-sm text-gray-500 mt-1">Leave empty for free items</p>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select onValueChange={(value) => handleSelectChange('category', value)} defaultValue={formData.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCategoryOptions().map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Condition and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <Select onValueChange={(value) => handleSelectChange('condition', value)} defaultValue={formData.condition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {getConditionOptions().map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <Input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g., Main Campus, Engineering Building"/>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <Input type="text" id="tags" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="textbook, math, calculus (separate with commas)"/>
              <p className="text-sm text-gray-500 mt-1">Add relevant tags to help buyers find your item</p>
            </div>

            {/* Images */}
            <div>
              <label htmlFor="imageUrls" className="block text-sm font-medium text-gray-700 mb-2">
                Image URLs
              </label>
              <Input type="text" id="imageUrls" name="imageUrls" value={formData.imageUrls} onChange={handleInputChange} placeholder="https://..., https://... (separate with commas)"/>
              <p className="text-sm text-gray-500 mt-1">Paste one or more image URLs, separated by commas</p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button asChild variant="outline" type="button">
                <Link href="/">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Listing'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}