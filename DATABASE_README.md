# University Marketplace Database

This document describes the database setup for the University Marketplace listing system.

## Database Schema

### Models

#### User
- `id` (Int, Primary Key)
- `email` (String, Unique)
- `password` (String)
- `name` (String, Optional)
- `role` (Role Enum: USER, ADMIN)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `listings` (One-to-Many relationship with Listing)

#### Listing
- `id` (Int, Primary Key)
- `title` (String, Required)
- `description` (String, Optional)
- `priceCents` (Int, Optional) - Price stored in cents to avoid floating point issues
- `category` (ListingCategory Enum)
- `condition` (ListingCondition Enum)
- `status` (ListingStatus Enum)
- `location` (String, Optional) - Campus location or building
- `images` (String, Optional) - JSON array of image URLs
- `tags` (String, Optional) - JSON array of tags
- `sellerId` (Int, Foreign Key to User)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Enums

#### ListingCategory
- `BOOKS`
- `ELECTRONICS`
- `FURNITURE`
- `CLOTHING`
- `SPORTS`
- `MUSICAL_INSTRUMENTS`
- `OTHER`

#### ListingCondition
- `NEW`
- `LIKE_NEW`
- `GOOD`
- `FAIR`
- `POOR`

#### ListingStatus
- `ACTIVE`
- `SOLD`
- `EXPIRED`
- `DELETED`

## API Endpoints

### Listings

#### GET /api/listings
Fetch all active listings with optional filtering and pagination.

**Query Parameters:**
- `category` (optional) - Filter by category
- `search` (optional) - Search in title and description
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20)

**Response:**
```json
{
  "listings": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### POST /api/listings
Create a new listing.

**Request Body:**
```json
{
  "title": "Required title",
  "description": "Optional description",
  "priceCents": 2500,
  "category": "BOOKS",
  "condition": "GOOD",
  "location": "Main Campus",
  "images": ["url1", "url2"],
  "tags": ["tag1", "tag2"],
  "sellerId": 1
}
```

#### GET /api/listings/[id]
Get a specific listing by ID.

#### PUT /api/listings/[id]
Update a listing.

#### DELETE /api/listings/[id]
Soft delete a listing (sets status to DELETED).

### Testing and Seeding

#### GET /api/test-db
Test database connection and basic operations.

#### POST /api/seed-listings
Seed the database with sample listings.

## Database Setup

### Prerequisites
- Node.js and npm installed
- SQLite (included with Prisma)

### Environment Variables
Create a `.env` file in the root directory:
```
DATABASE_URL="file:./prisma/dev.db"
```

### Commands

1. **Generate Prisma Client:**
   ```bash
   DATABASE_URL="file:./prisma/dev.db" npx prisma generate
   ```

2. **Run Migrations:**
   ```bash
   DATABASE_URL="file:./prisma/dev.db" npx prisma migrate dev
   ```

3. **Reset Database:**
   ```bash
   DATABASE_URL="file:./prisma/dev.db" npx prisma migrate reset
   ```

4. **View Database:**
   ```bash
   DATABASE_URL="file:./prisma/dev.db" npx prisma studio
   ```

## Utility Functions

The `src/lib/listings.js` file contains utility functions:

- `formatPrice(priceCents)` - Convert cents to formatted dollar string
- `priceToCents(priceDollars)` - Convert dollars to cents
- `parseJsonSafely(jsonString)` - Safely parse JSON strings
- `getCategoryDisplayName(category)` - Get human-readable category names
- `getConditionDisplayName(condition)` - Get human-readable condition names
- `getStatusDisplayName(status)` - Get human-readable status names
- `getCategoryOptions()` - Get category options for dropdowns
- `getConditionOptions()` - Get condition options for dropdowns
- `validateListingData(data)` - Validate listing data

## Sample Data

The database includes sample listings for testing:
- Textbooks (Calculus, Physics Lab Manual)
- Electronics (MacBook Air, iPad Pro)
- Furniture (Office Chair)
- Clothing (Nike Running Shoes)
- Sports (Basketball)
- Musical Instruments (Acoustic Guitar)

## Database Features

- **Soft Deletes**: Listings are marked as DELETED rather than physically removed
- **Price Storage**: Prices stored in cents to avoid floating point precision issues
- **JSON Fields**: Images and tags stored as JSON strings for flexibility
- **Indexing**: Optimized queries with indexes on frequently searched fields
- **Relationships**: Proper foreign key relationships between Users and Listings
- **Validation**: Comprehensive data validation in API endpoints

## Security Considerations

- Input validation on all API endpoints
- SQL injection protection through Prisma ORM
- Proper error handling without exposing sensitive information
- Soft deletes to prevent data loss
- Foreign key constraints for data integrity
