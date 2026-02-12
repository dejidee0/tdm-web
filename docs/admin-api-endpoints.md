# Admin Dashboard API Endpoints

Complete API specification for the TDM Admin Dashboard.

## Table of Contents

1. [Authentication](#authentication)
2. [Settings Management](#settings-management)
3. [User Management](#user-management)
4. [Order Management](#order-management)
5. [Analytics](#analytics)
6. [Content Management](#content-management)

---

## Base Configuration

**Base URL:** `/api/admin`

**Authentication:** All endpoints require admin authentication via Bearer token

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

---

## 1. Authentication

### 1.1 Admin Login

**Endpoint:** `POST /api/admin/auth/login`

**Request Payload:**
```json
{
  "email": "admin@tbm-bogat.com",
  "password": "SecurePassword123!",
  "rememberMe": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "admin_123",
      "email": "admin@tbm-bogat.com",
      "name": "Admin User",
      "role": "super_admin",
      "permissions": ["all"]
    }
  }
}
```

### 1.2 Refresh Token

**Endpoint:** `POST /api/admin/auth/refresh`

**Request Payload:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### 1.3 Admin Logout

**Endpoint:** `POST /api/admin/auth/logout`

**Request Payload:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 2. Settings Management

### 2.1 Get All Settings

**Endpoint:** `GET /api/admin/settings`

**Query Parameters:**
- `category` (optional): `payment`, `ai`, `notifications`, `general`

**Response:**
```json
{
  "success": true,
  "data": {
    "payment": {
      "gateways": [
        {
          "id": "stripe",
          "name": "Stripe Payments",
          "description": "Credit Cards, Apple Pay, Google Pay",
          "enabled": true,
          "config": {
            "publicKey": "pk_live_...",
            "secretKey": "sk_live_...",
            "webhookSecret": "whsec_..."
          }
        }
      ],
      "fees": {
        "basePlatformFee": 2.5,
        "fixedFeePerTransaction": 0.30,
        "defaultCurrency": "USD"
      }
    },
    "ai": {
      "models": [
        {
          "id": "gpt-4",
          "name": "GPT-4 Turbo",
          "provider": "OpenAI",
          "purpose": "Advanced text generation",
          "enabled": true,
          "costPerRequest": 0.03,
          "config": {
            "apiKey": "sk-...",
            "maxTokens": 4096
          }
        }
      ],
      "rateLimit": 100,
      "timeout": 30
    },
    "notifications": {
      "email": {
        "transactional": true,
        "marketing": false,
        "systemAlerts": true,
        "weeklyReports": true
      },
      "sms": {
        "criticalAlerts": true,
        "orderUpdates": false,
        "securityAlerts": true
      }
    },
    "general": {
      "platformName": "TBM & Bogat",
      "supportEmail": "support@tbm-bogat.com",
      "timezone": "America/New_York",
      "dateFormat": "MM/DD/YYYY",
      "maintenanceMode": false
    }
  }
}
```

### 2.2 Update Payment Settings

**Endpoint:** `PUT /api/admin/settings/payment`

**Request Payload:**
```json
{
  "fees": {
    "basePlatformFee": 2.5,
    "fixedFeePerTransaction": 0.30,
    "defaultCurrency": "USD"
  },
  "gateways": [
    {
      "id": "stripe",
      "enabled": true,
      "config": {
        "publicKey": "pk_live_...",
        "secretKey": "sk_live_...",
        "webhookSecret": "whsec_..."
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment settings updated successfully",
  "data": {
    "fees": {
      "basePlatformFee": 2.5,
      "fixedFeePerTransaction": 0.30,
      "defaultCurrency": "USD"
    },
    "updatedAt": "2026-02-12T10:30:00Z"
  }
}
```

### 2.3 Toggle Payment Gateway

**Endpoint:** `PATCH /api/admin/settings/payment/gateway/{gatewayId}/toggle`

**Request Payload:**
```json
{
  "enabled": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment gateway toggled successfully",
  "data": {
    "gatewayId": "stripe",
    "enabled": true,
    "updatedAt": "2026-02-12T10:30:00Z"
  }
}
```

### 2.4 Update AI Configuration

**Endpoint:** `PUT /api/admin/settings/ai`

**Request Payload:**
```json
{
  "models": [
    {
      "id": "gpt-4",
      "enabled": true,
      "config": {
        "apiKey": "sk-...",
        "maxTokens": 4096,
        "temperature": 0.7
      }
    },
    {
      "id": "claude-3",
      "enabled": true,
      "config": {
        "apiKey": "sk-ant-...",
        "maxTokens": 4096
      }
    }
  ],
  "rateLimit": 100,
  "timeout": 30
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI configuration updated successfully",
  "data": {
    "modelsUpdated": 2,
    "updatedAt": "2026-02-12T10:30:00Z"
  }
}
```

### 2.5 Toggle AI Model

**Endpoint:** `PATCH /api/admin/settings/ai/model/{modelId}/toggle`

**Request Payload:**
```json
{
  "enabled": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI model toggled successfully",
  "data": {
    "modelId": "gpt-4",
    "enabled": false,
    "updatedAt": "2026-02-12T10:30:00Z"
  }
}
```

### 2.6 Update Notification Settings

**Endpoint:** `PUT /api/admin/settings/notifications`

**Request Payload:**
```json
{
  "email": {
    "transactional": true,
    "marketing": false,
    "systemAlerts": true,
    "weeklyReports": true
  },
  "sms": {
    "criticalAlerts": true,
    "orderUpdates": false,
    "securityAlerts": true
  },
  "push": {
    "realTimeUpdates": true,
    "promotions": false,
    "newsAndAnnouncements": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification settings updated successfully",
  "data": {
    "email": {
      "transactional": true,
      "marketing": false,
      "systemAlerts": true,
      "weeklyReports": true
    },
    "updatedAt": "2026-02-12T10:30:00Z"
  }
}
```

### 2.7 Update General Settings

**Endpoint:** `PUT /api/admin/settings/general`

**Request Payload:**
```json
{
  "platformName": "TBM & Bogat",
  "supportEmail": "support@tbm-bogat.com",
  "timezone": "America/New_York",
  "dateFormat": "MM/DD/YYYY",
  "maintenanceMode": false,
  "apiRateLimit": 1000,
  "sessionTimeout": 30
}
```

**Response:**
```json
{
  "success": true,
  "message": "General settings updated successfully",
  "data": {
    "platformName": "TBM & Bogat",
    "updatedAt": "2026-02-12T10:30:00Z"
  }
}
```

---

## 3. User Management

### 3.1 Get All Users

**Endpoint:** `GET /api/admin/users`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `search` (optional): Search by name or email
- `role` (optional): Filter by role (`user`, `admin`, `super_admin`)
- `status` (optional): Filter by status (`active`, `suspended`, `pending`)
- `sortBy` (default: `createdAt`)
- `order` (default: `desc`)

**Example:** `GET /api/admin/users?page=1&limit=20&role=user&status=active`

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "email": "john.doe@example.com",
        "name": "John Doe",
        "role": "user",
        "status": "active",
        "emailVerified": true,
        "avatar": "https://...",
        "createdAt": "2026-01-15T10:30:00Z",
        "lastLoginAt": "2026-02-12T08:15:00Z",
        "metadata": {
          "totalOrders": 5,
          "totalSpent": 2500.00,
          "accountAge": "28 days"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 100,
      "limit": 20,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

### 3.2 Get User Details

**Endpoint:** `GET /api/admin/users/{userId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "john.doe@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "role": "user",
      "status": "active",
      "emailVerified": true,
      "phoneVerified": false,
      "avatar": "https://...",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      },
      "preferences": {
        "emailNotifications": true,
        "smsNotifications": false
      },
      "createdAt": "2026-01-15T10:30:00Z",
      "updatedAt": "2026-02-10T14:20:00Z",
      "lastLoginAt": "2026-02-12T08:15:00Z"
    },
    "stats": {
      "totalOrders": 5,
      "completedOrders": 4,
      "cancelledOrders": 1,
      "totalSpent": 2500.00,
      "averageOrderValue": 500.00,
      "lifetimeValue": 2500.00
    },
    "recentActivity": [
      {
        "type": "order_placed",
        "orderId": "order_456",
        "timestamp": "2026-02-10T14:20:00Z"
      }
    ]
  }
}
```

### 3.3 Create User

**Endpoint:** `POST /api/admin/users`

**Request Payload:**
```json
{
  "email": "newuser@example.com",
  "name": "New User",
  "password": "SecurePassword123!",
  "phone": "+1234567890",
  "role": "user",
  "status": "active",
  "emailVerified": false,
  "sendWelcomeEmail": true,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": "user_789",
    "email": "newuser@example.com",
    "name": "New User",
    "role": "user",
    "status": "active",
    "createdAt": "2026-02-12T10:30:00Z"
  }
}
```

### 3.4 Update User

**Endpoint:** `PUT /api/admin/users/{userId}`

**Request Payload:**
```json
{
  "name": "Updated Name",
  "phone": "+1234567890",
  "role": "user",
  "status": "active",
  "address": {
    "street": "456 New St",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001",
    "country": "USA"
  },
  "preferences": {
    "emailNotifications": false,
    "smsNotifications": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "userId": "user_123",
    "name": "Updated Name",
    "updatedAt": "2026-02-12T10:30:00Z"
  }
}
```

### 3.5 Suspend User

**Endpoint:** `PATCH /api/admin/users/{userId}/suspend`

**Request Payload:**
```json
{
  "reason": "Violation of terms of service",
  "duration": "permanent",
  "notifyUser": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User suspended successfully",
  "data": {
    "userId": "user_123",
    "status": "suspended",
    "suspendedAt": "2026-02-12T10:30:00Z",
    "suspendedBy": "admin_456"
  }
}
```

### 3.6 Reactivate User

**Endpoint:** `PATCH /api/admin/users/{userId}/reactivate`

**Request Payload:**
```json
{
  "notifyUser": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User reactivated successfully",
  "data": {
    "userId": "user_123",
    "status": "active",
    "reactivatedAt": "2026-02-12T10:30:00Z"
  }
}
```

### 3.7 Delete User

**Endpoint:** `DELETE /api/admin/users/{userId}`

**Request Payload:**
```json
{
  "permanentDelete": false,
  "reason": "User requested account deletion",
  "transferOrders": true,
  "transferToUserId": "user_999"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "userId": "user_123",
    "deletedAt": "2026-02-12T10:30:00Z",
    "deletedBy": "admin_456"
  }
}
```

---

## 4. Order Management

### 4.1 Get All Orders

**Endpoint:** `GET /api/admin/orders`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `search` (optional): Search by order ID, user name, or email
- `status` (optional): `pending`, `processing`, `completed`, `cancelled`, `refunded`
- `dateFrom` (optional): ISO 8601 date
- `dateTo` (optional): ISO 8601 date
- `minAmount` (optional): Minimum order amount
- `maxAmount` (optional): Maximum order amount
- `sortBy` (default: `createdAt`)
- `order` (default: `desc`)

**Example:** `GET /api/admin/orders?page=1&limit=20&status=pending&dateFrom=2026-02-01`

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order_123",
        "orderNumber": "ORD-2026-0001",
        "user": {
          "id": "user_456",
          "name": "John Doe",
          "email": "john.doe@example.com"
        },
        "items": [
          {
            "productId": "prod_789",
            "name": "Oak Flooring - Premium",
            "quantity": 100,
            "unitPrice": 25.00,
            "total": 2500.00
          }
        ],
        "subtotal": 2500.00,
        "tax": 200.00,
        "shipping": 50.00,
        "discount": 0.00,
        "total": 2750.00,
        "status": "pending",
        "paymentMethod": "stripe",
        "paymentStatus": "pending",
        "shippingAddress": {
          "name": "John Doe",
          "street": "123 Main St",
          "city": "New York",
          "state": "NY",
          "zipCode": "10001",
          "country": "USA"
        },
        "createdAt": "2026-02-12T10:30:00Z",
        "updatedAt": "2026-02-12T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalOrders": 200,
      "limit": 20,
      "hasNextPage": true,
      "hasPreviousPage": false
    },
    "summary": {
      "totalRevenue": 55000.00,
      "averageOrderValue": 275.00,
      "totalOrders": 200
    }
  }
}
```

### 4.2 Get Order Details

**Endpoint:** `GET /api/admin/orders/{orderId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order_123",
      "orderNumber": "ORD-2026-0001",
      "user": {
        "id": "user_456",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+1234567890"
      },
      "items": [
        {
          "id": "item_001",
          "productId": "prod_789",
          "name": "Oak Flooring - Premium",
          "sku": "OAK-PREM-001",
          "quantity": 100,
          "unitPrice": 25.00,
          "total": 2500.00,
          "imageUrl": "https://..."
        }
      ],
      "pricing": {
        "subtotal": 2500.00,
        "tax": 200.00,
        "taxRate": 0.08,
        "shipping": 50.00,
        "discount": 0.00,
        "discountCode": null,
        "platformFee": 62.50,
        "total": 2750.00
      },
      "status": "pending",
      "statusHistory": [
        {
          "status": "pending",
          "timestamp": "2026-02-12T10:30:00Z",
          "updatedBy": "system",
          "note": "Order created"
        }
      ],
      "payment": {
        "method": "stripe",
        "status": "pending",
        "transactionId": null,
        "paidAt": null
      },
      "shipping": {
        "method": "standard",
        "carrier": "FedEx",
        "trackingNumber": null,
        "estimatedDelivery": "2026-02-20",
        "address": {
          "name": "John Doe",
          "street": "123 Main St",
          "city": "New York",
          "state": "NY",
          "zipCode": "10001",
          "country": "USA",
          "phone": "+1234567890"
        }
      },
      "notes": {
        "customer": "Please deliver before 5 PM",
        "admin": "VIP customer - priority shipping"
      },
      "createdAt": "2026-02-12T10:30:00Z",
      "updatedAt": "2026-02-12T10:30:00Z"
    }
  }
}
```

### 4.3 Update Order Status

**Endpoint:** `PATCH /api/admin/orders/{orderId}/status`

**Request Payload:**
```json
{
  "status": "processing",
  "note": "Payment confirmed, preparing shipment",
  "notifyCustomer": true,
  "metadata": {
    "processedBy": "admin_456",
    "warehouse": "warehouse_001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "orderId": "order_123",
    "oldStatus": "pending",
    "newStatus": "processing",
    "updatedAt": "2026-02-12T10:30:00Z",
    "updatedBy": "admin_456"
  }
}
```

### 4.4 Add Tracking Information

**Endpoint:** `PATCH /api/admin/orders/{orderId}/tracking`

**Request Payload:**
```json
{
  "carrier": "FedEx",
  "trackingNumber": "1234567890",
  "shippedAt": "2026-02-12T10:30:00Z",
  "estimatedDelivery": "2026-02-20",
  "notifyCustomer": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tracking information added successfully",
  "data": {
    "orderId": "order_123",
    "carrier": "FedEx",
    "trackingNumber": "1234567890",
    "trackingUrl": "https://fedex.com/track/1234567890",
    "updatedAt": "2026-02-12T10:30:00Z"
  }
}
```

### 4.5 Process Refund

**Endpoint:** `POST /api/admin/orders/{orderId}/refund`

**Request Payload:**
```json
{
  "amount": 2750.00,
  "reason": "Customer requested cancellation",
  "refundShipping": true,
  "restockItems": true,
  "notifyCustomer": true,
  "items": [
    {
      "itemId": "item_001",
      "quantity": 100
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Refund processed successfully",
  "data": {
    "orderId": "order_123",
    "refundId": "refund_789",
    "amount": 2750.00,
    "status": "refunded",
    "refundedAt": "2026-02-12T10:30:00Z",
    "processedBy": "admin_456"
  }
}
```

### 4.6 Cancel Order

**Endpoint:** `PATCH /api/admin/orders/{orderId}/cancel`

**Request Payload:**
```json
{
  "reason": "Out of stock",
  "refundPayment": true,
  "restockItems": true,
  "notifyCustomer": true,
  "note": "Item temporarily unavailable, full refund issued"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "orderId": "order_123",
    "status": "cancelled",
    "refundIssued": true,
    "cancelledAt": "2026-02-12T10:30:00Z",
    "cancelledBy": "admin_456"
  }
}
```

---

## 5. Analytics

### 5.1 Get Dashboard Overview

**Endpoint:** `GET /api/admin/analytics/overview`

**Query Parameters:**
- `period` (optional): `today`, `week`, `month`, `year`, `custom`
- `startDate` (optional): ISO 8601 date (required if period=custom)
- `endDate` (optional): ISO 8601 date (required if period=custom)

**Example:** `GET /api/admin/analytics/overview?period=month`

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 125000.00,
      "revenueGrowth": 15.5,
      "totalOrders": 450,
      "ordersGrowth": 8.2,
      "averageOrderValue": 277.78,
      "avgOrderGrowth": 6.7,
      "totalCustomers": 1250,
      "customersGrowth": 12.3,
      "conversionRate": 3.6,
      "conversionGrowth": -0.5
    },
    "revenue": {
      "daily": [
        {
          "date": "2026-02-01",
          "amount": 4500.00,
          "orders": 16
        },
        {
          "date": "2026-02-02",
          "amount": 5200.00,
          "orders": 19
        }
      ],
      "byCategory": [
        {
          "category": "Flooring",
          "revenue": 75000.00,
          "percentage": 60
        },
        {
          "category": "Lighting",
          "revenue": 35000.00,
          "percentage": 28
        }
      ],
      "byPaymentMethod": [
        {
          "method": "stripe",
          "revenue": 100000.00,
          "percentage": 80
        },
        {
          "method": "paypal",
          "revenue": 25000.00,
          "percentage": 20
        }
      ]
    },
    "topProducts": [
      {
        "productId": "prod_789",
        "name": "Oak Flooring - Premium",
        "revenue": 25000.00,
        "quantitySold": 1000,
        "orders": 40
      }
    ],
    "topCustomers": [
      {
        "userId": "user_456",
        "name": "John Doe",
        "totalSpent": 5500.00,
        "orders": 8
      }
    ],
    "period": {
      "start": "2026-02-01T00:00:00Z",
      "end": "2026-02-28T23:59:59Z"
    }
  }
}
```

### 5.2 Get Revenue Analytics

**Endpoint:** `GET /api/admin/analytics/revenue`

**Query Parameters:**
- `period`: `daily`, `weekly`, `monthly`, `yearly`
- `startDate`: ISO 8601 date
- `endDate`: ISO 8601 date
- `groupBy` (optional): `day`, `week`, `month`, `category`, `product`

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 125000.00,
    "growth": 15.5,
    "breakdown": [
      {
        "period": "2026-02-01",
        "revenue": 4500.00,
        "orders": 16,
        "averageOrderValue": 281.25
      }
    ],
    "byCategory": [
      {
        "category": "Flooring",
        "revenue": 75000.00,
        "orders": 300,
        "percentage": 60
      }
    ],
    "trends": {
      "moving Average": 4166.67,
      "projected": 130000.00
    }
  }
}
```

### 5.3 Get User Analytics

**Endpoint:** `GET /api/admin/analytics/users`

**Query Parameters:**
- `period`: `today`, `week`, `month`, `year`

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 1250,
    "new": 45,
    "growth": 12.3,
    "active": 850,
    "activePercentage": 68,
    "retention": {
      "rate": 75.5,
      "cohorts": [
        {
          "cohort": "2026-01",
          "users": 100,
          "retained": 75,
          "retentionRate": 75
        }
      ]
    },
    "demographics": {
      "byLocation": [
        {
          "country": "USA",
          "users": 900,
          "percentage": 72
        }
      ],
      "bySource": [
        {
          "source": "organic",
          "users": 500,
          "percentage": 40
        }
      ]
    }
  }
}
```

### 5.4 Get Order Analytics

**Endpoint:** `GET /api/admin/analytics/orders`

**Query Parameters:**
- `period`: `today`, `week`, `month`, `year`
- `startDate` (optional): ISO 8601 date
- `endDate` (optional): ISO 8601 date

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 450,
    "growth": 8.2,
    "averageValue": 277.78,
    "byStatus": [
      {
        "status": "completed",
        "count": 350,
        "percentage": 77.8
      },
      {
        "status": "pending",
        "count": 50,
        "percentage": 11.1
      },
      {
        "status": "cancelled",
        "count": 30,
        "percentage": 6.7
      }
    ],
    "fulfillment": {
      "averageProcessingTime": "2.5 hours",
      "averageShippingTime": "3.2 days",
      "onTimeDeliveryRate": 92.5
    },
    "returns": {
      "count": 20,
      "rate": 4.4,
      "topReasons": [
        {
          "reason": "Wrong item delivered",
          "count": 8
        }
      ]
    }
  }
}
```

---

## 6. Content Management

### 6.1 Get All Products

**Endpoint:** `GET /api/admin/products`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `category` (optional)
- `status` (optional): `active`, `draft`, `archived`
- `search` (optional)
- `sortBy` (default: `createdAt`)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_789",
        "name": "Oak Flooring - Premium",
        "sku": "OAK-PREM-001",
        "category": "Flooring",
        "price": 25.00,
        "stock": 5000,
        "status": "active",
        "imageUrl": "https://...",
        "createdAt": "2026-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalProducts": 100,
      "limit": 20
    }
  }
}
```

### 6.2 Create Product

**Endpoint:** `POST /api/admin/products`

**Request Payload:**
```json
{
  "name": "Oak Flooring - Premium",
  "sku": "OAK-PREM-001",
  "description": "High-quality oak flooring with premium finish",
  "category": "Flooring",
  "price": 25.00,
  "compareAtPrice": 30.00,
  "stock": 5000,
  "lowStockThreshold": 100,
  "status": "active",
  "images": [
    {
      "url": "https://...",
      "alt": "Oak flooring front view",
      "order": 0
    }
  ],
  "specifications": {
    "material": "Oak",
    "finish": "Matte",
    "dimensions": "48x6 inches",
    "weight": "2.5 lbs"
  },
  "seo": {
    "title": "Premium Oak Flooring | TBM & Bogat",
    "description": "High-quality oak flooring...",
    "keywords": ["oak flooring", "premium flooring"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "productId": "prod_789",
    "name": "Oak Flooring - Premium",
    "status": "active",
    "createdAt": "2026-02-12T10:30:00Z"
  }
}
```

### 6.3 Update Product

**Endpoint:** `PUT /api/admin/products/{productId}`

**Request Payload:** Same as Create Product

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "productId": "prod_789",
    "updatedAt": "2026-02-12T10:30:00Z"
  }
}
```

### 6.4 Delete Product

**Endpoint:** `DELETE /api/admin/products/{productId}`

**Request Payload:**
```json
{
  "archive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "productId": "prod_789",
    "deletedAt": "2026-02-12T10:30:00Z"
  }
}
```

---

## Validation Rules

### Payment Settings
- `basePlatformFee`: Number, min: 0, max: 100
- `fixedFeePerTransaction`: Number, min: 0
- `defaultCurrency`: String, enum: ["USD", "EUR", "GBP", "CAD", "AUD"]

### User Management
- `email`: Valid email format, unique
- `password`: Min 8 characters, requires uppercase, lowercase, number, special character
- `role`: enum: ["user", "admin", "super_admin"]
- `status`: enum: ["active", "suspended", "pending"]

### Order Management
- `status`: enum: ["pending", "processing", "shipped", "completed", "cancelled", "refunded"]
- `paymentStatus`: enum: ["pending", "paid", "failed", "refunded"]
- `refundAmount`: Number, min: 0, max: order total

---

## Rate Limiting

All admin endpoints are rate-limited to prevent abuse:

- **Default:** 1000 requests per hour per admin user
- **Authentication:** 10 requests per minute
- **Analytics:** 100 requests per hour
- **Bulk operations:** 50 requests per hour

**Rate Limit Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1676203200
```

---

## Webhooks

Configure webhooks to receive real-time notifications:

**Endpoint:** `POST /api/admin/webhooks`

**Request Payload:**
```json
{
  "url": "https://your-server.com/webhooks",
  "events": [
    "order.created",
    "order.updated",
    "order.completed",
    "user.created",
    "payment.completed"
  ],
  "secret": "your_webhook_secret"
}
```

**Webhook Payload Example:**
```json
{
  "event": "order.completed",
  "timestamp": "2026-02-12T10:30:00Z",
  "data": {
    "orderId": "order_123",
    "userId": "user_456",
    "total": 2750.00
  },
  "signature": "sha256=..."
}
```

---

## Best Practices

1. **Authentication:** Always include the Bearer token in the Authorization header
2. **Error Handling:** Check the `success` field in responses
3. **Pagination:** Use pagination for large datasets
4. **Rate Limiting:** Implement exponential backoff for rate limit errors
5. **Idempotency:** Use idempotency keys for critical operations
6. **Logging:** Log all admin actions for audit purposes
7. **Validation:** Validate all input data before sending requests
8. **Security:** Never expose API keys or secrets in client-side code

---

## Support

For API support and questions:
- **Email:** api-support@tbm-bogat.com
- **Documentation:** https://docs.tbm-bogat.com/api
- **Status Page:** https://status.tbm-bogat.com
