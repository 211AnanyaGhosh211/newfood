
import React, { useEffect, useRef, useState } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';

function Card(props) {
  let dispatch = useDispatchCart();
  let data = useCart();
  const priceRef = useRef();
  let options = props.options;
  let priceOptions = Object.keys(options);

  // Initialize qty with existing cart quantity if item exists
  const [qty, setQty] = useState(() => {
    const existingItem = data.find(item => item.id === props.foodItem._id);
    return existingItem ? existingItem.qty : 1;
  });
  const [size, setSize] = useState("");
  const [showControls, setShowControls] = useState(false);

  // Function to handle adding to cart
  const handleAddToCart = async () => {
    let food = data.find(item => item.id === props.foodItem._id);
    
    if (food) {
      // If item exists in cart, update it with a fixed quantity of 1
      await dispatch({
        type: "UPDATE",
        id: props.foodItem._id,
        price: parseInt(options[size]),
        qty: food.qty + 1, // Always add 1
        size: size
      });
    } else {
      // If item doesn't exist, add it with a fixed quantity of 1
      await dispatch({
        type: "ADD",
        id: props.foodItem._id,
        name: props.foodItem.name,
        price: parseInt(options[size]),
        qty: 1, // Always start with 1
        size: size
      });
    }
  }

  // Function to handle quantity changes
  const handleQuantityChange = async (newQty) => {
    setQty(newQty);
    await dispatch({
      type: "UPDATE",
      id: props.foodItem._id,
      price: parseInt(options[size]),
      qty: newQty,
      size: size
    });
  }

  // Function to handle delete
  const handleDelete = async () => {
    await dispatch({
      type: "DELETE",
      id: props.foodItem._id
    });
    setShowControls(false);
    // Reset quantity to 1 after deletion
    setQty(1);
  }

  useEffect(() => {
    setSize(priceRef.current.value)
    // Update qty when cart data changes
    const existingItem = data.find(item => item.id === props.foodItem._id);
    if (existingItem) {
      setQty(existingItem.qty);
    } else {
      // Reset to 1 if item is not in cart
      setQty(1);
    }
  }, [data]);

  return (
    <div>
      <div className="card mt-3" style={{ width: "18rem", maxHeight: "360px" }}>
        <img src={props.foodItem.img} className="card-img-top" alt="Card Image" style={{height:"120px",objectFit:"fill"}}/>
        <div className="card-body">
          <h5 className="card-title">{props.foodItem.name}</h5>
          <p className="card-text">
            This is some important text
          </p>
          <div className="container w-100">
            <select className="m-2 h-100 bg-success rounded" ref={priceRef} onChange={(e) => setSize(e.target.value)}>
              {priceOptions.map((data) => {
                return <option key={data} value={data}>{data}</option>
              })}
            </select>
            <div className="d-inline h-100 fs-5">{options[size]}</div>
          </div>
          <hr></hr>
          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-success justify-center ms-2" onClick={() => {
              setShowControls(true);
              handleAddToCart();
            }}>Add To Cart</button>
            {showControls && (
              <div className="d-flex align-items-center">
                <button className="btn btn-danger" onClick={handleDelete}>
                  <i className="fas fa-trash"></i>
                </button>
                <button className="btn btn-success" onClick={() => handleQuantityChange(Math.max(1, qty - 1))}>-</button>
                <span className="mx-2">{qty}</span>
                <button className="btn btn-success" onClick={() => handleQuantityChange(qty + 1)}>+</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
