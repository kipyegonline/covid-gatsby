import React from "react"
import SEO from "../components/seo"
import Layout from "../components/covidreact/UI/Layout"
import { Link } from "gatsby"

const NotFound = () => (
  <Layout>
    <div className="row gray lighten1">
      <SEO
        title="404: Not found"
        description="Corona virus tracking app"
        lang="eng"
        meta=""
      />
      <div className="col-lg-12 col-md-12 col-sm-12 p-4 my-5">
        <h3 className="text-center ">
          We could not find that resource. Lets get you back{" "}
          <Link to={"/"}>home</Link>
        </h3>
      </div>
    </div>
  </Layout>
)
export default NotFound
