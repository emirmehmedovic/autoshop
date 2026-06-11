# Images Directory Structure

This directory contains all local images for the AutoShop application.

## Directory Structure

```
public/images/
├── products/       # Product images uploaded through admin panel
├── og/            # Open Graph and social media images
└── README.md      # This file
```

## Required Images

### OG Image
- **File**: `/public/og-image.jpg`
- **Size**: 1200x630px
- **Format**: JPG or PNG
- **Purpose**: Open Graph image for social media sharing

### Product Images
- **Location**: `public/images/products/`
- **Format**: JPG, PNG, or WebP
- **Recommended Size**: 800x800px minimum
- **Note**: Product images are uploaded through the admin panel and stored in the database

## Placeholder Images

- `/public/placeholder-product.svg` - Used when a product has no image

## Notes

- All images should be optimized for web use
- Use WebP format when possible for better compression
- Product images are referenced by URL in the database
- For VPS deployment, ensure proper file permissions (644 for files, 755 for directories)
