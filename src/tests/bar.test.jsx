import React from "react";
import Enzyme, { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";
import Bar, { ToolBar, Para } from "../components/covidreact/bar";
import { ToolTip } from "../components/svg/svg";

Enzyme.configure({ adapter: new Adapter() });

const data = [
  { TotalConfirmed: 400, TotalRecovered: 100, totalDeaths: 600 },
  { TotalConfirmed: 200, TotalRecovered: 140, totalDeaths: 1000 },
  { TotalConfirmed: 260, TotalRecovered: 300, totalDeaths: 750 },
  { TotalConfirmed: 140, TotalRecovered: 20, totalDeaths: 450 },
];
const btn = [
  { id: 1, selected: true, continent: "Africa", val: "africa" },
  { id: 2, selected: false, continent: "Asia", val: "asia" },
  { id: 3, selected: false, continent: "America", val: "america" },
  { id: 4, selected: false, continent: "Europe", val: "europe" },
];
describe("<Bar/> component", () => {
  // this is meant to fetch mocked value by the callback from the component
  const getValue = (data) => console.log("rec", data); // eslint-disable no-console
  const func = jest.fn(),
    regionFunc = jest.fn(),
    sortFunc = jest.fn();
  const wrapper = mount(
    <Bar
      data={data}
      a="Country"
      b="TotalConfirmed"
      btns={btn}
      sendBtn={func}
      sendRegion={regionFunc}
      addsort={sortFunc}
    />
  );

  describe(" Presence of UI elements", () => {
    it("renders", () => expect(toJSON(wrapper.find("svg"))).toMatchSnapshot());
    test("SVG presence and its props", () => {
      expect(wrapper.find("g").length).toBe(4);
      expect(wrapper.find("rect")).toHaveLength(4);
      expect(wrapper.find("button")).toHaveLength(5);
      expect(wrapper.find("div")).toHaveLength(3);

      expect(
        wrapper
          .find("button")
          .at(2)
          .hasClass("btn btn-md btn-info mr-2 blue lighten-1")
      ).toBe(true);
    });

    test("button click", () => {
      //onclick
      wrapper
        .find("button")
        .at(2)
        .simulate("click");
      //btn
      expect(
        wrapper
          .find("button")
          .at(2)
          .hasClass("btn btn-md btn-info mr-2 blue lighten-1")
      ).toBe(true);
      expect(func).toBeCalledTimes(1);
      expect(func).toBeCalledWith(2);
      expect(regionFunc).toBeCalledWith("asia");
    });

    // first btn on click
    wrapper
      .find("button")
      .at(0)
      .simulate("click");
    expect(
      wrapper
        .find("button")
        .at(0)
        .text()
    ).toBe("Unsort");
    // para
    expect(wrapper.find("p.comp").text()).toBe(
      "Kindly view this graph on computer or larger device for better user experience"
    );
  });

  describe("svg components", () => {
    test.skip("first rect and props", () => {
      const rect = wrapper.find("rect").at(0);
      rect.simulate("click", {
        target: {
          TotalConfirmed: 400,
          TotalRecovered: 100,
          totalDeaths: 600,
        },
      });
    });
  });

  describe("SVG guide", () => {
    setTimeout((done) => {
      const guide = wrapper.find("quickquide");
      expect(
        guide
          .find("p")
          .at(0)
          .text()
      ).toBe("Siii");
      done();
    });
  }, 2000);
});

describe("<ToolBar/>", () => {
  const data = {
    width: 100,
    Country: "Kenya",
    confirmed: 384,
    recovered: 129,
    deaths: 14,
    flag: "Ke.jpg",
  };
  const wrapper = shallow(<ToolBar tooltip data={data} />);

  it("receives the right props", () => {
    expect(wrapper.find("img").prop("src")).toBe("Ke.jpg");
    expect(
      wrapper
        .find(Para)
        .at(0)
        .text()
    ).toBe("Kenya");
    expect(
      wrapper
        .find(Para)
        .at(1)
        .text()
    ).toBe("Confirmed: 384");
  });
  expect(
    wrapper
      .find(Para)
      .at(2)
      .text()
  ).toBe("Deaths: 14");
  expect(
    wrapper
      .find(Para)
      .at(3)
      .text()
  ).toBe("Recovered: 129");
});
describe("<ToolTip/>", () => {
  const wrapper = shallow(
    <ToolTip tool data={{ dw: 100, bg: "red", x: 50, y: 50 }} />
  );
});
