import { connect, useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import * as actions from "../../../redux/covidReducer/actions";
import { Suspense } from "../../helpers";
import Layout from "../UI/Layout";
import {
  SVG,
  Group,
  Circle,
  Path,
  Rect,
  ToolTip,
  Tip,
  setToolTip,
} from "../../svg/svg";

import { sumValues, formatNumLocale } from "../../helpers";
import Table from "./Table";
import Line from "./line";
export function LineChart({
  dataset,
  message,
  loadingMessage,
  addTimeSet,
  month,
  spinner,
  addCountry,
  removeCountry,
  country,
  setMonth,
  months,
  continents,
}) {
  const [continent, setContinent] = useState("global");
  const [toolState, setTooltip] = useState(false);
  const [toolinfo, setToolInfo] = useState({});

  let chosendataset = [];
  //default end point
  const endpoint =
    "https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/timeseries";
  //my continents for filter purpose

  //initiate api calls here
  useEffect(() => {
    //const dataset = JSON.parse(localStorage.getItem("timeSeries"));
    //addTimeSet(dataset);
    //fetch data from the 2 apis and filter
    actions.covid19Series(addTimeSet, endpoint, continent, loadingMessage);
  }, []);
  //fetch selected value from select component
  const getValue = (val) => {
    setContinent(val);

    actions.covid19Series(addTimeSet, endpoint, val, loadingMessage);
  };
  const getMonth = (month) => setMonth(Number(month));
  //tooltip info
  const getTooltip = (coord) => {
    const tipinfo = { ...coord, x: 200, y: 100, w: 150 };
    setToolInfo(tipinfo);
  };
  //tool tip opcaity
  const getOpacity = (too) => setTooltip(too);

  chosendataset = country;

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12 col-lg-8 col-sm-12 position-relative">
          <ToolBar toolinfo={toolinfo} tool={toolState} />
          {chosendataset.length > 0 ? (
            <Line
              data={chosendataset}
              continent={continent}
              dataset={dataset}
              month={month}
              getTools={getTooltip}
              getOp={getOpacity}
            />
          ) : (
            <Suspense chart=" COVID19 chart" spinner={spinner} />
          )}
        </div>
        <div className="col-md-12 col-lg-4 col-sm-12">
          {!spinner && dataset.length > 0 ? (
            <Stats dataset={dataset} continent={continent} />
          ) : null}
          {dataset.length > 0 ? (
            <>
              <CountrySelect
                continents={continents}
                sendValue={getValue}
                spinner={spinner}
                message={message}
              />
              <MonthsSelect
                months={months}
                month={month}
                sendMonth={getMonth}
              />
              <hr className="divider" />
            </>
          ) : null}

          {dataset.length > 0 ? (
            <Table
              tableData={dataset.slice()}
              add={addCountry}
              remove={removeCountry}
            />
          ) : (
            <Suspense chart="COVID table" spinner={spinner} />
          )}
        </div>
      </div>
    </Layout>
  );
}
//proptypes
LineChart.propTypes = {
  continent: PropTypes.array,
  sendValue: PropTypes.func,
};
// connect to redux
const mapStateToProps = (state) => ({
  dataset: state.covid.timeDataset,
  country: state.covid.selectedCountry,
  message: state.covid.message,
  months: state.covid.months,
  continents: state.covid.continents,
  spinner: state.covid.spinner,
  month: state.covid.month,
});
const mapDispatchToProps = (dispatch) => ({
  addTimeSet: (payload) => dispatch(actions.addTimeSeries(payload)),
  addCountry: (payload) => dispatch(actions.addCountry(payload)),
  removeCountry: (payload) => dispatch(actions.removeCountry(payload)),
  setMonth: (payload) => dispatch(actions.setMonth(payload)),
  loadingMessage: (payload) => dispatch(actions.loadingMessage(payload)),
});
export default connect(mapStateToProps, mapDispatchToProps)(LineChart);

const CountrySelect = ({ continents, sendValue, spinner, message }) => (
  <div className="form-group">
    <p>
      Select Region:{" "}
      {spinner ? (
        <span className="text-center">
          <FontAwesomeIcon icon={faSpinner} size="sm" color="green" pulse />
        </span>
      ) : (
        <span className="text-danger">{message}</span>
      )}
    </p>
    <select
      className="form-control"
      onChange={(e) => sendValue(e.target.value)}
    >
      {continents.map((continent, i) => (
        <option key={i} value={continent.toLowerCase()}>
          {continent}
        </option>
      ))}
    </select>
  </div>
);

CountrySelect.propTypes = {
  continent: PropTypes.string,
  value: PropTypes.string,
  sendValue: PropTypes.func,
  continents: PropTypes.array.isRequired,
  spinner: PropTypes.bool,
};

const ToolBar = ({ toolinfo, tool }) => {
  const date = toolinfo.date !== undefined ? toolinfo.date.toDateString() : "";

  return (
    <ToolTip data={toolinfo} tool={tool}>
      <Tip classlist="text-center">{toolinfo.Country}</Tip>
      <Tip classlist="text-font-weight">{formatNumLocale(date)}</Tip>
      <Tip classlist="text-primary">
        Confirmed:{formatNumLocale(toolinfo.confirmed)}
      </Tip>
      <Tip classlist="text-danger">
        {" "}
        Deaths:{formatNumLocale(toolinfo.deaths)}
      </Tip>
      <Tip classlist="text-success">
        {" "}
        Recovered:{formatNumLocale(toolinfo.recovered)}
      </Tip>
    </ToolTip>
  );
};

const MonthsSelect = ({ months, sendMonth, month }) => (
  <div className="form-group">
    <p>Select Month</p>
    <select
      className="form-control"
      value={month}
      onChange={(e) => sendMonth(e.target.value)}
    >
      {months.map((month) => (
        <option key={month.id} value={month.id}>
          {month.month}
        </option>
      ))}
    </select>
  </div>
);

MonthsSelect.propTypes = {
  months: PropTypes.array,
  month: PropTypes.number,
  id: PropTypes.number,
  sendMonth: PropTypes.func,
};

const Stats = ({ dataset, continent }) => (
  <div className="mx-auto mb-3 ">
    <h3 className="text-center font-weight-bold">
      {continent.slice(0, 1).toUpperCase() + continent.slice(1)}
    </h3>
    <div
      className=""
      style={{ background: "yellow", padding: "1rem", fontSize: "1.5rem" }}
    >
      Total Confirmed: {sumValues(dataset, "latest")}
    </div>
    <div
      className="my-2 text-white "
      style={{ background: "red", padding: "1rem", fontSize: "1.5rem" }}
    >
      Total Deceased: {sumValues(dataset, "deaths")}{" "}
    </div>
    <div
      className="bg-success text-white"
      style={{ padding: "1rem", fontSize: "1.5rem" }}
    >
      Total Recovered: {sumValues(dataset, "recovered")}
    </div>
  </div>
);
Stats.propTypes = {
  continent: PropTypes.string,
  data: PropTypes.array,
};
