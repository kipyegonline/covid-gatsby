import React from "react"
import { CircularProgress } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSpinner,
  faHome,
  faUmbrella,
  faChartLine,
  faUserCog,
  faArrowAltCircleUp,
  faTimes,
  faGlobeAfrica,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons"
export function formatNums(num) {
  if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + "M"
  }
  if (num >= 1000) {
    return (num / 1e3).toFixed() + "K"
  }
  return num
}
export function formatNumParse(num) {
  if (num > 1000) {
    return parseInt(num / 1e3) + "K"
  } else if (num > 1e6) {
    return parseInt(num / 1e3) + "M"
  } else {
    return num
  }
}

export function formatNumLocale(num) {
  return num !== undefined ? num.toLocaleString("en") : 0
}

export function getWidth() {
  let w = globalThis.window && document.documentElement.clientWidth
  if (w <= 480) {
    return [300, 200]
  } else if (w <= 768) {
    return [600, 480]
  } else {
    return [800, 680]
  }
}
export function getHeight() {
  let w = globalThis.window && document.documentElement.clientWidth
  if (w <= 480) {
    return [300, 180]
  } else {
    return [400, 280]
  }
}

export function sumValues(arr, field) {
  const answer = arr
    .filter(ar => !Number.isNaN(Number(ar[field])))
    .reduce((a, b) => a + b[field], 0)
  return answer > 1e3 ? answer.toLocaleString() : answer
}

export const Suspense = ({ chart, spinner }) => {
  const w = globalThis.window && document.documentElement.clientWidth

  return (
    <div>
      {spinner ? (
        <div className=" text-center p-4 mx-auto my-3 ">
          <CircularProgress />
          <p className="text-center">Loading {chart}....</p>
        </div>
      ) : (
        <p className="text-danger">
          Error loading {chart}. <br /> Check internet connection and try again
        </p>
      )}
    </div>
  )
}
//pagination
export const paginationDevice = () => {
  const w = globalThis.window && document.documentElement.clientWidth
  const height = globalThis.window && document.documentElement.clientHeight
  if (w <= 360) {
    return Math.ceil(height / 65) * 2
  } else if (w <= 768) {
    return Math.ceil(height / 88) * 3
  }
  return 25
}
export const useMobile = () =>
  globalThis.window && document.documentElement.clientWidth <= 480
    ? true
    : false
export const icons = [
  faHome,
  faSpinner,
  faUmbrella,
  faUserCog,
  faArrowAltCircleUp,
  faChartLine,
  faTimes,
  faGlobeAfrica,
  faGlobe,
]
