import { C } from "./types";
import { filterByMonth } from "./actions";

const continents = [
  "Global",
  "Africa",
  "Europe",
  "Asia",
  "Americas",
  "Oceania",
];
const months = [
  { id: 0, month: "January" },
  { id: 1, month: "February" },
  { id: 2, month: "March" },
  { id: 3, month: "April" },
  { id: 4, month: "May" },
  { id: 5, month: "June" },
  { id: 6, month: "July" },
  { id: 7, month: "August" },
];
const btns = [
  { continent: "Africa", val: "africa", id: 0, selected: true },

  { continent: "Europe", val: "europe", id: 1, selected: false },

  { continent: "Asia", val: "asia", id: 2, selected: false },
  { continent: "Americas", val: "americas", id: 3, selected: false },
  { continent: "Oceania", val: "oceania", id: 4, selected: false },
];
const initState = {
  covidDataset: [],
  cwd: [],
  sort: true,
  timeDataset: [],
  eachDay: [],
  month: 2,
  selectedCountry: [],
  btns,
  message: "",
  continents,
  spinner: false,
  months,
  clickedBtn: "africa",
};
function covidReducer(state = initState, action) {
  switch (action.type) {
    case C.ADD_COVID:
      return {
        ...state,
        covidDataset: action.payload,
        cwd: action.payload,
        sort: true,
      };
      break;

    //timeseries array from the api
    case C.ADD_TIMESET:
      // add the first four items in the array to the graph
      const newState = [...action.payload].slice(0, 5).map((d) => d.stats);

      return {
        ...state,
        timeDataset: update5(action.payload),
        selectedCountry: [...action.payload].slice(0, 5),
        eachDay:
          state.month > 0 ? filterByMonth(newState, state.month) : newState,
      };
    //added country
    case C.ADD_COUNTRY:
      if (state.selectedCountry.length >= 10) {
        alert("You can only add upto 10 countries.");
        return state;
      }
      const inc = action.payload.id;
      const checker = state.selectedCountry.find((d) => d.id === inc);
      if (checker === undefined) {
        //add country to assist when removing from store
        action.payload.stats[action.payload.stats.length - 1].country =
          action.payload.countryregion;
        const newState = [...state.eachDay, action.payload.stats];

        return {
          ...state,
          timeDataset: [...state.timeDataset].map((data) =>
            data.id === action.payload.id ? { ...data, added: true } : data
          ),
          selectedCountry: [...state.selectedCountry, action.payload],
          eachDay:
            state.month > 0 ? filterByMonth(newState, state.month) : newState,
        };
      } else {
        return state;
      }

    //remove
    case C.REMOVE_COUNTRY:
      if (state.selectedCountry.length <= 1) {
        /* eslint-disable no-alert */
        alert("choose a default country");
        return state;
      }

      return {
        ...state,
        timeDataset: [...state.timeDataset].map((data) =>
          data.id === action.payload.id ? { ...data, added: false } : data
        ),
        selectedCountry: state.selectedCountry.filter(
          (country) => country.id !== action.payload.id
        ),
        eachDay: state.eachDay.filter(
          (d) =>
            d[d.length - 1].country !==
            action.payload.stats[action.payload.stats.length - 1].country
        ),
      };

    //for showing errors during ajax call
    case C.LOADING_MESSAGE:
      return {
        ...state,
        message: action.payload.msg,
        spinner: action.payload.spin,
      };
    case C.SET_MONTH:
      const c = state.timeDataset.slice();
      const res = c
        .filter((data) => data.added === true)
        .map((data) => data.stats);

      return {
        ...state,
        month: action.payload,
        eachDay: filterByMonth(res, action.payload),
      };

    case C.BTN_CLICKED:
      return {
        ...state,
        clickedBtn: state.btns.find((btn) => btn.id === action.payload).val,
        btns: state.btns.map((btn) =>
          btn.id === action.payload
            ? { ...btn, selected: true }
            : { ...btn, selected: false }
        ),
      };

    case C.SORT_COVID:
      return {
        ...state,
        sort: !state.sort,
        covidDataset: state.sort ? action.sorted : state.cwd,
      };
    default:
      return state;
  }
}
export default covidReducer;
//selected country reducer
const covid = ({}, action) => {
  if (action.type === C.ADD_COUNTRY) {
    return { ...action.payload };
  }
};

//timeseries reducer
const covidTimeseries = ([], action) => {
  if (action.payload === C.ADD_TIMESET) {
    return action.payload;
  }
};

const update5 = (data) => {
  let res = [];
  const sel = data.slice(0, 5);
  const dd = data.map((d) => {
    let seen = sel.find((s) => s.id === d.id);
    if (seen) {
      seen.stats[d.stats.length - 1].country = d.countryregion;
      return { ...seen, added: true };
    } else {
      d.stats[d.stats.length - 1].country = d.countryregion;
      return { ...d, added: false };
    }
  });

  return dd;
};
