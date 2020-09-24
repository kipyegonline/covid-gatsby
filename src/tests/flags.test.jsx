import Enzyme, { shallow, mount } from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import toJSON, { toJson } from "enzyme-to-json";
import Pagination from "../components/covidreact/countries/pagination";

Enzyme.configure({ adapter: new Adapter() });
describe("<Pagination/>", () => {
  const _click = jest.fn();
  const wrapper = shallow(
    <Pagination pages={10} setPage={_click} current={4} />
  );
  console.log(wrapper.debug());
  test("matches snapshot", () => {
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  test("presence of number of pages", () => {
    expect(wrapper.find(".page-icon")).toHaveLength(10);
  });
  describe("first element presence", () => {
    const el = wrapper.find(".page-icon").at(1);
    test("presence of second element", () => expect(el.text()).toBe("1"));
    test("click on the el", () => {
      el.simulate("click");
      expect(_click).toHaveBeenCalled();
      expect(_click).toBecalledTimes(2);
      expect(_click).toBeCalledWith(2);
    });
  });
  describe("Current element", () => {
    const elactive = wrapper.find(".page-icon").at(4);
    test("active page", () => {
      expect(elactive.prop("style")).toEqual({ background: "red" });
    });
  });
});
