# FoodHub Components

A reusable component library for restaurant owners and third-party developers integrating with the FoodHub ecosystem.

## Installation

```bash
npm install @foodhub/components
```

## Available Components

### UI Components

#### RestaurantMenu

A customizable restaurant menu component that displays menu items organized by categories.

```jsx
import { RestaurantMenu } from '@foodhub/components';

const menuData = [
  {
    id: 'starters',
    name: 'Starters',
    items: [
      {
        id: '1',
        name: 'Garlic Bread',
        description: 'Freshly baked bread with garlic butter',
        price: 4.99,
        category: 'starters',
        available: true,
        dietary: { vegetarian: true }
      }
    ]
  }
];

function MenuPage() {
  return <RestaurantMenu 
    categories={menuData} 
    currency="$" 
    showImages={true} 
    onItemClick={(item) => console.log('Item clicked:', item)}
  />;
}
```

### API Clients

#### FoodHubClient

A client for interacting with FoodHub API services.

```typescript
import { FoodHubClient } from '@foodhub/components';

const client = new FoodHubClient({
  baseUrl: 'https://api.foodhub.com',
  apiKey: 'your-api-key',
  restaurantId: 'your-restaurant-id'
});

// Get menu items
const menu = await client.getMenu();

// Update an item
await client.updateMenuItem('item-id', { price: 5.99 });

// Get orders
const orders = await client.getOrders('pending');

// Update order status
await client.updateOrderStatus('order-id', 'accepted');
```

### Hooks

#### useOrderManagement

A React hook for restaurant owners to manage orders in real-time.

```jsx
import { useOrderManagement, FoodHubClient } from '@foodhub/components';

function OrderDashboard() {
  const client = new FoodHubClient({
    baseUrl: 'https://api.foodhub.com',
    apiKey: 'your-api-key',
    restaurantId: 'your-restaurant-id'
  });
  
  const { 
    orders, 
    loading, 
    error, 
    updateOrderStatus,
    refreshOrders,
    changeStatusFilter,
    currentStatus
  } = useOrderManagement({ 
    client,
    pollingInterval: 30000, // Check for new orders every 30 seconds
    initialStatus: 'pending'
  });
  
  return (
    <div>
      <h1>Orders</h1>
      <div>
        <button onClick={() => changeStatusFilter('pending')}>Pending</button>
        <button onClick={() => changeStatusFilter('processing')}>Processing</button>
        <button onClick={() => changeStatusFilter('completed')}>Completed</button>
      </div>
      
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              Order #{order.id} - {order.status}
              <button onClick={() => updateOrderStatus(order.id, 'accepted')}>
                Accept
              </button>
              <button onClick={() => updateOrderStatus(order.id, 'rejected')}>
                Reject
              </button>
            </li>
          ))}
        </ul>
      )}
      
      <button onClick={refreshOrders}>Refresh Orders</button>
    </div>
  );
}
```

## Publishing and Distribution

To make your components available to third-party developers and restaurant owners, you'll need to:

1. Build the library:
   ```bash
   npm run build
   ```

2. Publish to npm:
   ```bash
   npm publish
   ```

## Customization

All components are designed to be customizable through props. For styling, you can use CSS classes passed through the `className` prop.

## License

MIT
