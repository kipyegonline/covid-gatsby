import React, { Component, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Color from "./mock";
const Expandable = (ComposedComponent) =>
  class Expandable extends Component {
    constructor(props) {
      super(props);
      const collapsed = props.hidden && props.hidden == true ? true : false;
      this.state = {
        collapsed,
      };
      this.expandCollapse = this.expandCollapse.bind(this);
    }
    expandCollapse() {
      let collapsed = !this.state.collapsed;
      this.setState({ collapsed });
    }

    render() {
      return (
        <ComposedComponent
          expandCollapse={this.expandCollapse}
          {...this.state}
          {...this.props}
        />
      );
    }
  };
Expandable.propTypes = {
  expandCollapse: PropTypes.func,
};
const ShowHiddenMessage = ({ collapsed, expandCollapse }) => (
  <div>
    <button className=" btn bnt-md red lighten-2" onClick={expandCollapse}>
      Check out
    </button>
    <p>{collapsed ? "My name is Vince" : "Her name is Jules"}</p>
  </div>
);

ShowHiddenMessage.propTypes = {
  collapsed: PropTypes.bool,
  expandCollapse: PropTypes.func,
};
export const Expander = Expandable(ShowHiddenMessage);
export default Expandable;

export function MyForm(props) {
  const placeholder = [
    { text: "All you need to know", id: 1 },
    { text: "I need your love", id: 2 },
    { text: "Unit testing manenos", id: 3 },
  ];
  const [text, setText] = useState("");
  const [posts, setPosts] = useState(placeholder);

  const handleSubmit = (e) => {
    // e.preventDefault()

    if (text.trim().length > 5) {
      setPosts([...posts, { text, id: Date.now() }]);
      setText("");
    }
  };
  const handleDelete = (id) => {
    const newPosts = posts.filter((post) => post.id !== id);

    setPosts(newPosts);
  };

  const handleChange = (e) => setText(e.target.value);
  return (
    <form
      className="form p-5 mx-auto my-2 gray lighten-2"
      onSubmit={handleSubmit}
    >
      <h3>{props.formTitle}</h3>
      <h4>{text}</h4>
      <p>You just want attention</p>
      <ul className="list-group">
        {posts.map((post) => (
          <li key={post.id} className="list-group-item">
            {post.text}{" "}
            <span
              className="text-danger ml-5"
              onClick={() => handleDelete(post.id)}
            >
              X
            </span>
          </li>
        ))}
      </ul>
      <label>Enter text</label>
      <textarea
        className="form-control my-2"
        onChange={(e) => handleChange(e)}
        value={text}
      ></textarea>
      <input
        type="submit"
        className={
          text.length > 0 ? "btn blue lighten-2 clout" : "btn blue lighten-1"
        }
        value="Send Naah"
      />
    </form>
  );
}
