import React from "react";
import styled from "styled-components";

const MainPages = styled.div.attrs((props) => ({ onClick: props.handleClick }))`
  max-width: 100%;
  background: #ccc;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 480px) {
    & {
      background: #ddd;
    }
  }
`;
const Pages = styled.div.attrs((props) => ({
  onClick: props.handleClick,
  className: props.classlist,
}))`
  padding: 1rem;
  width: 40px;
  height: 40px;
  line-height: 1em;
  text-align: center;
  font-weight: normal;
  font-family: roboto;
  font-size: 1rem;
  margin: 0 0.5rem;
  border-radius: 50%;
  @media (max-width: 480px) {
    & {
      margin: 0.25rem;
    }
  }
`;

const Pagination = ({ pages, setPage, current }) => {
  const pageCount = [...Array(pages)].map((page, i) => i);

  return (
    <>
      <hr className="divider" />
      <p className="text-center">
        Page {current + 1} of {pages}.{" "}
      </p>
      <MainPages>
        {pages > 0
          ? pageCount.map((p) => (
              <Pages
                key={p}
                className={"page-icon"}
                style={{ background: p > current ? "gray" : "red" }}
                handleClick={() => setPage(p)}
              >
                {p + 1}
              </Pages>
            ))
          : null}
      </MainPages>
    </>
  );
};
export default Pagination;
