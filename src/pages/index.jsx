import styled from "styled-components"
import React, { useState, useEffect } from "react"
import propTypes from "prop-types"

import { useSelector, useDispatch } from "react-redux"
import * as ken from "../redux/kenyaReducer/actions"
import CovidGraph from "../components/covidreact/kenya/graph"
import { Suspense, formatNumLocale } from "../components/helpers"
import Layout from "../components/covidreact/UI/Layout"
import SEO from "../components/seo"

const MainDiv = styled.div.attrs(props => ({ className: props.classlist }))`
  margin: auto;
`
function CovidKenya() {
  const { dataset, all, spinner } = useSelector(state => ({
    all: state.ke.all,
    dataset: state.ke.cwd,
    spinner: state.ke.spinner,
  }))

  const endpoint =
    "https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/timeseries"
  const dispatch = useDispatch()
  useEffect(() => {
    // const dataset = JSON.parse(localStorage.getItem("timeSeries"))
    dispatch(ken.loadingMessage({ spinner: true, message: "loading data" }))
    console.log(dataset, "cuz")
    ken
      .fetchKe(endpoint)
      .then(data => {
        if (data === undefined) {
          const errorM = {
            spinner: false,
            message: "Error fetching data..try again",
          }
          dispatch(ken.loadingMessage(errorM))
        } else {
          const errorM = { spinner: true, message: "" }
          dispatch(ken.loadingMessage(errorM))
          dispatch(ken.addKe(data))
        }
      })
      .catch(err => {
        const errorM = { spinner: false, message: err.message }
        dispatch(ken.loadingMessage(errorM))
        console.log("ke", err.message)
      })

    let timer = setTimeout(() => {
      const errorM = { spinner: true, message: "" }
      //dispatch(ken.loadingMessage(errorM))
      //dispatch(ken.addKe(dataset))
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Layout>
      <SEO
        description="Corona virus tracking app"
        lang="eng"
        meta=""
        title="covid19 tracker"
      />
      <MainDiv classlist="">
        {dataset.stats !== undefined ? (
          <CovidGraph
            data={dataset}
            all={all}
            a={"date"}
            b={"confirmed"}
            c={"deaths"}
            e={"recovered"}
          />
        ) : (
          <Suspense chart="COVID19 chart" spinner={spinner} />
        )}
      </MainDiv>
    </Layout>
  )
}
CovidKenya.propTypes = {
  dataset: propTypes.array,
  keDate: propTypes.string,
}

export default CovidKenya
