import * as d3 from "d3";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import {
  getWidth,
  getHeight,
  formatNums,
  formatNumParse,
  formatNumLocale,
  sumValues,
} from "../../helpers";
import {
  SVG,
  Group,
  Circle,
  Path,
  Rect,
  ToolTip,
  setLables,
  TextArea,
  setToolTip,
} from "../../svg/svg";
import { DetailsTable } from "./summary";

let fill = "blue",
  bg = "#fff";

const [h, gh] = getHeight();
const [w, gw] = getWidth();
/*SCALES AND AXIS */
//scales
const xScale = d3.scaleTime().rangeRound([0, gw]);
const yScale = d3.scaleLinear().rangeRound([gh, 0]);
const aScale = d3.scaleSqrt().range([0, 10]);

const color = d3.scaleOrdinal(d3.schemeCategory10);

//axis
const yaxis = d3
  .axisLeft(yScale)
  .ticks(10)
  .tickFormat((d) => (d > 0 ? formatNums(d) : ""));
const xaxis = d3.axisBottom(xScale); //.ticks(20).tickFormat(d => new Date(d).toDateString());
//grid lines
const gridlines = () => d3.axisLeft(yScale);
const xlabel = setLables(gw / 2.5, h - 50, "black", 0, "1rem", "bold");
const ylabel = setLables(-gh / 1.4, -55, "black", -90, "1rem", "bold");
const title = setLables(50, 0, "black", 0, "1rem", "bold");

function Line({ data, getTools, getOp, month, continent, dataset }) {
  const defaultData = data.slice();
  const innerData = [...useSelector((state) => state.covid.eachDay)];
  const [lines, setLines] = useState(false);
  const [circles, setCircles] = useState(false);
  const useMobile = () =>
    document.documentElement.clientWidth <= 480 ? true : false;

  const [guide, setGuide] = useState("");
  /* Scales and axis invocation */

  useEffect(() => {
    let timer = setTimeout(
      () =>
        setGuide(
          "Hover on the coloured circles to view more info, use menu on right side to refine visuals"
        ),
      3000
    );
    return () => clearTimeout(timer);
  }, []);
  const updateScales = (data) => {
    //attach domain to scale
    xScale.domain(d3.extent(data, (d) => d["date"]));
    yScale.domain(d3.extent(data, (d) => d["confirmed"]));
    aScale.domain([0, d3.max(data, (d) => d["confirmed"])]);
  };
  const updateAxis = () => {
    const ygrp = d3.select(".lygrp");
    const xgrp = d3.select(".lxgrp");
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
      .attr("font-size", "1rem")

      .attr("text-anchor", "end")
      .attr("y", 0)
      .attr("x", -15);
  };
  //sort data, sort mutates the damn data
  const rev = innerData.sort((a, b) =>
    b[b.length - 1] !== undefined
      ? b[b.length - 1].confirmed - a[a.length - 1].confirmed
      : []
  );
  const months = ["January", "February", "March", "April"];
  const userBtns = (
    <div className="col-md-12 col-sm-12 col-md-12 my-4">
      <button
        className={`btn btn-info btn-md mr-2 darken-1  ${
          lines ? "red" : "blue"
        }`}
        onClick={() => setLines(!lines)}
      >
        {lines ? "Line Chart" : "Scatter plot  "}
      </button>
    </div>
  );

  return (
    <>
      {!useMobile() ? <p className="text-danger">{guide}</p> : null}

      <SVG w={w} h={h} bg={bg}>
        {/*overall group */}
        <Group x={80} y={40} gw={gw} gh={gh}>
          {/*Legend*/}
          <Legend defaultData={defaultData} color={color} />

          {innerData.reverse().map((d, i) => {
            updateScales(d);
            setTimeout(() => updateAxis(), 100);
            return (
              <Group key={i}>
                {/*Path remover*/}
                {!lines ? (
                  <PathF dataset={d} stroke={color(i)} strokew={20} />
                ) : null}
                {/*Check for mobile devices*/}
                {!useMobile() ? (
                  !circles ? (
                    <Circles
                      defaultData={d}
                      gt={getTools}
                      getOp={getOp}
                      fill={color(i)}
                    />
                  ) : null
                ) : null}
              </Group>
            );
          })}

          <TextArea {...title}>
            Global Corona Virus (COVID19) Cases - {months[month]} -{" "}
            {months[new Date().getMonth]}
          </TextArea>
          <TextArea {...ylabel}>Confirmed Cases</TextArea>
          <TextArea {...xlabel}>Date</TextArea>

          {/*y axis */}
          <Group classlist="lygrp" x={0} y={0}></Group>
          {/*x axis */}
          <Group classlist="lxgrp" x={0} y={gh}></Group>
          {/*grid lines axis */}
          <Group classlist="grid" x={0} y={0}></Group>
        </Group>
      </SVG>
      {!useMobile() ? userBtns : null}
      <div className="row mt-5">
        <div className="col-lg-12 col-md-12 col-sm-12">
          {useMobile() ? (
            <p className="text-danger">
              Kindly view this graph on computer or larger device for better
              user experience
            </p>
          ) : null}
          <p>
            There have been a total of
            <b>{sumValues(data, "latest")}</b> reported cases in the{" "}
            {data.length} {data.length > 1 ? "countries" : "country"} on the
            chart.{" "}
          </p>

          <DetailsTable dataset={data.slice()} />
        </div>
      </div>
    </>
  );
}

Line.propTypes = {
  defaultData: PropTypes.array,
  innerData: PropTypes.array,
  color: PropTypes.func,
  d: PropTypes.object,
  data: PropTypes.any,
  getTools: PropTypes.func,
  getOp: PropTypes.func,
  month: PropTypes.string,
};
export default Line;

//<Path key={i} d={line(item.stats)} stroke="red" strokew={5} fill="none" />
//  <DetailsTable dataset={data} />
const Circles = ({ defaultData, fill, gt, getOp }) => {
  const [hover, setHover] = useState(0);

  const handleHover = (e, data, country) => {
    const selected = d3.select(e.target);

    const coords = {
      x: Number(selected.attr("cx")),
      y: Number(selected.attr("cy")),
      width: Number(selected.attr("width")),
      confirmed: data.confirmed,
      deaths: data.deaths,
      recovered: data.recovered,
      Country: country[country.length - 1].country,
      date: data.date,
      bg: "lightblue",
    };
    getOp(true);
    gt(coords);
  };
  const handleLeave = (e) => {
    getOp(false);
  };

  return (
    <>
      {defaultData.map((item, i) => {
        const y =
          yScale(item.confirmed) > gh
            ? Math.abs(gh - yScale(item.confirmed))
            : yScale(item.confirmed);

        return (
          <circle
            fill={fill}
            key={i}
            onMouseLeave={(e) => handleLeave(e)}
            onMouseOver={(e) => handleHover(e, item, defaultData)}
            opacity={0.7}
            cx={xScale(item.date)}
            cy={y}
            r={aScale(item.confirmed)}
          />
        );
      })}
    </>
  );
};

const Legend = ({ defaultData, color }) => (
  <Group classlist="legend" x={30} y={140}>
    {defaultData
      .sort((a, b) => b.latest - a.latest)
      .reverse()
      .map((data, i) => (
        <Group key={data.id}>
          <Rect width={20} fill={color(i)} y={-i * 20} height={10} />
          <text key={i} x={25} y={-(i * 20) + 10} width={10} height={10}>
            {data.countryregion} ({formatNums(data.latest)})
          </text>
        </Group>
      ))}
  </Group>
);

const PathF = ({ dataset, stroke }) => {
  const line = d3
    .line()
    .x((d) => xScale(d["date"]))
    .y((d) =>
      yScale(d["confirmed"]) > gh
        ? Math.abs(gh - yScale(d["confirmed"]))
        : yScale(d["confirmed"])
    );

  const path = line(dataset);

  return <Path d={path} stroke={stroke} strokew={20} fill="none" />;
};
