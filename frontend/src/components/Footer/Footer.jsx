import React from "react";
import "./Footer.css";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <>
      <div className="footer-main">
        <div className="footer-top">
          <div className="footer-box footer-services">
            <h3>Services</h3>
            <ul>
              <li>
                <NavLink to="/">
                  <i class="fa-solid fa-house"></i>Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/menu">
                  <i class="fa-solid fa-book"></i>Menu
                </NavLink>
              </li>
              <li>
                <NavLink to="/cart">
                  <i class="fa-solid fa-bag-shopping"></i>Cart
                </NavLink>
              </li>
              <li>
                <NavLink to="/account">
                  <i class="fa-solid fa-user"></i>Account
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="footer-box social-links">
            <h1>
              <NavLink>Thai Chilli China</NavLink>
            </h1>
            <ul>
              <li>
                <NavLink to="https://www.facebook.com/people/Soni-Painting-Works/100064304703683/">
                  <i class="fa-brands fa-x-twitter"></i>
                </NavLink>
              </li>
              <li>
                <NavLink to="https://www.instagram.com/sonipaintin?igsh=ZDNyOGxoaG9tMTBk">
                  <i class="fa-brands fa-instagram"></i>
                </NavLink>
              </li>
              <li>
                <NavLink to="https://wa.me/+919022846640">
                  <i class="fa-brands fa-whatsapp"></i>
                </NavLink>
              </li>
              <li>
                <NavLink to="https://www.facebook.com/people/Soni-Painting-Works/100064304703683/">
                  <i class="fa-brands fa-facebook"></i>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            Copyright <span id="copyright"> © </span> 2024. Thai Chilli China.
            All Rights Reserved
          </p>
        </div>
      </div>
    </>
  );
}

export default Footer;
