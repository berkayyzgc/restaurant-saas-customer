import { useEffect, useMemo, useState } from 'react'
import type { CartItem } from '../types/cart'
import type { MenuItem } from '../types/table'

export function useCart(storageKey?: string) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (!storageKey) {
      return []
    }

    try {
      const savedCart = localStorage.getItem(storageKey)

      if (!savedCart) {
        return []
      }

      return JSON.parse(savedCart) as CartItem[]
    } catch (error) {
      console.error('Sepet verisi okunamadı:', error)
      return []
    }
  })

  useEffect(() => {
    if (!storageKey) {
      return
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(cartItems))
    } catch (error) {
      console.error('Sepet verisi kaydedilemedi:', error)
    }
  }, [cartItems, storageKey])

  function addItem(item: MenuItem) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) => cartItem.item.id === item.id,
      )

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.item.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem,
        )
      }

      return [
        ...currentItems,
        {
          item,
          quantity: 1,
        },
      ]
    })
  }

  function increaseItem(itemId: number) {
    setCartItems((currentItems) =>
      currentItems.map((cartItem) =>
        cartItem.item.id === itemId
          ? {
              ...cartItem,
              quantity: cartItem.quantity + 1,
            }
          : cartItem,
      ),
    )
  }

  function decreaseItem(itemId: number) {
    setCartItems((currentItems) =>
      currentItems
        .map((cartItem) =>
          cartItem.item.id === itemId
            ? {
                ...cartItem,
                quantity: cartItem.quantity - 1,
              }
            : cartItem,
        )
        .filter((cartItem) => cartItem.quantity > 0),
    )
  }

  function removeItem(itemId: number) {
    setCartItems((currentItems) =>
      currentItems.filter((cartItem) => cartItem.item.id !== itemId),
    )
  }

  function clearCart() {
    setCartItems([])

    if (storageKey) {
      localStorage.removeItem(storageKey)
    }
  }

  const totalQuantity = useMemo(
    () =>
      cartItems.reduce(
        (total, cartItem) => total + cartItem.quantity,
        0,
      ),
    [cartItems],
  )

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (total, cartItem) =>
          total + Number(cartItem.item.price) * cartItem.quantity,
        0,
      ),
    [cartItems],
  )

  return {
    cartItems,
    totalQuantity,
    totalPrice,
    addItem,
    increaseItem,
    decreaseItem,
    removeItem,
    clearCart,
  }
}