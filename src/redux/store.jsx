import React from "react"
import { createStore } from "redux"
import { Provider } from "react-redux"
import rootReducer from "./rootReducer"

const devtools = () => {
  if (globalThis.window) {
    return window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  }
}
export const store = createStore(rootReducer, devtools())

const ReduxWrapper = ({ element }) => (
  <Provider store={store}>{element}</Provider>
)
export default ReduxWrapper
