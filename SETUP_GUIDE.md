# LeaseLink - Complete Setup Guide

## 🎯 Summary of Changes Made

✅ **Landing Page Fixed**: Products can now be browsed without login
✅ **Environment Variables Created**: `.env` file with Supabase credentials
✅ **Authentication Flow**: Login only required for rental actions (Add to Cart, Rent Now)
✅ **Database Ready**: SQL setup scripts available for Supabase

## 🔑 Complete API Keys & Environment Variables Guide

### 1. **Supabase** (Primary Database & Authentication)

#### Where to get:
1. Visit: https://supabase.com/dashboard
2. Sign in or create account
3. Go to your project: `https://supabase.com/dashboard/project/cigetcvhprnhxybhjrzm`
4. Navigate to Settings → API

#### Required Keys:
```env
VITE_SUPABASE_URL=https://cigetcvhprnhxybhjrzm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZ2V0Y3ZocHJuaHh5YmhqcnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MDY5OTksImV4cCI6MjA3MDQ4Mjk5OX0.GjaRc2cU3Iuqq6bq7Jp-ej2XTm-2QSxTZKAMK4RF8mI
```

#### Database Setup:
1. Go to SQL Editor in Supabase Dashboard
2. Copy and run the contents of: `Backend/supabase-simple-setup.sql`
3. This will create all necessary tables (users, products, bookings, etc.)

---

### 2. **Payment Gateway** (Optional - for production)

#### Stripe (Recommended for India)
- **Where**: https://dashboard.stripe.com/apikeys
- **Keys needed**:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

#### Razorpay (Popular in India)
- **Where**: https://dashboard.razorpay.com/#/app/keys
- **Keys needed**:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

---

### 3. **Email Service** (Optional - for notifications)

#### SendGrid
- **Where**: https://app.sendgrid.com/settings/api_keys
- **Keys needed**:
```env
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

#### Nodemailer with Gmail
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

### 4. **File Storage** (Optional - for user uploads)

#### Cloudinary
- **Where**: https://cloudinary.com/console/settings/security
- **Keys needed**:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abc123...
```

#### AWS S3
```env
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-bucket-name
```

---

### 5. **Maps & Location** (Optional - for facility locations)

#### Google Maps
- **Where**: https://console.cloud.google.com/apis/credentials
- **Enable APIs**: Maps JavaScript API, Places API, Geocoding API
```env
VITE_GOOGLE_MAPS_API_KEY=AIza...
```

#### Mapbox (Alternative)
- **Where**: https://account.mapbox.com/access-tokens/
```env
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1...
```

---

### 6. **SMS Notifications** (Optional)

#### Twilio
- **Where**: https://console.twilio.com/
```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 📁 File Locations

### Frontend Environment Variables
**File**: `Frontend/.env`
```env
# Core Requirements (ALREADY CREATED)
VITE_SUPABASE_URL=https://cigetcvhprnhxybhjrzm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZ2V0Y3ZocHJuaHh5YmhqcnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MDY5OTksImV4cCI6MjA3MDQ4Mjk5OX0.GjaRc2cU3Iuqq6bq7Jp-ej2XTm-2QSxTZKAMK4RF8mI

# Optional - Add as needed
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_RAZORPAY_KEY_ID=rzp_test_...
VITE_GOOGLE_MAPS_API_KEY=AIza...
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1...
```

### Backend Environment Variables
**File**: `Backend/.env` (if using backend)
```env
# Database
DATABASE_URL="postgresql://postgres:password@db.cigetcvhprnhxybhjrzm.supabase.co:5432/postgres"
SUPABASE_URL=https://cigetcvhprnhxybhjrzm.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZ2V0Y3ZocHJuaHh5YmhqcnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MDY5OTksImV4cCI6MjA3MDQ4Mjk5OX0.GjaRc2cU3Iuqq6bq7Jp-ej2XTm-2QSxTZKAMK4RF8mI

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Payment
STRIPE_SECRET_KEY=sk_test_...
RAZORPAY_KEY_SECRET=...

# Email
SENDGRID_API_KEY=SG.xxx
EMAIL_FROM=noreply@yourdomain.com

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abc123...
```

---

## 🚀 Quick Start Commands

1. **Set up database**:
```bash
# Go to Supabase SQL Editor and run:
# Backend/supabase-simple-setup.sql
```

2. **Install and run frontend**:
```bash
cd Frontend
npm install
npm run dev
```

3. **Test the application**:
   - Visit `http://localhost:5173`
   - Browse products without login ✅
   - Try to rent → redirects to login ✅

---

## 🔧 Current Application Features

### ✅ Working Features:
- **Public Product Browsing**: No login required to view products
- **Product Details**: Full product information accessible to everyone
- **Authentication Required for**: Renting, Cart, Checkout, Dashboard
- **Dual Auth System**: Both traditional and Supabase authentication
- **Responsive Design**: Works on mobile and desktop

### 🚧 Next Steps for Production:
1. **Database Setup**: Run the SQL script in Supabase
2. **Payment Integration**: Add Stripe/Razorpay for payments
3. **Email Notifications**: Set up SendGrid for booking confirmations
4. **File Uploads**: Configure Cloudinary for product images
5. **Remove Dual Auth**: Choose either Supabase OR traditional auth

---

## 🛠️ API Priority by Feature

### **Phase 1 - Core Features (Required)**
1. ✅ **Supabase** - Database & Auth (Already configured)

### **Phase 2 - Payment System**
2. **Stripe/Razorpay** - For processing rentals

### **Phase 3 - Enhanced UX**
3. **SendGrid** - Email notifications
4. **Cloudinary** - File uploads
5. **Google Maps** - Location services

### **Phase 4 - Advanced Features**
6. **Twilio** - SMS notifications
7. **Analytics** - Google Analytics, Mixpanel

---

## 📞 Support Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/cigetcvhprnhxybhjrzm
- **Stripe Dashboard**: https://dashboard.stripe.com/
- **Razorpay Dashboard**: https://dashboard.razorpay.com/
- **SendGrid Dashboard**: https://app.sendgrid.com/
- **Cloudinary Dashboard**: https://cloudinary.com/console/

---

**Status**: ✅ Core functionality complete - ready for database setup and testing!
