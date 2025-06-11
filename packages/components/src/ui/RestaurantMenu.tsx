import React from 'react';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  dietary?: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    nutFree?: boolean;
  };
  available: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface RestaurantMenuProps {
  categories: MenuCategory[];
  onItemClick?: (item: MenuItem) => void;
  currency?: string;
  showImages?: boolean;
  showDietaryInfo?: boolean;
  className?: string;
}

/**
 * A customizable restaurant menu component that displays menu items organized by categories.
 * 
 * @example
 * ```tsx
 * import { RestaurantMenu } from '@foodhub/components';
 * 
 * const menuData = [
 *   {
 *     id: 'starters',
 *     name: 'Starters',
 *     items: [
 *       {
 *         id: '1',
 *         name: 'Garlic Bread',
 *         description: 'Freshly baked bread with garlic butter',
 *         price: 4.99,
 *         category: 'starters',
 *         available: true,
 *         dietary: { vegetarian: true }
 *       }
 *     ]
 *   }
 * ];
 * 
 * function MenuPage() {
 *   return <RestaurantMenu categories={menuData} currency="$" showImages={true} />;
 * }
 * ```
 */
export const RestaurantMenu: React.FC<RestaurantMenuProps> = ({
  categories,
  onItemClick,
  currency = '$',
  showImages = true,
  showDietaryInfo = true,
  className = '',
}) => {
  return (
    <div className={`restaurant-menu ${className}`}>
      {categories.map((category) => (
        <div key={category.id} className="menu-category">
          <h2 className="category-name">{category.name}</h2>
          <div className="menu-items">
            {category.items.map((item) => (
              <div 
                key={item.id} 
                className={`menu-item ${!item.available ? 'unavailable' : ''}`}
                onClick={() => item.available && onItemClick && onItemClick(item)}
              >
                {showImages && item.imageUrl && (
                  <div className="item-image">
                    <img src={item.imageUrl} alt={item.name} />
                  </div>
                )}
                <div className="item-content">
                  <div className="item-header">
                    <h3 className="item-name">{item.name}</h3>
                    <span className="item-price">{currency}{item.price.toFixed(2)}</span>
                  </div>
                  <p className="item-description">{item.description}</p>
                  
                  {showDietaryInfo && item.dietary && (
                    <div className="dietary-info">
                      {item.dietary.vegetarian && <span className="vegetarian">Vegetarian</span>}
                      {item.dietary.vegan && <span className="vegan">Vegan</span>}
                      {item.dietary.glutenFree && <span className="gluten-free">Gluten Free</span>}
                      {item.dietary.nutFree && <span className="nut-free">Nut Free</span>}
                    </div>
                  )}
                  
                  {!item.available && <div className="unavailable-label">Currently Unavailable</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantMenu;
