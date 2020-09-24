import * as d3 from "d3";
let dataset = [];
export default function vanillaCovid(data) {

    updateGraph(data, "Country", "TotalConfirmed");
    dataset = data;

}

//dimensions and timers

let sortTimer;
const sortBtn = document.getElementById("sort-cv");
const [w, gw] = getWidth();
let margin = { left: 100, right: 20, top: 40, bottom: 120 };

const h = 500;
let gh = h - margin.bottom - margin.top;
//select DOM and append SVG
const svg = d3.select("#covid")
    .append("svg")
    .attr("height", h)
    .attr("width", w)
    .style("background", "lightblue");
//group tag for chart
const graph = svg.append("g")
    .attr("height", gh)
    .attr("width", gw)
    .attr("transform", `translate(${margin.left},${margin.top})`);

/*SCALES AND AXIS */
//scales
const xScale = d3.scaleBand().rangeRound([0, gw]).paddingInner(.15).paddingOuter(.15);
const yScale = d3.scaleLinear().rangeRound([gh, 0]);
//axis
const yaxis = d3.axisLeft(yScale).ticks(10).tickFormat(d => 0 < d ? d : "");
const xaxis = d3.axisBottom(xScale);


//g tags for x and y axis
const ygrp = graph
    .append("g")
    .attr("class", "ygrp");
const xgrp = graph
    .append("g")
    .attr("transform", `translate(0,${gh})`)
    .attr("class", "xgrp");
// horizontal grid lines
const gridlines = graph.append("g").attr("class", "grid");
const ygrid = () => d3.axisLeft(yScale);
gridlines.call(ygrid().tickSize(-2000, 0, 0).tickFormat(""));
//data loading  message
graph.append("text")
    .text("Loading chart.....")
    .attr('class', "load-message")
    .attr("fill", "red")
    .attr("font-size", "2rem")
    .attr("x", gw / 3)
    .attr('y', 100)
//check device and advise
const view = "Kindly view this chart on computer for better user experience"
w < 768 ? d3.select(".user-guide").text(view) : null;

function updateGraph(data, a, b) {

    //attach domain to scale
    xScale.domain(data.map(item => item[a]));
    yScale.domain([0, d3.max(data, d => d[b])]);

    //call the axis
    ygrp.transition().duration(1000).call(yaxis);
    xgrp.transition().duration(1000).call(xaxis);
    //add data
    const bars = graph.selectAll("rect")
        .data(data);
    bars.exit().remove();
    //update remaining bars
    bars
        .attr("height", 0)
        .attr("y", gh)
        .attr("x", d => xScale(d[a]))
        .transition().duration(1000)
        .attr("width", xScale.bandwidth)
        .attr("height", d => gh - yScale(d[b]))
        .attr("y", d => yScale(d[b]))
        .attr("fill", d => " Kenya" == d[a] ? "orange" : "blue");

    bars
        .enter()
        .append("rect")
        .on("mouseover", handleMouseOver)
        .on("mouseleave", handleMouseLeave)
        .attr("width", xScale.bandwidth)
        .attr("x", d => xScale(d[a]))
        .attr("height", 0)
        .attr("y", gh)
        .transition().duration(1000)
        .attr("fill", d => {
            //hide load message
            d3.select(".load-message").attr('fill', 'none')
            //show user guide
            d3.select(".user-guide").text("Click or mouse over the blue bars to see info")
            //show btn
            sortBtn.style.opacity = 1

            if (d[a] === "Kenya") {

                defaultKenya(377, (325 / 1), d.Ccountry, d.TotalConfirmed, d.TotalDeaths, d.TotalRecovered, d.flag)
                return "orange"
            } else {
                return "blue";
            }
        })
        .attr("height", d => gh - yScale(d[b]))
        .attr("y", d => yScale(d[b]));



    //style the y axis
    ygrp.selectAll(".ygrp text")
        .transition().duration(1000)
        .attr("font-size", "1rem")
        .attr("font-family", "helvetica")
        .attr("fill", "black")
        .attr("x", "-15");
    //style the x axis
    xgrp.selectAll(".xgrp text")
        .transition().duration(1000)
        .attr("font-size", "1rem")
        .attr("font-family", "helvetica")
        .attr("fill", "black")
        .attr("transform", "rotate(-60)")
        .attr("text-anchor", "end")
        .attr("x", -10)
        .attr("y", "-5");
    //label x  axis
    graph.append("text")
        .text("COUNTRIES")
        .attr("x", w / 2.8)
        .attr("y", h - 50)
        .attr("font-size", ".75rem")
        .attr("font-family", "raleway")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .attr("letter-spacing", "10px");
    //label y axis
    graph.append("text")
        .text("TOTAL CONFIRMED")
        .attr("x", -gh / 1.3)
        .attr("y", -60)
        .attr("font-size", ".75rem")
        .attr("font-family", "raleway")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .attr("letter-spacing", "10px")
        .attr("transform", "rotate(-90)");
    //header
    graph.append("text")
        .text("NOVEL COVID19 CASES IN AFRICA -" + new Date().toDateString())
        .attr("x", 100)
        .attr("y", 0)
        .attr("font-size", "1rem")
        .attr("font-family", "raleway")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .attr("letter-spacing", "5px");
    //header
    graph.append("text")
        .text("Source: John Hopkins University ")
        .attr("x", gw - 120)
        .attr("y", h - 50)
        .attr("font-size", ".55rem")
        .attr("font-family", "helvetica")

        .attr("fill", "black")




}
//graph events


function handleMouseOver(d) {
    clearInterval(sortTimer);
    //hide the user guide
    d3.select(".user-guide").style("display", "none")
    const selected = d3.select(this);
    selected.transition()
        .duration(200)
        .attr("fill", "orange");
    let x = Number(selected.attr("x"));
    let y = Number(selected.attr("y"));

    //show tooltip
    d3.select("#covid-tip")
        .style('top', `${y / 2}px`)
        .style('left', `${x + 40}px`)
        .style("opacity", 1);
    //display data on tool tip
    d3.select(".tip-country").text(d.Country).attr("font-weight", "bold");
    d3.select(".tip-confirmed").text(d.TotalConfirmed).attr("font-weight", "bold");
    d3.select(".tip-deaths").text(d.TotalDeaths).attr("font-weight", "bold");
    d3.select(".tip-recovered").text(d.TotalRecovered).attr("font-weight", "bold");
    d3.select(".tip-flag").attr("src", d.flag)




}
function defaultKenya(x, y, country, confirmed, deaths, recovered, flag) {
    //show tooltip
    d3.select("#covid-tip")
        .style('top', `${y / 2}px`)
        .style('left', `${x + 40}px`)
        .style("opacity", 1);
    //display data on tool tip
    d3.select(".tip-country").text(country).attr("font-weight", "bold");
    d3.select(".tip-confirmed").text(confirmed).attr("font-weight", "bold");
    d3.select(".tip-deaths").text(deaths).attr("font-weight", "bold");
    d3.select(".tip-recovered").text(recovered).attr("font-weight", "bold");
    d3.select(".tip-flag").attr("src", flag)

}
function handleMouseLeave() {
    sortTimer = setInterval(handleSort, 5000);
    const selected = d3.select(this);
    selected.transition()
        .duration(200)
        .attr("fill", "blue");
    //hide the damn tool tip
    d3.select("#covid-tip")
        .style("opacity", 0);
}

//for sort button
let sorted = true;

function handleSort() {
    clearInterval(sortTimer);
    sorted = !sorted;
    let sort = [...dataset];
    if (sorted) {
        sort = sort.sort((a, b) => a.TotalConfirmed - b.TotalConfirmed);
        updateGraph(sort, "Country", "TotalConfirmed");
        sortBtn ? sortBtn.innerHTML = "Unsort chart" : null;
    } else {
        updateGraph(sort, "Country", "TotalConfirmed");
        sortBtn ? sortBtn.innerHTML = "Sort chart" : null;
    }
}

sortTimer = setInterval(handleSort, 5000);
handleSort();
if (sortBtn) {
    sortBtn.onclick = handleSort;
}


//UTILS
export function getWidth() {
    let w = document.documentElement.clientWidth;
    if (w <= 480) {
        return [320, 200];
    } else if (w <= 768) {
        return [600, 480];
    } else {
        return [w - 300, w - 420];
    }




}

export function sumValues(arr, field) {

    return arr.reduce((a, b) => a + b[field], 0);
}

const handleChange = () => {
    clearInterval(sortTimer);
    handleSort();
};

const sortEl = document.getElementById("sort");
if (sortEl) {
    sortEl.onchange = handleChange;
}

