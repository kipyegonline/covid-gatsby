import React from "react";
import Enzyme, { mount, shallow } from "enzyme";
import toJSON from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";
import { createStore } from "redux";
import CountryList from "../components/covidreact/countries/CountryList";
Enzyme.configure({ adapter: new Adapter() });

import Expandable, { MyForm } from "./hoc";
import keReducer from "../redux/kenyaReducer/keReducer";
import rootReducer from "../redux/rootReducer";
import { C } from "../redux/kenyaReducer/types";
import { addKe } from "../redux/kenyaReducer/actions";
import LineChart from "../components/covidreact/line/lineChart";
import Line from "../components/covidreact/line/line";

jest.mock(
  "./mock.js",
  () => ({ rating, colorId, onRate = (f) => f, onRemove = (f) => f }) => (
    <div>
      <button className="rate" onClick={() => onRate(rating)} />
      <button className="remove" onClick={() => onRemove(colorId)} />
    </div>
  )
);

describe("<ColorList/> UI component", () => {
  describe("Rating a color", () => {
    let _rate = jest.fn(),
      _remove = jest.fn();

    beforeEach(() => {
      mount(
        <ColorList
          colors={[
            { color: "red", id: 1, title: "rebeccapurple" },
            { color: "green", id: 2, title: "pink" },
          ]}
          onRate={_rate}
        />
      )
        .find("button.rate")
        .first()
        .simulate("click");
      mount(
        <ColorList
          colors={[
            { color: "red", id: 1, title: "rebeccapurple" },
            { color: "green", id: 2, title: "pink" },
          ]}
          onRemove={_remove}
        />
      )
        .find("button.remove")
        .simulate("click");
    });
    it.skip("invokes onRate handler", () => expect(_rate).toBeCalledTimes(1));
    it.skip("removes the correct Color", () =>
      expect(_remove).toBeCalledWith(1));
  });
});

//unit tests for another component
describe("Expands HOC", () => {
  let props,
    wrapper,
    ComposedComponent,
    MockComponent = ({ collapsed, expandCollapse }) => (
      <div onClick={expandCollapse}>{collapsed ? "collapsed" : "expanded"}</div>
    );

  describe("rendering UI", () => {
    beforeAll(() => {
      ComposedComponent = Expandable(MockComponent);
      wrapper = mount(
        <ComposedComponent hidden={true} foo="foo" gnar="gnar" />
      );
      props = wrapper.find(MockComponent).props();
    });

    test("starts off collapsed", () => expect(props.collapsed).toBe(true));
    test("passes the expand collapse func to composed", () =>
      expect(typeof props.expandCollapse).toBe("function"));
    test("passes additional gnar prop to composed", () =>
      expect(props.gnar).toBe("gnar"));
    test("hidden prop", () => expect(props.hidden).toBe(true));
  });

  describe("Expand Collapse Functionality", () => {
    let instance;
    beforeAll(() => {
      ComposedComponent = Expandable(MockComponent);
      wrapper = mount(<ComposedComponent collapsed={false} />);
      instance = wrapper.instance();
      wrapper.update();
    });
    test.skip("renders the mock component as root element", () =>
      expect(wrapper.find(MockComponent)).toBe(MockComponent));
    test("starts off expanded", () =>
      expect(instance.state.collapsed).toBe(false));

    test.skip("toggles the collapsed state", () =>
      expect(instance.state.collapsed).toBe(true));
  });
});
let pp1 = [
  { name: "Vince", time: new Date().toDateString() },
  { name: "Jules", time: new Date().toDateString() },
  { name: "Mark", time: new Date().toDateString() },
];

describe("Ke  reducer", () => {
  const action1 = { type: C.ADD_KE, payload: pp1 };
  const res = keReducer([], action1);
  test("add cwd", () => expect(res).toEqual({ cwd: [], all: pp1 }));

  const act1 = { type: C.SORT_GRAPH, sorted: true };
  test("sorting", () => expect(keReducer({}, act1)).toEqual({ sort: true }));
});

describe("<MyForm> component", () => {
  let wrapper, _submit, _change, _click;

  describe("Main Wrapper", () => {
    beforeEach(() => {
      _click = jest.fn();
      _submit = jest.fn();
      _change = jest.fn();
      wrapper = shallow(
        <MyForm submit={_submit} onChange={_change} onClick={_click} />
      );
    });
    //afterEach(() => wrapper.unmount());

    test("snapshots", () => expect(wrapper.html()).toMatchSnapshot());
    it("contains a list of three items", () => {
      expect(wrapper.find("li")).toHaveLength(3);
      expect(
        wrapper
          .find("li")
          .first()
          .text()
      ).toEqual("All you need to know X");
      expect(wrapper.find("h4").text()).toHaveLength(0);
    });
    it("Text area changes", () => {
      wrapper.find("textarea").simulate("change", {
        target: { value: "Ava Max is sweeter but  a psycho...." },
      });

      expect(wrapper.find("input[type='submit']").hasClass("clout")).toBe(true);
      expect(wrapper.find("textarea").prop("value")).toEqual(
        "Ava Max is sweeter but  a psycho...."
      );
      expect(wrapper.find("h4").text()).toHaveLength(36);
      wrapper.find("form").simulate("submit");
      wrapper.update();

      expect(wrapper.find("textarea").prop("value").length).toBe(0);
      expect(wrapper.find("li").length).toEqual(4);
    });

    test("when an item is deleted", () => {
      wrapper
        .find("span")
        .first()
        .simulate("click");
      expect(wrapper.find("li").length).toEqual(2);
    });
    test("submit button", () => {
      expect(wrapper.find('input[type="submit"]').props()).toEqual({
        type: "submit",
        className: "btn blue lighten-1",
        value: "Send Naah",
      });
    });
  });
});

describe("<Events/>", () => {
  let _change = jest.fn();
  let wrapper = shallow(<MyForm formTitle="My Form" onChange={_change} />);
  wrapper
    .find("textarea")
    .simulate("change", { target: { value: "Tenerife sea" } });
  test("snapshot match", () => expect(toJSON(wrapper)).toMatchSnapshot());
  test("change event", () => {
    const wrapped = shallow(<MyForm formTitle="My Form" onChange={_change} />);
    expect(wrapped.find("h3").text()).toEqual("My Form");
    expect(wrapped.find("p").text()).toEqual("You just want attention");
  });
});

/**
 * Jest config
 * {
 * "setUpFiles":[
 * "raf/polyfill",
 * "<rootDir>/src/tests/setupTest.js"],
 * "snapshotSerializers":["enzyme-to-jsom/serializer"]}
 */
