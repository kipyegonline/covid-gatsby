import React from "react";
import Enzyme, { shallow, mount } from "enzyme";
import { createStore } from "redux";
import { Provider } from "react-redux";
import toJSON from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";
import Table from "../components/covidreact/line/Table";
import Line from "../components/covidreact/line/line";
import covidReducer from "../redux/rootReducer";

Enzyme.configure({ adapter: new Adapter() });
const store = createStore(covidReducer);
const ReduxWrapper = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

const tableData = [
  {
    countryregion: "Kenya",
    added: false,
    flag: "kenya.jpeg",
    stats: [{ deaths: 314, recovered: 12, confirmed: 3647 }],
  },
  {
    countryregion: "Tanzania",
    added: true,
    flag: "tanzania.jpeg",
    stats: [{ deaths: 650, recovered: 234, confirmed: 7648 }],
  },
];
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

describe("<Line/> component", () => {
  const _getTools = jest.fn(),
    _getOp = jest.fn();

  const wrapper = mount(
    <ReduxWrapper>
      <Line
        data={tableData}
        getTools={_getTools}
        getOp={_getOp}
        month={"January"}
      />
    </ReduxWrapper>
  );
  console.log(wrapper.debug());
});
describe("<Table/> component", () => {
  const _remove = jest.fn();
  const _add = jest.fn();

  const wrapper = mount(
    <Table add={_add} tableData={tableData} remove={_remove} />
  );

  describe("UI layout", () => {
    test("matches snapshot", () => {
      expect(toJSON(wrapper)).toMatchSnapshot();
    });
    test("presence of 2 table items", () => {
      expect(wrapper.find("tr")).toHaveLength(3);
    });
    test("first item", () => {
      const first = wrapper.find("tr").at(1);
      expect(first.find("img").props().src).toBe("kenya.jpeg");
      expect(first.find("button")).toHaveLength(1);
      expect(
        first.find("button").hasClass("blue btn btn-info btn-block  darken-2")
      ).toBeTruthy();
      first.find("button").simulate("click");
      expect(_add).toHaveBeenCalled();
      expect(_add).toHaveBeenCalledWith(tableData[0]);
      expect(
        first.find("button").hasClass("blue btn btn-info btn-block  darken-2")
      ).toBeTruthy();
    });
    test("second item", () => {
      const first = wrapper.find("tr").at(2);
      expect(first.find("img").props().src).toBe("tanzania.jpeg");
      expect(first.find("button").text()).toBe("Remove");
      expect(first.find("button")).toHaveLength(1);
      expect(
        first.find("button").hasClass("btn btn-block white-text red darken-2")
      ).toBeTruthy();
      first.find("button").simulate("click");
      expect(_remove).toHaveBeenCalled();
      expect(_remove).toHaveBeenCalledWith(tableData[1]);
      expect(
        first.find("button").hasClass("blue btn btn-info btn-block  darken-2")
      ).toBeFalsy();
    });
  });
});
