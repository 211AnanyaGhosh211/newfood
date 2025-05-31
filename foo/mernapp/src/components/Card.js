
import React, { useEffect, useRef, useState } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';

function Card(props) {
  let dispatch = useDispatchCart();
  let data = useCart();
  const priceRef = useRef();
  let options = props.options;
  let priceOptions = Object.keys(options);

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [showControls, setShowControls] = useState(false);

  // Function to handle adding to cart
  const handleAddToCart = async () => {
    let food = data.find(item => item.id === props.foodItem._id);
    
    if (food) {
      // If item exists in cart, update it
      await dispatch({
        type: "UPDATE",
        id: props.foodItem._id,
        price: parseInt(options[size]),
        qty: qty,
        size: size
      });
    } else {
      // If item doesn't exist, add it
      await dispatch({
        type: "ADD",
        id: props.foodItem._id,
        name: props.foodItem.name,
        price: parseInt(options[size]),
        qty: qty,
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
  }

  useEffect(() => {
    setSize(priceRef.current.value)
  }, []);

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
