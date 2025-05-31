import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartStateContext = createContext();
const cartDispatchContext = createContext();

const reducer = (state = [], action) => {
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
      localStorage.setItem('cart', JSON.stringify(newState));
      return newState;
    case "DELETE":
      const newStates = state.filter(item => item.id !== action.id);
      localStorage.setItem('cart', JSON.stringify(newStates));
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
      localStorage.setItem('cart', JSON.stringify(arr));
      return arr;
    case "DROP":
      localStorage.removeItem('cart');
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: "LOAD", payload: JSON.parse(savedCart) });
    }
  }, []);

  return (
    <cartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </cartDispatchContext.Provider>
  );

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