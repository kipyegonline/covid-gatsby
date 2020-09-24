import React, { useState } from "react";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import toJSON, { toJson } from "enzyme-to-json";
import { MyForm, Countries, CountryList } from "./hoc";

Enzyme.configure({ adapter: new Adapter() });

describe("<MyForm/> issues", () => {
  let wrapper = shallow(<MyForm formTitle={"Angela Agina"} />);

  test("snapshot", () => expect(toJSON(wrapper)).toMatchSnapshot());
  test("para", () =>
    expect(wrapper.find("p").text()).toBe("You just want attention"));
  test("presence of a list", () => {
    expect(wrapper.find("li")).toHaveLength(3);
  });
  test("submit button", () => {
    const props = {
      type: "submit",
      value: "Send Naah",
      className: "btn blue lighten-1",
    };
    expect(wrapper.find("input[type='submit']").props()).toEqual(props);
  });
});

const TextArea = ({ value, thanks }) => {
  const [wrapper, setWrapper] = useState("");
  return (
    <div>
      <h3>{wrapper}</h3>
      <label>*Enter Message</label>
      <textarea
        onChange={(e) => setWrapper(e.target.value)}
        value={value}
      ></textarea>
      <p className="text-sucess">{thanks}</p>
    </div>
  );
};

test("<Text area/>", () => {
  const _change = jest.fn();
  const wrapper = shallow(
    <TextArea value={10} onChange={_change} thanks="Karibu" />
  );
  expect(toJSON(wrapper)).toMatchSnapshot();
  expect(wrapper).toHaveLength(1);
  expect(wrapper.find("textarea").prop("value")).toEqual(10);
  wrapper.setProps({ value: 20 });
  expect(wrapper.find("textarea").prop("value")).toEqual(20);
  expect(wrapper.find("p").text()).toEqual("Karibu");
  expect(wrapper.find("h3").text()).toEqual("");
  wrapper
    .find("textarea")
    .simulate("change", { target: { value: "Jules is raining" } });
  //wrapper.update();
  expect(wrapper.find("h3").text()).toEqual("Jules is raining");
});
