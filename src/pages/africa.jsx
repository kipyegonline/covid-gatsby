import { connect } from "react-redux"
import React, { useState, useEffect } from "react"

import styled from "styled-components"
import PropTypes from "prop-types"
import * as actions from "../redux/covidReducer/actions"
import Bar from "../components/covidreact/bar"
import Table from "../components/covidreact/Table"
import Layout from "../components/covidreact//UI/Layout"
import { Suspense, sumValues } from "../components/helpers"
import SEO from "../components/seo"

const mapStateToProps = state => ({
  dataset: state.covid.covidDataset,
  btns: state.covid.btns,
  message: state.covid.message,
  clickedBtn: state.covid.clickedBtn,
  spinner: state.covid.spinner,
})
const mapDispatchToProps = dispatch => ({
  addCovid: payload => dispatch(actions.addCovid(payload)),
  sortCovid: (sort, cwd) => dispatch(actions.sortCovid(sort, cwd)),
  sendBtn: payload => dispatch(actions.sendBtn(payload)),
  loadingMessage: payload => dispatch(actions.loadingMessage(payload)),
})

const BarChart = ({
  dataset,
  addCovid,
  sortCovid,
  btns,
  sendBtn,
  loadingMessage,
  message,
  spinner,
  clickedBtn,
}) => {
  const [url, setUrl] = useState("https://api.covid19api.com/summary")
  /*
  dataset = dataset.map((d) =>
    d.Country === "US"
      ? { ...d, TotalConfirmed: d.TotalConfirmed - 1e6 }
      : { ...d }
  );*/
  //let datasett = JSON.parse(localStorage.getItem("covid19"))

  useEffect(() => {
    //initialize app
    actions.covid19(addCovid, url, clickedBtn, loadingMessage)

    //addCovid(datasett)
  }, [])

  const tablesort = [...dataset].sort(
    (a, b) => b.TotalConfirmed - a.TotalConfirmed
  )
  const getRegion = region => {
    actions.covid19(addCovid, url, region, loadingMessage)
  }

  const chart = (
    <Layout>
      <SEO
        description="Corona virus tracking app"
        lang="eng"
        meta=""
        title="covid19 tracker"
      />
      <div className="row mb-5">
        <div className="col-md-12 col-lg-8 col-sm-12" id="covid">
          {dataset.length > 0 ? (
            <Bar
              data={dataset}
              a="Country"
              b="TotalConfirmed"
              sendRegion={getRegion}
              addsort={sortCovid}
              btns={btns}
              spinner={spinner}
              sendBtn={sendBtn}
              region={clickedBtn.toUpperCase()}
              message={message}
            />
          ) : (
            <Suspense chart="COVID19 chart" spinner={spinner} />
          )}
        </div>
        <div className="col-md-12 col-lg-4 col-sm-12">
          {!spinner && dataset.length > 0 ? (
            <Stats
              dataset={dataset}
              continent={btns.find(btn => btn.selected === true).continent}
            />
          ) : null}
          {dataset.length > 0 ? (
            <Table tableData={tablesort} region={clickedBtn.toUpperCase()} />
          ) : null}
        </div>
      </div>
    </Layout>
  )

  return chart
}

BarChart.propTypes = {
  dataset: PropTypes.array,
  tablesort: PropTypes.array,
  sortCovid: PropTypes.func,
  getRegion: PropTypes.bool,
}
export default connect(mapStateToProps, mapDispatchToProps)(BarChart)
const Stats = ({ dataset, continent }) => (
  <div className="mx-auto mb-3 ">
    <h3 className="text-center font-weight-bold">
      {continent.slice(0, 1).toUpperCase() + continent.slice(1)}
    </h3>
    <div
      className=""
      style={{ background: "yellow", padding: "1rem", fontSize: "1.5rem" }}
    >
      Total Confirmed: {sumValues(dataset, "TotalConfirmed")}
    </div>
    <div
      className="my-2 text-white "
      style={{ background: "red", padding: "1rem", fontSize: "1.5rem" }}
    >
      Total Deceased: {sumValues(dataset, "TotalDeaths")}{" "}
    </div>
    <div
      className="bg-success text-white"
      style={{ padding: "1rem", fontSize: "1.5rem" }}
    >
      Total Recovered: {sumValues(dataset, "TotalRecovered")}
    </div>
  </div>
)
Stats.propTypes = {
  continent: PropTypes.string,
  data: PropTypes.array,
}
