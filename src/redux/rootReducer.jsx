import { combineReducers } from "redux"
import covidReducer from "./covidReducer/covidReducer"
import keReducer from "./kenyaReducer/keReducer"
export default combineReducers({ covid: covidReducer, ke: keReducer })