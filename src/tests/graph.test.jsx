import React from "react";
import Enzyme, { shallow, mount } from "enzyme";
import { createStore } from "redux";
import { Provider } from "react-redux";
import toJSON from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";
import keReducer from "../redux/rootReducer";
import CovidKenya from "../components/covidreact/kenya/main";
import CovidGraph from "../components/covidreact/kenya/graph";

Enzyme.configure({ adapter: new Adapter() });
const store = createStore(keReducer);
const ReduxWrapper = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

describe("The covid graph", () => {
  store.dispatch({
    type: "ADD_KE",
    payload: [
      {
        countryregion: "Kenya",
        id: 1,
        stats: [
          {
            deaths: 50,
            recovered: 10,
            confirmed: 20,
            date: new Date("2020/05/01"),
            id: 0,
          },
          {
            deaths: 50,
            recovered: 10,
            confirmed: 20,
            date: new Date("2020/05/02"),
            id: 1,
          },
          {
            deaths: 250,
            recovered: 100,
            confirmed: 60,
            date: new Date("2020/05/03"),
            id: 2,
          },
          {
            deaths: 500,
            recovered: 410,
            confirmed: 60,
            date: new Date("2020/05/04"),
            id: 3,
          },
          {
            deaths: 650,
            recovered: 300,
            confirmed: 800,
            date: new Date("2020/05/05"),
            id: 4,
          },
        ],
      },
    ],
  });

  const wrapper = mount(
    <ReduxWrapper>
      <CovidKenya />
    </ReduxWrapper>
  );

  it.skip("matches snapshot", () => {
    expect(toJSON(wrapper.find(".graph-svg"))).toMatchSnapshot();
  });
  describe("Inside <SVG/>", () => {
    test("svg components", () => {
      const svg = wrapper.find(".graph-svg");
      expect(svg.find("circle")).toHaveLength(15);
      expect(svg.find("path")).toHaveLength(3);
      expect(svg.find("g")).toHaveLength(5);
    });
    test("select input", () => {
      const select = wrapper.find("select");

      expect(select.hasClass("form-control")).toBeTruthy();

      expect(select.find("option")).toHaveLength(2);
    });
    it("select on change", () => {
      const option = wrapper.find("option").at(1);

      option.simulate("change");
      expect(wrapper.find("select").prop("value")).toBe("Kenya");
    });
    test("Numbers button", () => {
      const btn = wrapper.find("button.num");
      expect(btn.hasClass("btn blue lighten-1 mt-3 white-text")).toBeTruthy();
      expect(btn.text()).toEqual("Show numbers");
      btn.simulate("click");
      expect(btn.text()).toEqual("Hide numbers");
    });
  });
});

function promiso(callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.floor(Math.random() * 10) > 5) {
        callback("Cross me");
      } else {
        reject("it's less");
      }
    }, 10);
  });
}

test("callback", (done) => {
  function sayJules(data) {
    try {
      expect(data).toBe("Cross me");
      done();
    } catch (error) {
      done(error);
    }
  }
  promiso(sayJules);
});
