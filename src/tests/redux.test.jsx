import covidReducer from "../redux/covidReducer/covidReducer";
import { store } from "../redux/store";
import * as actions from "../redux/covidReducer/actions";

describe("store ish", () => {
  beforeAll(() => {
    store.dispatch({
      type: "ADD_COUNTRY",
      payload: {
        stats: [{ date: new Date() }],
        countryregion: "Kenya",
        id: 10,
        added: true,
        asleep: false,
      },
    });
  });
  test("existence of the damn store", () => {
    expect(store.getState().covid.selectedCountry.length).toBe(1);
    expect(store.getState().covid.continents.length).toEqual(6);
  });
});

describe("redux store", () => {
  const pay = {
    country: "Kenya",
    countryregion: "US",
    lastUpdate: Date.now(),
    stats: [{ deaths: 1, confirmed: 10, recovered: 2 }],
  };

  test("action creators", () => {
    const res = actions.addCountry(pay);

    expect(actions.addCountry(pay)).toEqual({
      type: "ADD_COUNTRY",
      payload: pay,
    });
    expect(res.type).toBe("ADD_COUNTRY");
  });
  it("testremove action creator", () => {
    const res = actions.removeCountry();
    expect(res).toEqual({
      type: "REMOVE_COUNTRY",
      payload: undefined,
    });
    expect(actions.loadingMessage(true)).toEqual({
      type: "LOADING_MESSAGE",
      payload: true,
    });
  });
  let ams = actions.sortCovid(true, []);
  expect(ams).toEqual({ type: "SORT_COVID", sort: true, sorted: [] });

  test("remove action", () => {
    expect(actions.removeCountry(pay)).toEqual({
      type: "REMOVE_COUNTRY",
      payload: pay,
    });
  });
});

describe("reducer", () => {
  const state = [];
  const newState = {
    countryregion: "Kenya",
    confirmed: 4,
    stats: [{ date: new Date() }],
  };

  const action = { type: "ADD_COVID", payload: newState };

  let res = covidReducer(state, action);

  test("first state", () =>
    expect(res).toEqual({ covidDataset: newState, sort: true, cwd: newState }));
  test("loading message", () => {
    const action = {
      type: "LOADING_MESSAGE",
      payload: { spin: true, msg: "Supermarket flowers" },
    };
    const res = covidReducer({ spinner: false, message: "" }, action);
    expect(res).toEqual({ spinner: true, message: "Supermarket flowers" });
  
  });
});
