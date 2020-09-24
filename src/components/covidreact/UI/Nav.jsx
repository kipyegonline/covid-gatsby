import React, { useState, useEffect } from "react"
import { Link as NavLink } from "gatsby"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSpinner,
  faHome,
  faUmbrella,
  faChartLine,
  faUserCog,
  faArrowAltCircleUp,
  faTimes,
  faGlobeAfrica,
  faGlobe,
  faGlobeEurope,
} from "@fortawesome/free-solid-svg-icons"
import { icons } from "../../helpers"

const Nav = ({ username }) => {
  return (
    <>
      <Menu />
    </>
  )
}

export default Nav

const Menu = () => {
  const [clicked, setClicked] = useState(true)
  const [fixNav, setNav] = useState(false)

  const normalNav = "navbar navbar-expand-lg mt-1 navbar-light   mb-3"
  const style = {
    borderBottom: "2px solid red",
    transition: "all .25s linear",
  }

  const bg1 = "#202026"
  const bg2 = "=rgb(32,32,38)"
  const handleScroll = () =>
    window.scrollY >= 200 ? setNav(true) : setNav(false)
  React.useEffect(() => {
    addEventListener("scroll", handleScroll)
    return () => removeEventListener("scroll", handleScroll)
  }, [])
  return (
    <nav className={normalNav} style={{ background: "#202026" }}>
      <span>
        {" "}
        C<FontAwesomeIcon icon={faSpinner} size="1x" color="red" pulse />
        VID-19<NavLink to={"/"}></NavLink>
      </span>
      <button
        className="navbar-toggler float-right mb-2 bg-light"
        type="button"
        data-toggle="collapse"
        data-target="#covid19"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
        onClick={() => setClicked(!clicked)}
      >
        {clicked ? (
          <span className="navbar-toggler-icon bg-light"></span>
        ) : (
          <FontAwesomeIcon icon={faTimes} size="lg" fixedWidth />
        )}
      </button>
      <div className="collapse navbar-collapse" id="covid19">
        <ul className={`navbar-nav  w-100 `} style={{ background: "#202026" }}>
          <li className="nav-item ">
            <NavLink className="nav-link " activeStyle={style} to={"/"}>
              <FontAwesomeIcon
                icon={faHome}
                className="bg-light"
                size="lg"
                color="grey"
              />{" "}
              Home<span className="sr-only">(current)</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" activeStyle={style} to={"/africa"}>
              <FontAwesomeIcon icon={faGlobeAfrica} size="lg" color="white" />{" "}
              Africa
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="nav-link"
              activeStyle={style}
              to={"/interactive-flags"}
            >
              <FontAwesomeIcon icon={faGlobeEurope} size="lg" color="white" />{" "}
              Flags{" "}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" activeStyle={style} to={"/global"}>
              <FontAwesomeIcon icon={faGlobe} size="lg" color="white" /> Global
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}
