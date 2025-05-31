
import React, { useEffect, useRef, useState } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';

function Card(props) {
  let dispatch = useDispatchCart();
  let data = useCart();
  const priceRef = useRef();
  let options = props.options;
  let priceOptions = Object.keys(options);
  const userEmail = localStorage.getItem('userEmail');

  // Initialize qty with existing cart quantity if item exists
  const [qty, setQty] = useState(() => {
    if (!data) return 1;
    const existingItem = data.find(item => item.id === props.foodItem._id);
    return existingItem ? existingItem.qty : 1;
  });
  // Initialize showControls based on cart state
  const [showControls, setShowControls] = useState(() => {
    if (!data) return false;
    const existingItem = data.find(item => item.id === props.foodItem._id);
    return !!existingItem; // Show controls if item exists in cart
  });
  const [size, setSize] = useState("");

  // Function to handle adding to cart
  const handleAddToCart = async () => {
    if (!data) {
      // If cart is null, add item with qty 1
      await dispatch({
        type: "ADD",
        id: props.foodItem._id,
        name: props.foodItem.name,
        price: parseInt(options[size]),
        qty: 1,
        size: size
      });
      setShowControls(true);
      return;
    }

    // If cart exists, check if item already exists
    const existingItem = data.find(item => item.id === props.foodItem._id);
    if (existingItem) {
      // If item exists, update it with qty 1
      await dispatch({
        type: "UPDATE",
        id: props.foodItem._id,
        price: parseInt(options[size]),
        qty: 1,
        size: size
      });
    } else {
      // If item doesn't exist, add it with qty 1
      await dispatch({
        type: "ADD",
        id: props.foodItem._id,
        name: props.foodItem.name,
        price: parseInt(options[size]),
        qty: 1,
        size: size
      });
    }
    setShowControls(true);
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
    // Re-enable the Add to Cart button
    setShowControls(false);
  }

  useEffect(() => {
    setSize(priceRef.current.value)
    // Update qty and showControls when cart data changes
    if (!data) {
      setQty(1);
      setShowControls(false);
      return;
    }
    
    const existingItem = data.find(item => item.id === props.foodItem._id);
    if (existingItem) {
      setQty(existingItem.qty);
      setShowControls(true); // Show controls if item exists in cart
    } else {
      setQty(1);
      setShowControls(false); // Hide controls if item is not in cart
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
            <button className="btn btn-success justify-center ms-2"
              onClick={() => {
                setShowControls(true);
                handleAddToCart();
              }}
              disabled={showControls}
              style={{ cursor: showControls ? 'not-allowed' : 'pointer' }}
            >
              {showControls ? 'Added' : 'Add To Cart'}
            </button>
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
