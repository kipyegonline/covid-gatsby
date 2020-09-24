import { C } from "./types"
const initState = {
    cwd: [],
    all: [],
    sort: true,
    message: "",
    spinner: false

}
function keRducer(state = initState, action) {
    switch (action.type) {
        case C.ADD_KE:
            return {
                ...state,
                all: action.payload,
                cwd: action.payload.find(d => d.countryregion === "Kenya") == undefined ? [] : action.payload.find(d => d.countryregion === "Kenya")
            }

            
        case C.SELECTED_VALUE:
            return {
                ...state,
                cwd: state.all.find(d => d.countryregion === action.payload)
            }
        case C.SORT_GRAPH:

            return { ...state, sort: action.sorted }

        case C.LOADING_MESSAGE:
            return {
                ...state,
                spinner: action.payload.spinner,
                message: action.payload.message
            }
        default:
            return state
            break;
    }
}
export default keRducer;




