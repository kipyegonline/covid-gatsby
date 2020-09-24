import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../../redux/covidReducer/actions";
import { formatNumLocale, paginationDevice } from "../../helpers";
import Pagination from "./pagination";

const Button = styled.button.attrs((props) => ({
  className: props.classlist,
  onClick: props.handleClick,
}))`
  max-width: 100px;
  outline: none;
  padding: 0.5rem;
`;
const ToolTip = styled.div.attrs((props) => ({
  className: "flags",
}))`
  width: ${(props) => props.data.w || 0}px;
  border-radius: 10px;
  background: ${(props) => props.data.bg};
  padding: 0.5rem;
  font-size: 1rem;
  margin: 5px;
  top: ${(props) => props.data.y || 0}px;
  left: ${(props) => props.data.x || 0}px;
  position: absolute;
  z-index: 110;
  height: auto;
  opacity: ${(props) => (props.tool ? 1 : 0)};
  transition: all 0.5s ease-in;
  box-shadow: -2px -2px 3px #fff, 2px 2px 3px #fff;
  pointer-events: none;
`;
const Para = styled.p.attrs((props) => ({ className: props.classlist }))`
  padding: 0.25rem;
  margin: 0.25rem;
  font-family: roboto;
  font-size: 1rem;
`;

const CountryList = ({
  btns,
  dataset,
  spinner,
  message,
  clickedBtn,
  addCovid,
  loadingMessage,
}) => {
  
  const dispatch = useDispatch();

  const handleClick = (data) => {
    const url =
      "https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/timeseries";
    dispatch(actions.sendBtn(data.id));
    // (callback, ur1, region, tracker)
    actions.covid19Series(addCovid, url, data.val, loadingMessage);
  };

  const [perPage, setPage] = useState(paginationDevice());
  const [pageNos, setPageNo] = useState(0);
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    //get the number of pages and set state
    let pg = Math.ceil(dataset.length / perPage);
    setPageNo(pg);
  }, []);

  const getPage = (pg) => setCurrent(pg);

  const btnfill = "btn btn-md btn-info mr-2 my-2 blue lighten-1 ";
  const btnClicked = "btn btn-md btn-info mr-2 my-2 red lighten-2 ";

  return (
    <div className="row">
      <div className="col-md-12 col-lg-9 col-sm-12">
        <p className="my-2 p-1">Mouse over the flags to view covid-19 report</p>
        <div className="my-2 flag-btns">
          {btns.map((continent) => (
            <Button
              key={continent.id}
              classlist={continent.selected ? btnClicked : btnfill}
              handleClick={() => handleClick(continent)}
            >
              {continent.continent}
            </Button>
          ))}
          {spinner ? (
            <p className="text-success">Loading {clickedBtn.toUpperCase()}</p>
          ) : (
            <p className="text-danger">{message}</p>
          )}
        </div>
        <div className="main-flags">
          {dataset
            .slice(current * perPage, current * perPage + perPage)
            .map((data, i) => (
              <CountrySet data={data} key={data.id} />
            ))}
        </div>
        <Pagination pages={pageNos} setPage={getPage} current={current} />
      </div>

      <div className="col-md-12 col-lg-3 col-sm-12 mt-5 table-responsive">
        <h5 className="text-center">COVID-19 summary</h5>
        <CountryTable
          dataset={dataset.slice(
            current * perPage,
            current * perPage + perPage
          )}
          current={current * perPage}
        />
      </div>
    </div>
  );
};
export default CountryList;

const CountrySet = ({ data }) => {
  const [hover, setHover] = useState(false);
  const [info, setInfo] = useState({});

  const handleMouseEnter = (e, data) => {
    const { left, top } = e.target.getBoundingClientRect();
    setInfo({
      x: window.screenX,
      y: window.screenY + 50,
      w: 150,
      bg: "#fff",
      deaths: data.deaths,
      recovered: data.recovered,
      latest: data.latest,
      countryregion: data.countryregion,
      flag: data.flag,
    });

    setHover(true);
  };
  const handeLeave = () => {
    setHover(false);
  };

  return (
    <div className="card card-flag mx-2">
      <ToolBar hover={hover} data={info} />
      <h5 className="card-title text-center">{data.countryregion}</h5>
      <img
        className="card-img-top"
        onMouseOver={(e) => handleMouseEnter(e, data)}
        onMouseLeave={handeLeave}
        src={data.flag}
        alt={data.countryregion}
      />
    </div>
  );
};
const CountryTable = ({ dataset, current }) => (
  <table className="table table-hover table-bordered">
    <thead>
      <tr>
        <th>#</th>
        <th>Country</th>
        <th>Confirmed</th>
        <th>Deaths</th>
        <th>Recovered</th>
      </tr>
    </thead>
    <tbody>
      {dataset.map((data, i) => (
        <tr key={i}>
          <td>{i + current + 1}</td>
          <td>{data.countryregion}</td>
          <td className="text-info">{formatNumLocale(data.latest)}</td>
          <td className="text-danger">{formatNumLocale(data.deaths)}</td>
          <td className="text-success">{formatNumLocale(data.recovered)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const ToolBar = ({ hover, data }) => (
  <ToolTip tool={hover} data={data}>
    <Para claslist="text-center">{data.countryregion}</Para>
    <Para classlist="text-info">
      Confirmed: {""}
      {formatNumLocale(data.latest)}
    </Para>
    <Para classlist="text-danger">
      Deaths: {""}
      {formatNumLocale(data.deaths)}
    </Para>
    <Para classlist="text-success">
      Recovered: {""}
      {formatNumLocale(data.recovered)}
    </Para>
  </ToolTip>
);
