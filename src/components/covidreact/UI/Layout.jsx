import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react"
import Footer from "./footer";
import Nav from "./Nav";
import Header from "./Header";

function Layout({ children }) {





  return (
    <>
      <section className='container-fluid'>
        <Header />
        <Nav />


        {children}

        <Footer />
      </section></>
  )
}
export default Layout;


const SiteConstA = () => (<div className="col-md-12   red lighten-1 p-1 mt-0 w-100 ">
  <h5 className="text-center text-white  p-2">Copyright  &copy; 2012 - {new Date().getFullYear()}  All Rights Reserved. </h5>
</div>)