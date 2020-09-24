import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"

//svg
export const SVG = styled.svg.attrs(props => ({
  height: props.h,
  width: props.w,
  className: props.classlist,
}))`
  background: ${props => props.bg};
  border-radius: 10px;
  margin: auto;
`

SVG.propTypes = {
  h: PropTypes.number.isRequired,
  w: PropTypes.number.isRequired,
  bg: PropTypes.string.isRequired,
}
SVG.defaultProps = {
  h: 480,
  w: 500,
  bg: "#fefefe",
}
//group tag
export const Group = styled.g.attrs(props => ({
  className: props.classlist,
  height: props.gh,
  width: props.gw,
}))`
  transform: translate(${props => props.x}px, ${props => props.y}px);
`
Group.propTypes = {
  classlist: PropTypes.string,
  gh: PropTypes.number,
  gw: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
}
Group.defaultProps = {
  gw: 0,
  gh: 0,
  classlist: "",
  x: 0,
  y: 0,
}
//rect
export const Rect = styled.rect.attrs(props => ({
  onClick: props.hc,
  onMouseOver: props.hh,
  onMouseLeave: props.hl,
  className: props.classlist,
  x: props.x,
  y: props.y,
  width: props.width,
  height: props.height,
}))`
  shaperendering: crispEdges;
  opacity: ${props => props.opacity};
  fill: ${props => props.fill};
  transform: translate(${props => props.tx}px, ${props => props.ty}px);
  transition: all 0.2s linear;

  &:hover {
    fill: orange;
    width: ${props => props.hover + 5}px;
    opacity: ${props => props.opacitad};
    z-index: 10;
  }
`
Rect.propTypes = {
  hc: PropTypes.func,
  hh: PropTypes.func,
  hl: PropTypes.func,
  classlist: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  opacity: PropTypes.number,
  ty: PropTypes.number,
  tx: PropTypes.number,
  hover: PropTypes.number,
}
Rect.defaultProps = {
  x: 0,
  y: 480,
  height: 0,
  tx: 0,
  ty: 0,
}
//Text
export const Text = ({ x, y, text, transform, classlist }) => (
  <text x={x} y={y} fill={"black"} transform={transform} className={classlist}>
    {text}
  </text>
)
;`
   x:${props => props.x};
   y:${props => props.y};
   fill:${props => props.fill};
   `

//path

export const Path = styled.path.attrs(props => ({
  onClick: props.hc,
  onMouseOver: props.hh,
  onMouseLeave: props.hl,
  className: props.classlist,
  d: props.d,
}))`
  opacity: ${props => props.opacity};
  stroke: ${props => props.stroke};
  fill: ${props => props.fill};
  shaperendering: crispEdges;
  strokewidth: ${props => props.strokew}px;
`

Path.propTypes = {
  hc: PropTypes.func,
  hh: PropTypes.func,
  hl: PropTypes.func,
  classlist: PropTypes.string,
  d: PropTypes.string,
  opacity: PropTypes.number,
  stroke: PropTypes.string,
  fill: PropTypes.string,
  strokew: PropTypes.number,
}
//circle
export const Circle = props => (
  <circle
    cx={props.cx}
    cy={props.cy}
    r={props.r}
    shapeRendering="crispEdges"
    opacity={props.opacity}
    fill={props.fill}
    onClick={props.hc}
    onMouseOver={props.hh}
    onMouseLeave={props.hl}
  />
)

export const Circler = styled.circle.attrs(props => ({
  onClick: props.hc,
  onMouseOver: props.hh,
  onMouseLeave: props.hl,
}))`
  cx: ${props => props.cx}px;
  cy: ${props => props.cy}px;
  r: ${props => props.r}px;
  shaperendering: crispEdges;
  fill: ${props => props.fill};
  opacity: ${props => props.opacity};
  transition: all.2s easse-in-out;
  &:hover {
    fill: deepskyblue;
  }
`
Circle.propTypes = {
  hc: PropTypes.func,
  hh: PropTypes.func,
  hl: PropTypes.func,
  classlist: PropTypes.string,
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  r: PropTypes.number.isRequired,
  fill: PropTypes.string,
  opacity: PropTypes.number,
}

Circle.defaultProps = {
  cx: 0,
  cy: 0,
  fill: "black",
  r: 5,
  opacity: 0.8,
}
export const ToolTip = styled.div.attrs(props => ({
  className: "covid-tip",
}))`
  width: ${props => props.data.w || 0}px;
  border-radius: 10px;
  background: ${props => props.data.bg};
  padding: 0.5rem;
  font-size: 1rem;
  margin: 5px;
  top: ${props => props.data.y / 2 || 0}px;
  left: ${props => props.data.x + 40 || 0}px;
  position: absolute;
  z-index: 110;
  height: auto;
  opacity: ${props => (props.tool ? 1 : 0)};
  transition: all 0.25s ease-in;
  box-shadow: -2px -2px 3px #fff, 2px 2px 3px #fff;
  pointer-events: none;

  @media (max-width: 480px) {
     {
      padding: 0.5rem;
      text-align: left !important;

      margin: 5px;
      width: ${props => props.data.w / 2 || 0}px;
      font-size: 1rem;
    }
  }
  @media (min-width: 480px) and(max-width:768px) {
     {
      padding: 0.5rem;
      text-align: left !important;
      margin: 5px;
      width: ${props => props.data.w / 2 || 0}px;
      font-size: 1rem;
    }
    & img {
      width: 30px;
    }
  }
`
ToolTip.propTypes = {
  w: PropTypes.number,
  bg: PropTypes.string,
  y: PropTypes.number,
  x: PropTypes.number,
  tool: PropTypes.bool,
}
ToolTip.defaultProps = {
  w: 100,
  bg: "#fff",
  tool: false,
  x: 0,
  y: 0,
}
export const Tip = styled.span.attrs(props => ({
  className: props.classlist,
}))`
  padding: 0.25rem;
  display: block;
  margin: 0;
  font-size: 1rem;
  font-family: roboto;
  @media (max-width: 480px) {
    padding: 0.25rem;
    font-size: 1rem;
  }
`

Tip.propTypes = {
  classlist: PropTypes.string,
}
export const TextArea = ({
  children,
  x,
  y,
  fill,
  rotate,
  fontSize,
  fontWeight,
}) => (
  <text
    x={x}
    y={y}
    fill={fill}
    fontWeight={fontWeight}
    transform={`rotate(${rotate})`}
    fontSize={fontSize}
  >
    {children}
  </text>
)

export const setLables = (x, y, fill, rotate, fontSize, fontWeight) => {
  const w = globalThis.window && document.documentElement.clientWidth
  if (w <= 480) {
  } else if (w <= 768) {
  } else {
    return { x, y, fill, rotate, fontSize, fontWeight }
  }
  return { x, y, fill, rotate, fontSize, fontWeight }
}

TextArea.propTypes = {
  children: PropTypes.node,
  fill: PropTypes.string,
  rotate: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  fontSize: PropTypes.string,
}

TextArea.defaultProps = {
  fill: "black",
  rotate: 0,
  x: 0,
  y: 0,
  fontSize: "1rem",
  fontWeight: "normal",
}

export const setToolTip = (a, b, c) => {
  const w = globalThis.window && document.documentElement.clientWidth
  if (w <= 480) {
    return a
  } else if (w <= 768) {
    return b
  } else {
    return c
  }
}
