# 🛒 E-Commerce App

A modern, scalable e-commerce frontend application built with Next.js 15, TypeScript, and Tailwind CSS. This frontend integrates with an external Node.js Express server backend to provide a comprehensive product catalog, shopping cart, user authentication, order management, and admin panel.

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Development**: Turbopack for fast builds
- **Code Quality**: ESLint

### Backend Integration

- **API**: RESTful API integration with Node.js Express server
- **Authentication**: JWT-based authentication with backend
- **Data Fetching**: Fetch API / Axios for HTTP requests
- **State Management**: React Context / Zustand for client-side state

## ✨ Features

### 🛍️ Customer Features

- **Product Catalog**: Browse products by categories with filtering and search
- **Product Details**: Detailed product pages with images, descriptions, and reviews
- **Shopping Cart**: Add/remove items, quantity management, persistent cart
- **Wishlist**: Save products for later purchase
- **User Authentication**: Sign up, sign in, password reset
- **User Account**: Profile management, order history, saved addresses
- **Checkout Process**: Multi-step checkout with payment and shipping options
- **Order Tracking**: Real-time order status updates
- **Product Reviews**: Rate and review purchased products
- **Search & Filters**: Advanced product search and filtering capabilities

### 🔧 Admin Features

- **Admin Dashboard**: Analytics and key metrics overview
- **Product Management**: CRUD operations for products and categories
- **Order Management**: Process orders, update status, handle returns
- **User Management**: Customer account management
- **Inventory Control**: Stock management and alerts
- **Analytics**: Sales reports and customer insights

### 🛠️ Technical Features

- **Responsive Design**: Mobile-first responsive UI
- **Performance Optimized**: Fast loading with Next.js optimizations
- **SEO Friendly**: Server-side rendering and meta optimization
- **Type Safety**: Full TypeScript implementation
- **Component Library**: Reusable UI components with shadcn/ui
- **Feature-Based Architecture**: Modular and scalable codebase
- **API Integration**: RESTful API support
- **State Management**: Centralized state management
- **Testing Ready**: Comprehensive testing setup

## 📁 Project Structure

```
ecommerce-app/frontend/
├── public/                          # Static assets
│   └── assets/
│       ├── icons/                   # SVG icons (actions, branding, categories, etc.)
│       └── images/                  # Images (products, banners, logos, etc.)
├── src/
│   ├── app/                         # Next.js App Router pages
│   │   ├── (auth)/                  # Authentication pages
│   │   ├── (shop)/                  # Shopping pages
│   │   ├── account/                 # User account pages
│   │   ├── admin/                   # Admin panel pages
│   │   ├── products/                # Product pages
│   │   └── ...                      # Other routes
│   ├── components/                  # Reusable components
│   │   ├── shared/                  # Business components
│   │   └── ui/                      # UI primitives (shadcn/ui)
│   ├── features/                    # Feature-based modules
│   │   ├── auth/                    # Authentication logic
│   │   ├── products/                # Product management
│   │   ├── cart/                    # Shopping cart logic
│   │   ├── orders/                  # Order management
│   │   ├── payment/                 # Payment processing
│   │   └── ...                      # Other features
│   ├── lib/                         # Utilities and configurations
│   ├── hooks/                       # Custom React hooks
│   ├── types/                       # TypeScript type definitions
│   ├── utils/                       # Helper functions
│   ├── styles/                      # Global styles
│   ├── api/                         # API layer
│   ├── config/                      # App configuration
│   └── providers/                   # Context providers
├── docs/                           # Documentation
├── __tests__/                      # Test configuration
└── Configuration files...
```

### 🏗️ Feature-Based Architecture

Each feature module follows a consistent structure:

```
features/[feature-name]/
├── components/                      # Feature-specific components
├── hooks/                          # Feature-specific hooks
├── services/                       # API calls and business logic
├── utils/                          # Feature utilities
├── types.ts                        # Feature type definitions
├── validations.ts                  # Form validation schemas
├── store.ts                        # Feature state management
└── index.ts                        # Public API exports
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, or pnpm
- **Backend Server**: Ensure your Node.js Express server is running

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ecommerce-app/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables in `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api  # Your Express server URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start the backend server** (if not already running)

   Ensure your Node.js Express server is running on the configured port (e.g., `http://localhost:8000`)

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Available Scripts

```bash
npm run dev         # Start development server with Turbopack
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

## 🔗 Backend Integration

This frontend application is designed to work with a Node.js Express server backend. The integration follows these patterns:

### API Communication

- **Base URL**: Configured via `NEXT_PUBLIC_API_URL` environment variable
- **HTTP Client**: Fetch API or Axios for making requests
- **Authentication**: JWT tokens passed in Authorization headers
- **Error Handling**: Centralized error handling for API responses

### API Endpoints Structure

The frontend expects the following API structure from your Express server:

```
/api/auth/*           # Authentication endpoints
/api/products/*       # Product management
/api/categories/*     # Category management
/api/cart/*           # Shopping cart operations
/api/orders/*         # Order management
/api/users/*          # User profile management
/api/payments/*       # Payment processing
/api/admin/*          # Admin panel endpoints
```

### Authentication Flow

1. User login sends credentials to `/api/auth/login`
2. Backend returns JWT access and refresh tokens
3. Frontend stores tokens securely (httpOnly cookies recommended)
4. Subsequent requests include tokens in headers
5. Token refresh handled automatically

### Data Flow

```
Frontend (Next.js) ↔ HTTP/HTTPS ↔ Backend (Express.js) ↔ Database
```

### Required Backend Endpoints

Your Express server should implement these endpoints:

#### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

#### Products

- `GET /api/products` - Get products with pagination and filters
- `GET /api/products/:id` - Get single product
- `GET /api/categories` - Get product categories
- `GET /api/categories/:slug/products` - Get products by category

#### Cart & Orders

- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details

#### User Management

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/addresses` - Get user addresses
- `POST /api/users/addresses` - Add user address

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) for consistent, accessible UI components:

- **Style**: New York variant
- **Base Color**: Neutral
- **Icon Library**: Lucide React
- **CSS Variables**: Enabled for easy theming

### Adding New Components

```bash
npx shadcn@latest add [component-name]
```

## 🏃‍♂️ Development Workflow

### 1. Feature Development

1. Create feature branch: `git checkout -b feature/feature-name`
2. Develop in the appropriate feature module: `src/features/[feature-name]/`
3. Add components to `src/components/` if reusable
4. Update types in `src/types/` if needed
5. Test your changes
6. Submit pull request

### 2. Adding New Pages

1. Create page in `src/app/` following App Router conventions
2. Use existing components and features
3. Ensure responsive design
4. Add loading and error states

### 3. Code Organization

- **Components**: Reusable UI components in `src/components/`
- **Features**: Business logic in `src/features/[feature]/`
- **Utils**: Helper functions in `src/utils/` or feature-specific utils
- **Types**: TypeScript definitions in `src/types/` or feature-specific types
- **Styles**: Global styles in `src/styles/`

## 📦 Key Dependencies

### Core

- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript 5**: Type safety

### UI & Styling

- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: Component library
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variants

### Development

- **ESLint**: Code linting
- **Turbopack**: Fast bundler and dev server

## 🔧 Configuration

### Tailwind CSS

- Configuration: `tailwind.config.ts`
- Global styles: `src/app/globals.css`
- CSS variables enabled for theming

### shadcn/ui

- Configuration: `components.json`
- Components path: `@/components/ui`
- Utilities path: `@/lib/utils`

### Path Aliases

```typescript
{
  "@/*": ["./src/*"],
  "@/components/*": ["./src/components/*"],
  "@/lib/*": ["./src/lib/*"],
  "@/utils/*": ["./src/utils/*"]
}
```

## 🧪 Testing

Testing infrastructure is set up in `__tests__/` directory:

- **Setup**: Test configuration and utilities
- **Mocks**: Global mocks for testing
- **Feature Tests**: Each feature can have its own `__tests__/` directory

## 📱 Responsive Design

The application is built mobile-first with responsive breakpoints:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🔒 Security

- **Authentication**: Secure user authentication flow
- **Input Validation**: Client and server-side validation
- **Type Safety**: Full TypeScript implementation
- **Sanitization**: Input sanitization and XSS protection

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables

Set up the following environment variables for production:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com

# Authentication
NEXTAUTH_SECRET=your-production-secret

# Payment Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Deployment Considerations

#### Backend Coordination

- Ensure your Express server is deployed and accessible
- Configure CORS to allow requests from your frontend domain
- Set up SSL certificates for HTTPS communication
- Implement proper rate limiting and security headers

#### Frontend Deployment Options

- **Vercel**: Optimal for Next.js applications
- **Netlify**: Good alternative with easy deployment
- **AWS/DigitalOcean**: For custom server setups
- **Docker**: Containerized deployment

#### Production Checklist

- [ ] Backend API is deployed and running
- [ ] Environment variables are configured
- [ ] CORS is properly configured on backend
- [ ] SSL certificates are set up
- [ ] Database connections are secure
- [ ] Payment webhooks are configured
- [ ] Error monitoring is set up

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check the documentation in the `docs/` directory
- Review the component documentation

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
