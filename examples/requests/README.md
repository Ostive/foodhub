# API Request Examples

This directory contains example JSON files showing how to interact with the Food Delivery API.

## Available Examples

### User Management
1. `create-customer.json` - Create a regular customer account
2. `create-restaurant.json` - Create a restaurant owner account
3. `create-delivery.json` - Create a delivery person account

### Restaurant Operations
4. `create-menu.json` - Create a new menu
5. `create-dish.json` - Add a new dish

### Order Management
6. `create-order.json` - Place a new order

## How to Use

You can use these examples with tools like cURL, Postman, or any HTTP client. Each JSON file contains:
- The endpoint URL
- Required headers
- Example request body

### Using with cURL

```bash
# For creating a customer
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d @create-customer.json

# For creating a restaurant owner
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d @create-restaurant.json

# For creating a delivery person
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d @create-delivery.json
```

### Using with Postman
1. Create a new POST request
2. Set the URL from the example file
3. Add the headers as specified
4. Copy the body content into the request body
5. Send the request

## Notes
- Make sure the server is running before making requests
- The default port is 3000, adjust if your configuration is different
- Passwords must contain at least one uppercase letter, one lowercase letter, and one number
- All email addresses must be unique in the system
