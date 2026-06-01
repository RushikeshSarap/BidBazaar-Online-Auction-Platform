# BidBazaar Online Auction Platform

A web-based online auction platform built with HTML, CSS, JavaScript, and a Node.js + Express backend. The project supports buyer and seller workflows, user authentication, product listing, marketplace browsing, auction bidding, and profile management.

## Current Functionality

### Authentication
- User registration via `/api/register` using `POST` with multipart form data
- User login via `/api/login` using `POST`
- Supports both Buyer and Seller roles
- Login redirects users to either the buyer or seller landing page based on role

### Buyer Experience
- Buyer dashboard with navigation to:
  - Marketplace
  - Auction page
  - Profile page
- Marketplace features:
  - Displays a list of sample products
  - Add items to cart
  - Add items to wishlist
- Auction page features:
  - Live countdown timer for a running auction
  - Place bids that must exceed the current highest bid
  - View a bid log of placed bids
- Profile page shows user profile UI with navigation options

### Seller Experience
- Seller dashboard with navigation to:
  - Profile page
  - Add Product page
- Add Product page supports:
  - Title, category, price, description, and image upload
  - Submission to `/add-product` endpoint with JWT token verification
- Profile page shows seller profile UI

### Shared and Supporting Features
- Static homepage with login modal and signup prompt
- Client-side CAPTCHA generation for signup
- Local storage support for buyer-side cart, wishlist, transactions, and product data
- Upload support for profile images and product images served from `uploads/`

## Backend API

### Server
- `server.js` runs an Express server on port `3000` (or `PORT` from environment)
- Uses PostgreSQL for user data and product data
- Uses `multer` for file uploads
- Uses `cors`, `body-parser`, `express.json`, and static file serving

### Endpoints
- `POST /api/register` - register a new user
- `POST /api/login` - authenticate existing user
- `POST /add-product` - add a new product with image upload (JWT verification required)

## Project Structure

- `index.html` - root landing page
- `html/` - page views for buyer, seller, marketplace, auction, profiles, signup, and product addition
- `css/` - styles for each page and layout
- `javascript/` - UI and page logic for login, signup, marketplace, auction, profile, and seller workflows
- `server.js` - Express backend, user authentication, registration and product routes
- `package.json` - Node dependencies and project metadata

## Dependencies
- `express`
- `pg`
- `multer`
- `dotenv`
- `cors`
- `body-parser`
- `jsonwebtoken`

## Setup and Run

1. Install dependencies:
   ```powershell
   npm install
   ```
2. Copy `.env.example` to `.env` and update PostgreSQL settings and `JWT_SECRET`
3. Configure PostgreSQL connection in `server.js` and create the required database/tables
4. Start the server:
   ```powershell
   node server.js
   ```
5. Open the application in a browser at `http://localhost:3000`

## Notes
- The application currently includes sample product data and localStorage-based marketplace/cart logic for demo purposes.
- The signup/login flow is backed by a PostgreSQL database, while some buyer functions use client-side local storage.
- The JWT token verification middleware is in place for the `/add-product` route, but the client flow for creating and storing JWTs is not yet fully implemented in the browser scripts.
