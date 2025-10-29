# Testing Report: Packing Supplies Flow

This report summarizes the integration testing and validation performed for the "Purchase Packing Supplies" feature.

## Changed File Paths

### Backend (`BarbariBahar.API`)

- **`Controllers/ProductsController.cs`**: Modified to filter products by category ID and return a `ProductDto`.
- **`Controllers/GuestOrdersController.cs`**: Corrected a critical price calculation bug.
- **`Controllers/PackagingProductCategoriesController.cs`**: New controller added to provide product categories.
- **`Core/DTOs/Product/ProductDto.cs`**: Updated to include `CategoryName` and `ImageUrl`.
- **`Core/DTOs/Product/ProductCategoryDto.cs`**: New DTO added for product categories.
- **`Data/Entities/PackagingProduct.cs`**: (Reference) Reviewed to find the correct foreign key.

### Frontend (`BarbariBahar.Frontend`)

- **`src/services/api.ts`**: Added `fetchProducts` and `fetchProductCategories` functions.
- **`src/pages/Quote/ProductSelection.tsx`**: New page component created for this flow.
- **`src/pages/quote/ServiceTypeSelection.tsx`**: Modified to include a navigation link to the new product selection page.
- **`src/App.tsx`**: Modified to add the new route and fix a critical bug with the Toaster context placement.
- **`src/components/shared/Layout.tsx`**: Fixed a syntax error in a ternary operator.
- **`src/components/shared/AuthDialog.tsx`**: Fixed a syntax error by replacing placeholder code with a functional component.
- **`e2e/packing_supplies_flow.spec.ts`**: New Playwright test script created.
- **`package.json`**: Added `@playwright/test` dependency and a `test:e2e` script.
- **`playwright.config.ts`**: New config file added to improve debugging.


## Final Data Models for API Interaction

### 1. Create Guest Order

- **Request:** `POST /api/guest/orders`
- **Body:** `{}` (Empty JSON object)

### 2. Add/Update Packing Supplies

- **Request:** `PATCH /api/guest/orders/{id}`
- **Body (`UpdateGuestOrderDto`):**
  ```json
  {
    "packagingProducts": [
      {
        "productId": 1,
        "quantity": 1
      },
      {
        "productId": 2,
        "quantity": 2
      }
    ]
  }
  ```

## Successful API Test Results

### 1. Create Guest Order

- **Command:** `curl -X POST http://localhost:5085/api/guest/orders -H "Content-Type: application/json" -d '{}'`
- **Response:**
  ```json
  {"orderId":1}
  ```

### 2. Add Packing Supplies & Validate Calculation

- **Command:** `curl -X PATCH http://localhost:5085/api/guest/orders/1 -H "Content-Type: application/json" -d '{ "packagingProducts": [{ "productId": 1, "quantity": 1 }, { "productId": 2, "quantity": 2 }] }'`
- **Response:**
  ```json
  {
    "distancePrice": 0,
    "laborPrice": 0,
    "packingSupplies": [
      {
        "name": "کارتن سه لایه",
        "unitPrice": 50000,
        "quantity": 1,
        "subtotal": 50000
      },
      {
        "name": "نایلون حباب دار (متری)",
        "unitPrice": 25000,
        "quantity": 2,
        "subtotal": 50000
      }
    ],
    "totalPrice": 100000
  }
  ```

### 3. Error Handling - Negative Quantity

- **Command:** `curl -i -X PATCH http://localhost:5085/api/guest/orders/1 -H "Content-Type: application/json" -d '{ "packagingProducts": [{ "productId": 1, "quantity": -1 }] }'`
- **Response:**
  - **Status:** `400 Bad Request`
  - **Body:** `Item quantity must be positive.`

### 4. Error Handling - Invalid Product ID

- **Command:** `curl -i -X PATCH http://localhost:5085/api/guest/orders/1 -H "Content-Type: application/json" -d '{ "packagingProducts": [{ "productId": 999, "quantity": 1 }] }'`
- **Response:**
  - **Status:** `404 Not Found`
  - **Body:** `Product with ID 999 not found.`
