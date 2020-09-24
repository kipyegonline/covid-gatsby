import * as d3 from "d3";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  getWidth,
  getHeight,
  formatNums,
  formatNumParse,
  formatNumLocale,
  sumValues,
  useMobile,
} from "../helpers";
import {
  SVG,
  Group,
  Circle,
  Rect,
  ToolTip,
  TextArea,
  setLables,
  setToolTip,
} from "../svg/svg";
import { sendBtn } from "../../redux/covidReducer/actions";

const Button = styled.button.attrs((props) => ({
  className: props.classlist,
  onClick: props.handleClick,
}))`
  outline: none;
  max-width: 200px;
  border: none;
  margin-top: 0.5rem;

  &:active {
    outline: none;
    border: none;
  }
`;
export const Para = styled.p.attrs((props) => ({ className: props.classlist }))`
  margin: 0;
  text-align: center;
  padding: 1rem;
  font-family: roboto;
  font-size: 1rem;

  @media (max-width: 480px) {
    & {
      padding: 0.15rem;
      font-size: 0.5rem;
    }
  }
`;

let fill = "blue",
  bg = "#fff";

const [h, gh] = getHeight();
const [w, gw] = getWidth();
/*SCALES AND AXIS */
//scales
const xScale = d3
  .scaleBand()
  .rangeRound([0, gw])
  .paddingInner(0.2)
  .paddingOuter(0.2);
const yScale = d3.scaleLinear().rangeRound([gh, 0]);
//axis
const yaxis = d3
  .axisLeft(yScale)
  .ticks(10)
  .tickFormat((d) => (d > 0 ? formatNums(d) : ""));
const xaxis = d3.axisBottom(xScale);
//grid lines
const gridlines = () => d3.axisLeft(yScale);

//measurement for labels
const ylabel = setLables(-gh / 1.4, -70, "black", -90, "1rem", "bold");
const title = setLables(50, 0, "black", 0, "1rem", "bold");
function Bar({
  data,
  a,
  b,
  sendRegion,
  addsort,
  btns,
  sendBtn,
  message,
  region,
  spinner,
}) {
  let [dataset, setDataset] = useState(data);
  const [hover, setHover] = useState(0);
  const [tooltip, setTool] = useState(false);
  const [more, showMore] = useState({});

  const [trackSort, setSort] = useState(false);
  const [mainGuide, setGuide] = useState("");
  let sort = false;

  dataset = data;

  useEffect(() => {
    let timer;
    if (dataset.length > 0) {
      timer = setTimeout(() => {
        handleSort();
        const data = dataset.find((datam) => datam.Country === "Kenya");
        if (data) {
          const coords = {
            x: setToolTip(128, 307, 435),
            y: setToolTip(173, 269, 269),
            width: 150,
            confirmed: data.TotalConfirmed,
            deaths: data.TotalDeaths,
            recovered: data.TotalRecovered,
            Country: data.Country,
            flag: data.flag,
            w: 150,
            bg: "lightblue",
          };
          setTool(true);
          showMore(coords);
        }

        setGuide(
          "Hover on the bars  to see more info, Click Sort button to sort bars, click other buttons to view other regions"
        );
        setTimeout(() => setTool(false), 3000);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, []);
  let sorted = [...dataset].sort((x, y) => x[b] - y[b]);

  /* Scales and axis invocation */
  const updateScales = (dataset) => {
    // attach domain to scale
    xScale.domain(dataset.map((item) => item[a]));
    yScale.domain([0, d3.max(dataset, (d) => d[b])]);
  };
  const updateAxis = () => {
    const ygrp = d3.select(".ygrp");
    const xgrp = d3.select(".xgrp");
    const gridline = d3.select(".grid");
    //axis
    ygrp
      .transition()
      .duration(1000)
      .call(yaxis);
    xgrp
      .transition()
      .duration(1000)
      .call(xaxis);
    //grids
    gridline.call(
      gridlines()
        .tickSize(-2000, 0, 0)
        .tickFormat("")
    );

    //text on y axis
    ygrp
      .selectAll("text")
      .transition()
      .duration(1000)
      .attr("font-size", "1rem")
      .attr("font-family", "roboto")
      .attr("x", -15);
    //text on x axis
    xgrp
      .selectAll("text")
      .transition()
      .duration(1000)
      .attr("fill", "black")
      .attr("transform", "rotate(-60)")
      .attr("font-family", "roboto")
      .attr("font-size", ".8rem")
      .attr("text-anchor", "end")
      .attr("y", 0)
      .attr("x", -15);
  };
  //Events
  const handleHover = (data, e) => {
    const selected = d3.select(e.target);
    const coords = {
      x: Number(selected.attr("x")),
      y: Number(selected.attr("y")),
      width: Number(selected.attr("width")),
      confirmed: data.TotalConfirmed,
      deaths: data.TotalDeaths,
      recovered: data.TotalRecovered,
      Country: data.Country,
      flag: data.flag,
      w: 150,
      bg: "lightblue",
    };

    setHover(coords.width);
    showMore(coords);
    setTool(true);
  };
  const handleMouseLeave = (e) => {
    const selected = d3.select(e.target);
    setTool(false);
  };

  const handleSort = () => {
    sort = !sort;
    addsort(sort, sorted);
    setSort((current) => !current);
  };
  const handleBtnClick = (data) => {
    sendRegion(data.val);
    sendBtn(data.id);
    setSort(false);
  };
  let btnfill = "btn btn-md btn-info mr-2 blue lighten-1 ",
    btnClicked = "btn btn-md btn-info mr-2 red lighten-2 ";

  //before render
  updateScales(dataset);
  setTimeout(updateAxis, 100);
  const totalConfirmed = sumValues(data, "TotalConfirmed");
  const totalDeaths = sumValues(data, "TotalDeaths");
  const totalRecovered = sumValues(data, "TotalRecovered");

  let day = 60 * 1000 * 60 * 24;

  const quickguide = (
    <div className="mt-4 mx-auto quickquide">
      <p className="text-center font-weight-bold">Quick guide</p>
      <ul className="list-group mx-auto" style={{ maxWidth: 200 }}>
        {mainGuide.split(", ").map((guide, i) => (
          <li className="list-group-item" key={i}>
            *{guide}
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <>
      <ToolBar data={more} tooltip={tooltip} />
      <SVG h={h} w={w} bg={bg}>
        {/*overall group */}
        <Group x={80} y={40} gw={gw} gh={gh}>
          {/*put rects here  */}
          {dataset.map((data, i) => (
            <Rect
              key={i}
              x={xScale(data[a])}
              y={yScale(data[b])}
              height={gh - yScale(data[b])}
              width={xScale.bandwidth()}
              fill={data.Country === "Kenya" ? "red" : fill}
              classList={"rectsA"}
              opacity={1}
              hh={(e) => handleHover(data, e)}
              hl={(e) => handleMouseLeave(e)}
              hc={(e) => handleHover(data, e)}
              hover={hover}
            />
          ))}
          <TextArea {...title}>
            {spinner ? "" : region} - Corona Virus (COVID19) Cases -{" "}
            {new Date(Date.now() - day).toDateString()}
          </TextArea>
          <TextArea {...ylabel}>Confirmed Cases</TextArea>
          {/*y axis */}
          <Group classlist="ygrp" x={0} y={0}></Group>
          {/*x axis */}
          <Group classlist="xgrp" x={0} y={gh}></Group>
          {/*grid lines axis */}
          <Group classlist="grid" x={0} y={0}></Group>
        </Group>
      </SVG>
      <div className="row">
        <div className="col-md-12 col-sm-12 mb-3">
          {useMobile() ? (
            <p className="text-danger my-2 comp">
              Kindly view this graph on computer or larger device for better
              user experience
            </p>
          ) : null}
          {!useMobile() ? (
            <p className="text-center text-danger my-2">{message}</p>
          ) : null}
          <Button
            classlist="btn btn-md btn-info mr-2 blue darken-2"
            handleClick={handleSort}
          >
            {trackSort ? "Unsort" : "Sort"}
          </Button>

          {btns.map((btn) => (
            <Button
              key={btn.id}
              handleClick={() => handleBtnClick(btn)}
              classlist={btn.selected ? btnClicked : btnfill}
            >
              {btn.continent}
            </Button>
          ))}

          {mainGuide.length > 0 ? quickguide : null}
        </div>
      </div>
    </>
  );
}

Bar.propTypes = {
  dataset: PropTypes.array,
  more: PropTypes.object,
  sendRegion: PropTypes.func,
  more: PropTypes.object,
  tooltip: PropTypes.bool,

  fill: PropTypes.string,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  hover: PropTypes.bool,
  handleHover: PropTypes.func,
  handleMouseLeave: PropTypes.func,
};

export default Bar;

export const ToolBar = ({ data, tooltip }) => {
  return (
    <ToolTip data={data} tool={tooltip}>
      <img
        width={setToolTip(30, 40, 70)}
        height={20}
        className="tip-flag"
        alt="flag"
        src={data.flag}
      />
      <Para className="text-center">{data.Country}</Para>
      <Para className="text-info">
        Confirmed: {formatNumLocale(data.confirmed)}
      </Para>
      <Para className="text-danger">
        Deaths: {formatNumLocale(data.deaths)}
      </Para>
      <Para className="text-success">
        Recovered: {formatNumLocale(data.recovered)}
      </Para>
    </ToolTip>
  );
};
ToolBar.propTypes = {
  tooltip: PropTypes.bool,
  data: PropTypes.object,
};
