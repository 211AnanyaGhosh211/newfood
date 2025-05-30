import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../Modal";
import Badge from "react-bootstrap/Badge";
import Cart from "./screens/Cart";
import { useCart } from "./ContextReducer";
function Navbar() {
  let data = useCart();
  const [cartView, setCartView] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authtoken"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("authtoken"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false); // update state manually since localStorage event won't trigger
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand fs-1 fst-italic" to="/">
            Grab Your Food
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active fs-5" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              {isLoggedIn && (
                <li className="nav-item">
                  <Link className="nav-link active fs-5" to="/myorders">
                    My Orders
                  </Link>
                </li>
              )}
            </ul>

            <div className="d-flex">
              {!isLoggedIn ? (
                <>
                  <Link
                    className="btn btn-outline-light text-success bg-white mx-1"
                    to="/login"
                  >
                    Login
                  </Link>
                  <Link
                    className="btn btn-outline-light text-success bg-white mx-1"
                    to="/createuser"
                  >
                    Signup
                  </Link>
                </>
              ) : (
                <div>
                <button
                  className="btn btn-outline-light text-success bg-white mx-1"
                  onClick={() => setCartView(true)}
                >
                  My Cart {" "}
                  <Badge pill bg="danger">{data.length}</Badge>

                </button>
                {cartView ? <Modal onClose={()=>setCartView(false)}><Cart /></Modal>:null}
                <button
                  className="btn btn-outline-light text-success bg-white mx-1" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
