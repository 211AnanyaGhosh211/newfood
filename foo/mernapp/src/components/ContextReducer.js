import React , {createContext, useContext, useReducer} from 'react'
const CartStateContext = createContext();
const cartDispatchContext = createContext();
const reducer = (state,action)=>{
switch(action.type){
  case "ADD":
    return [...state, {id:action.id, name: action.name, price: action.price, qty: action.qty, size: action.size}]
  case "DELETE":
    return state.filter(item => item.id !== action.id);
  case "UPDATE":
    let arr = [...state];
    const itemIndex = arr.findIndex(food => food.id === action.id);
    if (itemIndex !== -1) {
      const updatedItem = {
        ...arr[itemIndex],
        qty: parseInt(action.qty),
        price: parseInt(action.price) * parseInt(action.qty)
      };
      arr[itemIndex] = updatedItem;
    }
    return arr;
  case "DROP":
    return []
  default:
    return state
    



}
};
export const CartProvider = ({children}) => {
  const[state,dispatch]= useReducer(reducer,[])
  return (
    <cartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </cartDispatchContext.Provider>
    
  )
}
export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(cartDispatchContext);
