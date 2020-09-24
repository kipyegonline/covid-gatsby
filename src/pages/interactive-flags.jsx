import React, { useState, useEffect } from "react"
import { useSelector, connect } from "react-redux"
import * as actions from "../redux/covidReducer/actions"
import CountryList from "../components/covidreact/countries/CountryList"
import Layout from "../components/covidreact/UI/Layout"
import { Suspense } from "../components/helpers"
import SEO from "../components/seo"

function Countries({ loadingMessage, addTimeSeries }) {
  const { continents, dataset, spinner, message, clickedBtn } = useSelector(
    state => ({
      continents: state.covid.btns,
      dataset: state.covid.timeDataset,
      spinner: state.covid.spinner,
      message: state.covid.message,
      clickedBtn: state.covid.clickedBtn,
    })
  )
  const url =
    "https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/timeseries"

  useEffect(() => {
    actions.covid19Series(addTimeSeries, url, clickedBtn, loadingMessage)
  }, [])

  //dev events
  //const datasett = JSON.parse(localStorage.getItem("timeSeries"));

  return (
    <Layout>
      <SEO
        description="Corona virus tracking app"
        lang="eng"
        meta=""
        title="covid19 tracker"
      />
      {dataset.length > 0 ? (
        <div className="container">
          <CountryList
            btns={continents}
            dataset={dataset}
            spinner={spinner}
            message={message}
            clickedBtn={clickedBtn}
            addCovid={addTimeSeries}
            loadingMessage={loadingMessage}
          />
        </div>
      ) : (
        <Suspense chart={"chart"} spinner={spinner} />
      )}
    </Layout>
  )
}

const mapDispatchToProps = dispatch => ({
  addTimeSeries: payload => dispatch(actions.addTimeSeries(payload)),
  loadingMessage: payload => dispatch(actions.loadingMessage(payload)),
})
export default connect(null, mapDispatchToProps)(Countries)
