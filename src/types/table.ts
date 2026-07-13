export interface MenuItem {
  id: number
  name: string
  description: string | null
  price: number | string
  restaurantId: number
  menuCategoryId: number
  createdAt: string
  updatedAt: string
}

export interface MenuCategory {
  id: number
  name: string
  restaurantId: number
  createdAt: string
  updatedAt: string
  menuItems: MenuItem[]
}

export interface Restaurant {
  id: number
  name: string
  city: string
  address: string
  description: string | null
  phone: string
  userId: number
  createdAt: string
  updatedAt: string
  menuCategories: MenuCategory[]
}

export interface TableDetails {
  id: number
  name: string
  qrToken: string
  restaurantId: number
  createdAt: string
  updatedAt: string
  restaurant: Restaurant
}