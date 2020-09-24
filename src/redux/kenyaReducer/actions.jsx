import { C } from "./types"
import { transformData } from "../covidReducer/actions"
export const addKe = (data) => ({ type: C.ADD_KE, payload: transformData(data) })

export const sendValue = value => ({ type: C.SELECTED_VALUE, payload: value })
export const loadingMessage = value => ({ type: C.LOADING_MESSAGE, payload: value })
export const fetchKe = async (url) => {
    try {

        const res = await fetch(url)
        if (res.status) {
            const data = await res.json()

            return transformData(data);
        }

    }
    catch (err) {
        // console.error("Ke fetch", err.message)
    }


}