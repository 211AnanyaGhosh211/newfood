import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartStateContext = createContext();
const cartDispatchContext = createContext();

const reducer = (state = [], action) => {
  const userEmail = localStorage.getItem('userEmail');
  const cartKey = userEmail ? `cart_${userEmail}` : 'cart';

  // Clear cart when user logs out
  if (action.type === 'LOGOUT') {
    localStorage.removeItem(cartKey);
    return [];
  }

  switch (action.type) {
    case "LOAD":
      return action.payload || [];
    case "ADD":
      // Add item with quantity 1
      const newState = [...state, { 
        id: action.id, 
        name: action.name, 
        price: parseInt(action.price),
        qty: 1, // Always start with 1
        size: action.size,
        basePrice: parseInt(action.price)
      }];
      localStorage.setItem(cartKey, JSON.stringify(newState));
      return newState;
    case "DELETE":
      const newStates = state.filter(item => item.id !== action.id);
      localStorage.setItem(cartKey, JSON.stringify(newStates));
      return newStates;
    case "UPDATE":
      let arr = [...state];
      const itemIndex = arr.findIndex(food => food.id === action.id);
      if (itemIndex !== -1) {
        const basePrice = arr[itemIndex].basePrice || parseInt(action.price);
        // Update with the exact quantity from controls
        const updatedItem = {
          ...arr[itemIndex],
          qty: parseInt(action.qty),
          price: basePrice * parseInt(action.qty)
        };
        arr[itemIndex] = updatedItem;
      }
      localStorage.setItem(cartKey, JSON.stringify(arr));
      return arr;
    case "DROP":
      localStorage.removeItem(cartKey);
      return [];
    case "LOGOUT":
      localStorage.removeItem(cartKey);
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);
  const userEmail = localStorage.getItem('userEmail');
  const cartKey = userEmail ? `cart_${userEmail}` : 'cart';

  // Load cart data
  useEffect(() => {
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      dispatch({ type: "LOAD", payload: JSON.parse(savedCart) });
    }
  }, [userEmail]);

  // Clear cart when user logs out
  useEffect(() => {
    return () => {
      if (!userEmail) {
        localStorage.removeItem(cartKey);
      }
    };
  }, [userEmail]);

  return (
    <cartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </cartDispatchContext.Provider>
  );
};

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(cartDispatchContext);

// Function to refresh cart data
// Function to refresh cart data
export const refreshCart = () => {
  const userEmail = localStorage.getItem('userEmail');
  const cartKey = userEmail ? `cart_${userEmail}` : 'cart';
  const savedCart = localStorage.getItem(cartKey);
  return savedCart ? JSON.parse(savedCart) : [];
}