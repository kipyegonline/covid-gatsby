import React from "react"
import { Link } from "react-router-dom"
const NotFound = () => (
  <div className="row gray lighten1">
    <div className="col-lg-12 col-md-12 col-sm-12 p-4 my-5">
      <h3 className="text-center ">
        We could not find that resource. Lets get you back{" "}
        <Link to={"/"}>home</Link>
      </h3>
    </div>
  </div>
)
export default NotFound
