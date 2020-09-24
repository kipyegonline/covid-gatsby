import styled from "styled-components";
import * as d3 from "d3";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { sendValue } from "../../../redux/kenyaReducer/actions";
import {
  getWidth,
  getHeight,
  formatNumParse,
  formatNumLocale,
  useMobile,
  sumValues,
} from "../../helpers";
import {
  SVG,
  Group,
  Circle,
  Path,
  Rect,
  ToolTip,
  TextArea,
  setLables,
  setToolTip,
} from "../../svg/svg";

const Div = styled.div.attrs((props) => ({
  className: props.classlist,
}))`
  padding: 0.5rem;
  line-height: 1;
`;

const Para = styled.p.attrs((props) => ({ className: props.classlist }))`
  margin: 0;
  text-align: center;
  padding: 1rem;
  font-family: roboto;
  font-size: 1rem;
  @media (max-width: 480px) {
    padding: 0.25rem;
    font-size: 0.5rem;
  }
`;
const CheckBox = styled.input.attrs((props) => ({
  type: "checkbox",
  className: props.classlist,
}))`
  height: 30px;
  width: 50px;
`;
//d3 scales and dimensions
const [h, gh] = getHeight();
const [w, gw] = getWidth();
/*SCALES AND AXIS */
//scales
const xScale = d3.scaleTime().rangeRound([0, gw]);
const yScale = d3.scaleLinear().rangeRound([gh, 0]);
const aScale = d3.scaleSqrt().range([0, 10]);

const scaleBand = d3.scaleBand().range([0, gw]);
//axis
const yaxis = d3
  .axisLeft(yScale)
  .ticks(5)
  .tickFormat((d) => formatNumParse(d));
const xaxis = d3.axisBottom(xScale);
//grid lines
const gridlines = () => d3.axisLeft(yScale);
let titlesY = setToolTip(0, 50, gw / 3);

const xlabel = setLables(gw / 2.5, h - 50, "black", 0, "1rem", "bold");
const ylabel = setLables(-gh / 1.4, -55, "black", -90, "1rem", "bold");
const title = setLables(titlesY, 0, "black", 0, "1rem", "bold");

function CovidGraph({ data, a, b, c, e, all }) {
  //internal component state state
  const [isShowing, setShowing] = useState(false);
  const [info, setInfo] = useState({});
  const [numbers, setNumbers] = useState(false);
  const [guide1, setGuide1] = useState("");
  const [guide2, setGuide2] = useState("");
  const [guide3, setGuide3] = useState("");
  //redux dispatch
  const dispatch = useDispatch();
  //utils
  const getKeData = (data) => [...data].filter((d) => d.confirmed > 0);
  //Events
  useEffect(() => {
    //marketing purposes

    const coords = {
      x: setToolTip(123, 258, 351),
      y: setToolTip(56, 177, 207),
      confirmed: getKeData(data.stats)[15].confirmed,
      deaths: getKeData(data.stats)[15].deaths,
      recovered: getKeData(data.stats)[15].recovered,
      width: 150,
      w: 150,
      date: getKeData(data.stats)[15].date,
      bg: "lightblue",
    };
    setShowing(true);
    setInfo(coords);

    let timer = setTimeout(() => {
      setShowing(false);
      setGuide1("Hover over the red circles to see more info for each day");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  //mouse enter and over events
  const handleHover = (e, data, index) => {
    const selected = d3.select(e.target);

    const coords = {
      x: Number(selected.attr("cx")) - 100,
      y: Number(selected.attr("cy")),
      confirmed: data.confirmed,
      deaths: data.deaths,
      recovered: data.recovered,
      width: 150,
      w: 150,
      date: data.date,
      bg: "lightblue",
    };
    setShowing(true);
    setInfo(coords);

    //marketing
    setGuide1("");
    setTimeout(
      () => setGuide2("Select another country to visualize here"),
      3000
    );
  };
  const handleLeave = (e) => {
    setShowing(false);
  };
  const handleChange = (e) => {
    dispatch(sendValue(e.target.value));
    setGuide2("");
    setTimeout(() => setGuide3("Click button to see numbers on chart"), 3000);
    setTimeout(() => setGuide3(""), 6000);
  };

  //Scales
  const LineScales = (data, a, b) => {
    data = getKeData(data.stats);

    xScale.domain(d3.extent(data, (d) => d[a]));
    yScale.domain(d3.extent(data, (d) => d[b]));
    aScale.domain(d3.extent(data, (d) => d[b]));
  };
  const barScales = (data, a, b) => {
    scaleBand.domain(data.map((d) => d[a]));
    yScale.domain(d3.extent(data, (d) => d[b]));
  };
  //update the axis after 100 ms
  const updateBarAxis = () => {
    const ygrp = d3.select(".k-ygrp");
    const xgrp = d3.select(".k-xgrp");
    const gridline = d3.select(".grid");
    ygrp
      .transition()
      .duration(500)
      .call(yaxis);
    xgrp
      .transition()
      .duration(500)
      .call(xaxis);
    gridline.call(
      gridlines()
        .tickSize(-2000, 0, 0)
        .tickFormat("")
    );
    //y text
    ygrp
      .selectAll("text")
      .transition()
      .duration(1000)
      .attr("font-size", "1rem")
      .attr("font-family", "raleway")
      .attr("x", -15);
    //x text
    xgrp
      .selectAll("text")
      .transition()
      .duration(1000)
      .attr("transform", "rotate(-60)")
      .attr("text-anchor", "middle")
      .attr("x", -30)
      .attr("y", 0)
      .attr("font-family", "raleway")
      .attr("font-size", "1rem");
  };

  //call the scales for each of y axis, deaths, confirmed and recoverex
  LineScales(data, a, c);
  LineScales(data, a, e);
  LineScales(data, a, b);
  setTimeout(() => updateBarAxis(), 100);

  //define line paths
  const line1 = d3
    .line()
    .x((d) => xScale(d[a]))
    .y((d) => yScale(d[c]));
  const line2 = d3
    .line()
    .x((d) => xScale(d[a]))
    .y((d) => yScale(d[e]));
  const line = d3
    .line()
    .x((d) => xScale(d[a]))
    .y((d) => yScale(d[b]));
  const lineData = getKeData(data.stats);
  const total = lineData[lineData.length - 1].deaths;
  let selectData = [...new Set(all.map((all) => all.countryregion))];

  return (
    <Div classlist="row">
      <Div classlist="col-md- col-lg-9 mx-auto col-sm-12 position-relative">
        <p className="text-info my-2 ">{guide1}</p>
        <ToolBar data={info} tool={isShowing} />
        <SVG w={w} h={h} bg="#fff" classlist="graph-svg">
          <Group x={80} y={40} gw={gw} gh={gh}>
            {lineData.slice().map((data, i) => (
              <Circle
                key={data.id}
                fill="red"
                classlist={"ke-circles"}
                opacity={0.7}
                hh={(e) => handleHover(e, data, i)}
                hl={(e) => handleLeave(e)}
                hc={(e) => handleHover(e, data)}
                cy={yScale(data[c])}
                cx={xScale(data[a]) - 2}
                r={7.5}
              />
            ))}
            {lineData.slice().map((data, i) => (
              <Circle
                key={data.id}
                fill="green"
                opacity={0.7}
                hh={(e) => handleHover(e, data, i)}
                hl={(e) => handleLeave(e)}
                hc={(e) => handleHover(e, data)}
                cy={yScale(data[e])}
                cx={xScale(data[a]) - 2}
                r={7.5}
              />
            ))}

            {lineData.slice().map((data, i) => (
              <Circle
                key={data.id}
                fill={i == 15 ? "skyblue" : "yellow"}
                classlist={"ke-circles"}
                opacity={1}
                hh={(e) => handleHover(e, data, i)}
                hl={(e) => handleLeave(e)}
                hc={(e) => handleHover(e, data)}
                cy={yScale(data[b])}
                cx={xScale(data[a]) - 2}
                r={7.5}
              />
            ))}
            {numbers
              ? lineData.map((data) => (
                  <TextArea
                    key={data.id}
                    fill="black"
                    rotate={0}
                    opacity={1}
                    y={yScale(data[b]) - 10}
                    x={xScale(data[a])}
                  >
                    {formatNumParse(data.confirmed)}
                  </TextArea>
                ))
              : null}
            <Group classlist="pathfinder">
              <Path d={line1(lineData)} stroke="red" strokew={20} fill="none" />
              <Path
                d={line2(lineData)}
                stroke="green"
                strokew={20}
                fill="none"
              />
              <Path
                d={line(lineData)}
                stroke="yellow"
                strokew={20}
                fill="none"
              />
            </Group>
            <TextArea {...title}>
              Corona virus {data.countryregion} cases -
              {new Date(data.date).toDateString()}{" "}
            </TextArea>
            <TextArea {...xlabel}>Date</TextArea>
            <TextArea {...ylabel}>Confirmed Cases</TextArea>

            {/*group for x and y axis as well as the damn grids */}
            <Group classlist="k-ygrp" x={0} y={0}></Group>
            <Group classlist="k-xgrp" x={0} y={gh}></Group>
            <Group classlist="grid"></Group>
          </Group>
        </SVG>
        {useMobile() ? (
          <p className="text-danger my-2">
            Kindly view this graph on computer or larger device for better user
            experience
          </p>
        ) : null}
      </Div>
      <Div classlist="col-md-4 col-lg-3 col-sm-12">
        <div className="form-group">
          <div className="mx-auto ">
            <h3 className="text-center font-weight-bold">
              {data.countryregion}
            </h3>
            <div
              className=""
              style={{
                background: "yellow",
                padding: "1rem",
                fontSize: "1.5rem",
              }}
            >
              Total Confirmed:{" "}
              {formatNumLocale(lineData[lineData.length - 1].confirmed)}
            </div>

            <div
              className="bg-success my-2  text-white"
              style={{ padding: "1rem", fontSize: "1.5rem" }}
            >
              Total Recovered:{" "}
              {formatNumLocale(lineData[lineData.length - 1].recovered)}
            </div>
          </div>
          <div
            className="text-white "
            style={{ background: "red", padding: "1rem", fontSize: "1.5rem" }}
          >
            Total Deceased:{" "}
            {formatNumLocale(lineData[lineData.length - 1].deaths)}{" "}
          </div>
          <small className="text-muted text-center mr-2 mt-2">
            {new Date(data.date).toDateString()}
          </small>
          <div className="form-group mt-3 mx-auto">
            <p className="font-weight-bold">
              Select Country to Visualize. (A-Z)
            </p>
            <select
              className="form-control"
              value={data.countryregion}
              onChange={handleChange}
            >
              <option>Select Country</option>
              {selectData.sort().map((each, i) => (
                <option key={i} value={each}>
                  {each}
                </option>
              ))}
            </select>
            <p className="text-danger mt-2">{guide2}</p>
          </div>
          <button
            onClick={() => setNumbers(!numbers)}
            data-btn={numbers}
            className="btn blue lighten-1 mt-3 white-text num"
          >
            {numbers ? "Hide numbers" : "Show numbers"}
          </button>
          <p className="text-danger mt-2">{guide3}</p>
        </div>
      </Div>
    </Div>
  );
}

const ToolBar = ({ data, tool }) => (
  <ToolTip data={data} tool={tool}>
    <Para classlist="text-center font-weight-bold">
      {new Date(data.date).toDateString()}{" "}
    </Para>
    <Para classlist="text-info">
      confirmed: {formatNumLocale(data.confirmed)}
    </Para>
    <Para classlist="text-danger">Deaths: {formatNumLocale(data.deaths)}</Para>
    <Para classlist="text-success">
      Recovered: {formatNumLocale(data.recovered)}
    </Para>
  </ToolTip>
);
export default CovidGraph;

CovidGraph.propTypes = {
  info: PropTypes.object,
  isShowing: PropTypes.bool,
  lineData: PropTypes.array,
  numbers: PropTypes.bool,
  setnumbers: PropTypes.func,
  handleHover: PropTypes.func,
  handleLeave: PropTypes.func,
  data: PropTypes.object,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  data: PropTypes.object,
  xlabel: PropTypes.object,
  title: PropTypes.object,
  ylabel: PropTypes.object,
};
CovidGraph.defaultProps = {
  lineData: [],
};
ToolBar.propTypes = {
  data: PropTypes.object.isRequired,
  tool: PropTypes.bool,
};
