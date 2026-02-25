# TBM & Bogat - E-Commerce Platform

A modern e-commerce platform for building and construction materials, featuring user and admin dashboards, real-time analytics, and comprehensive order management.

## Design

View the Figma design: [TBM Design](https://www.figma.com/design/LecIlerhL3NDfYBqa3pfNv/TBM?node-id=1-2&t=GpPRd4v1dmtfBKZR-1)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript/React
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: TanStack Query (React Query v5)
- **Form Handling**: Formik + Yup
- **HTTP Client**: Fetch API with credentials
- **Icons**: Lucide React

## Environment Setup

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tdm-web
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Configure environment variables:

Create a `.env` or `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://tbmbuild-001-site1.jtempurl.com
```

**Important**: The backend must be configured with proper CORS settings to allow credentials:

```csharp
// Backend CORS Configuration Required
app.UseCors(options => options
    .WithOrigins("http://localhost:3000", "https://your-production-domain.com")
    .AllowCredentials()
    .AllowAnyMethod()
    .AllowAnyHeader()
);
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Accessing Dashboards

### User Dashboard

**URL**: `http://localhost:3000/profile`

The user dashboard provides:
- Order history and tracking
- Saved designs
- Profile management
- Address management

**Authentication Required**: Users must sign in first at `/sign-in`

### Admin Dashboard

**URL**: `http://localhost:3000/admin/dashboard`

The admin dashboard includes:

#### Dashboard Overview (`/admin/dashboard`)
- **Real-time Analytics**: Total revenue, orders, active users
- **Revenue Charts**: Monthly revenue visualization
- **System Metrics**: Server load monitoring
- **Alerts**: Critical system notifications
- **Quick Actions**: Common administrative tasks

**Integrated API Endpoints**:
- `GET /admin/analytics/overview` - Dashboard statistics
- `GET /admin/analytics/monthly-revenue` - Revenue chart data
- `GET /admin/analytics/payment-distribution` - Payment methods breakdown

#### Settings (`/admin/dashboard/settings`)
- **Payment Settings**: Platform fees, currency, payment gateways (Stripe, PayPal, Crypto)
- **AI Configuration**: AI model settings and costs
- **Notifications**: Email and SMS notification preferences
- **General Settings**: Platform name, timezone, support email

**Features**:
- Formik + Yup validation for all forms
- Real-time updates with React Query
- 2FA verification for critical changes
- Audit logging

**Integrated API Endpoints**:
- `GET/PUT /admin/settings/payment` - Payment configuration
- `GET/PUT /admin/settings/ai` - AI model settings
- `GET/PUT /admin/settings/general` - General platform settings

#### User Management (`/admin/dashboard/users`)
- View all registered users
- Suspend/reactivate user accounts
- Delete user accounts
- Filter by status and search

**Integrated API Endpoints**:
- `GET /admin/users` - List all users (with pagination)
- `PATCH /admin/users/:id/suspend` - Suspend user
- `PATCH /admin/users/:id/reactivate` - Reactivate user
- `DELETE /admin/users/:id` - Delete user

#### Order Management (`/admin/dashboard/orders`)
- View and manage all orders
- Update order status
- Process refunds
- Add tracking information
- Cancel orders

**Integrated API Endpoints**:
- `GET /admin/orders` - List orders (with filters and pagination)
- `PATCH /admin/orders/:id/status` - Update order status
- `PATCH /admin/orders/:id/cancel` - Cancel order
- `POST /admin/orders/:id/refund` - Process refund
- `PATCH /admin/orders/:id/tracking` - Update tracking number

#### Financial Reports (`/admin/dashboard/financial-report`)
- Revenue analytics
- Payment distribution
- Transaction logs
- Export reports

**Authentication Required**: Admin users must sign in at `/admin/sign-in`

## Authentication

### User Authentication
- **Sign Up**: `/sign-up`
- **Sign In**: `/sign-in`
- **Email Verification**: `/verify-email`
- **Password Reset**: `/forgot-password`

**Token Storage**: HTTP-only cookies (`authToken`)

### Admin Authentication
- **Admin Sign In**: `/admin/sign-in`

**Token Storage**: Separate HTTP-only cookies (`adminAuthToken`, `adminRefreshToken`)
- Scoped to `/admin` path
- Separate from user authentication
- Supports token refresh

## API Integration

### Authentication Flow

All admin API requests use `credentials: 'include'` to automatically send HTTP-only cookies:

```javascript
const response = await fetch(`${API_URL}/admin/endpoint`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Sends cookies with request
});
```

### Query Keys Factory Pattern

React Query keys are organized by domain:

```javascript
// Admin Orders
export const ADMIN_ORDERS_QUERY_KEYS = {
  all: ["admin", "orders"],
  list: (filters) => [...ADMIN_ORDERS_QUERY_KEYS.all, "list", filters],
  detail: (id) => [...ADMIN_ORDERS_QUERY_KEYS.all, "detail", id],
};

// Admin Settings
export const SETTINGS_QUERY_KEYS = {
  all: ["admin", "settings"],
  payment: ["admin", "settings", "payment"],
  ai: ["admin", "settings", "ai"],
  general: ["admin", "settings", "general"],
};
```

### Error Handling

API errors are handled gracefully with user-friendly error messages:

- **CORS Errors**: Displays backend configuration instructions
- **Network Errors**: Shows connection error with retry option
- **Validation Errors**: Inline field-level error messages
- **Server Errors**: Generic error message with details

## Form Validation

All admin forms use Formik + Yup for validation:

```javascript
// Example: Payment Settings Schema
export const paymentSettingsSchema = Yup.object().shape({
  baseFee: Yup.number()
    .min(0, "Base fee cannot be negative")
    .max(100, "Base fee cannot exceed 100%")
    .required("Base platform fee is required"),
  fixedFee: Yup.number()
    .min(0, "Fixed fee cannot be negative")
    .required("Fixed fee is required"),
  currency: Yup.string()
    .oneOf(["USD", "EUR", "GBP", "NGN", "KES", "ZAR"])
    .required("Currency is required"),
});
```

## Project Structure

```
tdm-web/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── verify-email/
│   ├── (user)/                   # User-facing pages
│   │   ├── profile/
│   │   └── ...
│   ├── admin/                    # Admin pages
│   │   ├── dashboard/
│   │   │   ├── page.jsx         # Dashboard overview
│   │   │   ├── settings/        # Platform settings
│   │   │   ├── users/           # User management
│   │   │   └── orders/          # Order management
│   │   └── sign-in/
│   └── api/                      # API routes (proxies)
├── components/
│   ├── admin/                    # Admin-specific components
│   │   └── settings/
│   │       └── PaymentSettingsForm.jsx
│   ├── shared/                   # Shared components
│   └── common/                   # Common UI components
├── hooks/
│   ├── use-admin.js             # Admin dashboard hooks
│   ├── use-admin-orders.js      # Order management hooks
│   ├── use-admin-settings.js    # Settings hooks
│   ├── use-admin-users.js       # User management hooks
│   ├── use-settings.js          # Settings hooks
│   └── use-financial.js         # Financial data hooks
├── lib/
│   ├── api/
│   │   ├── admin.js             # Admin API client
│   │   ├── client.js            # General API client
│   │   └── ...
│   ├── actions/
│   │   ├── auth.js              # User auth server actions
│   │   └── admin-auth.js        # Admin auth server actions
│   ├── validations/
│   │   └── admin-settings.js    # Yup validation schemas
│   └── mock/                     # Mock data (legacy)
├── public/                       # Static assets
└── .env                          # Environment variables
```

## Development Workflow

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Starting Production Server
```bash
npm start
```

### Linting
```bash
npm run lint
```

## Known Issues

### CORS Configuration
The backend must have proper CORS configuration to allow credentials. If you see CORS errors, ensure the backend has:

1. Specific origin URLs (not wildcard `*`)
2. `AllowCredentials()` enabled
3. Proper headers and methods allowed

### Environment Variables
Environment variables in Next.js are loaded at build time. After changing `.env`, restart the dev server:

```bash
# Stop the server (Ctrl+C)
npm run dev
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Your License Here]

## Support

For support, contact: [Your Support Email]
