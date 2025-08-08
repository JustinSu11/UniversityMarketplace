// Utility functions for listing operations

/**
 * Convert price from cents to dollars
 * @param {number} priceCents - Price in cents
 * @returns {string} Formatted price in dollars
 */
export function formatPrice(priceCents) {
  if (!priceCents) return 'Free';
  return `$${(priceCents / 100).toFixed(2)}`;
}

/**
 * Convert price from dollars to cents
 * @param {number} priceDollars - Price in dollars
 * @returns {number} Price in cents
 */
export function priceToCents(priceDollars) {
  return Math.round(priceDollars * 100);
}

/**
 * Parse JSON string safely
 * @param {string} jsonString - JSON string to parse
 * @returns {any} Parsed JSON or null
 */
export function parseJsonSafely(jsonString) {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}

/**
 * Get category display name
 * @param {string} category - Category enum value
 * @returns {string} Display name
 */
export function getCategoryDisplayName(category) {
  const categoryNames = {
    BOOKS: 'Books',
    ELECTRONICS: 'Electronics',
    FURNITURE: 'Furniture',
    CLOTHING: 'Clothing',
    SPORTS: 'Sports',
    MUSICAL_INSTRUMENTS: 'Musical Instruments',
    OTHER: 'Other',
  };
  return categoryNames[category] || category;
}

/**
 * Get condition display name
 * @param {string} condition - Condition enum value
 * @returns {string} Display name
 */
export function getConditionDisplayName(condition) {
  const conditionNames = {
    NEW: 'New',
    LIKE_NEW: 'Like New',
    GOOD: 'Good',
    FAIR: 'Fair',
    POOR: 'Poor',
  };
  return conditionNames[condition] || condition;
}

/**
 * Get status display name
 * @param {string} status - Status enum value
 * @returns {string} Display name
 */
export function getStatusDisplayName(status) {
  const statusNames = {
    ACTIVE: 'Active',
    SOLD: 'Sold',
    EXPIRED: 'Expired',
    DELETED: 'Deleted',
  };
  return statusNames[status] || status;
}

/**
 * Get category options for select dropdown
 * @returns {Array} Array of category options
 */
export function getCategoryOptions() {
  return [
    { value: 'BOOKS', label: 'Books' },
    { value: 'ELECTRONICS', label: 'Electronics' },
    { value: 'FURNITURE', label: 'Furniture' },
    { value: 'CLOTHING', label: 'Clothing' },
    { value: 'SPORTS', label: 'Sports' },
    { value: 'MUSICAL_INSTRUMENTS', label: 'Musical Instruments' },
    { value: 'OTHER', label: 'Other' },
  ];
}

/**
 * Get condition options for select dropdown
 * @returns {Array} Array of condition options
 */
export function getConditionOptions() {
  return [
    { value: 'NEW', label: 'New' },
    { value: 'LIKE_NEW', label: 'Like New' },
    { value: 'GOOD', label: 'Good' },
    { value: 'FAIR', label: 'Fair' },
    { value: 'POOR', label: 'Poor' },
  ];
}

/**
 * Validate listing data
 * @param {Object} data - Listing data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateListingData(data) {
  const errors = {};

  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  }

  if (data.title && data.title.trim().length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  if (data.description && data.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  if (data.priceCents !== undefined && data.priceCents < 0) {
    errors.price = 'Price must be non-negative';
  }

  if (data.location && data.location.length > 100) {
    errors.location = 'Location must be less than 100 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
