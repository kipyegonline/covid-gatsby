import React, { useState } from "react";
import { formatNums, formatNumLocale, paginationDevice } from "../../helpers";
import styled from "styled-components";

const TableEl = styled.table.attrs((props) => ({
  className: props.classList,
}))``;
const Button = styled.button.attrs((props) => ({
  className: props.classlist,
  onClick: props.onClick,
}))`
  outline: none;
  max-width: 200px;
  border: none;
  margin-top: 0.5rem;

  &:active {
    outline: none;
    border: none;
  }
`;

function Table({ tableData, remove, add }) {
  const perPage = 10;
  const [pageNos, setpageNos] = useState(Math.ceil(tableData.length / perPage));
  const [current, setCurrent] = useState(0);

  const getValue = (click) => {
    if (click <= 0) {
      return setCurrent(pageNos - 1);
    }
    if (click >= pageNos) {
      return setCurrent(0);
    }
    setCurrent(click);
  };

  return (
    <div className="table-responsive">
      <Pointer
        text={"<<"}
        classlist="float-left"
        current={current - 1}
        setValue={getValue}
      />
      <Pointer
        text={">>"}
        current={current + 1}
        setValue={getValue}
        classlist="float-right"
      />
      <p className="text-center mt-4">
        Page {current + 1} of {pageNos}
      </p>
      <TableEl classlist="table table-bordered table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Country</th>
            <th>Confirmed</th>
            <th>Deaths</th>
            <th>Visualize</th>
          </tr>
        </thead>
        <tbody>
          {tableData.slice(current * 10, current * 10 + 10).map((item, i) => (
            <TableContent
              key={i}
              index={current * 10 + i}
              data={item}
              add={add}
              remove={remove}
            />
          ))}
        </tbody>
      </TableEl>
      <Pointer
        text={"<<"}
        classlist="float-left"
        current={current - 1}
        setValue={getValue}
      />

      <Pointer
        text={">>"}
        current={current + 1}
        setValue={getValue}
        classlist="float-right"
      />
      <p className="text-center my-4">
        Page {current + 1} of {pageNos}
      </p>
    </div>
  );
}

const TableContent = ({ data, add, remove, index, flag }) => (
  <tr>
    <td>{index + 1}.</td>
    <td>
      {data.countryregion}{" "}
      <img src={data.flag} width={20} alt="flag" height={10} />
    </td>
    <td className="text-info">{formatNumLocale(data.latest)}</td>
    <td className="text-danger">
      {formatNumLocale(data.stats[data.stats.length - 1].deaths)}
    </td>
    <td>
      {!data.added ? (
        <Button
          onClick={() => add(data)}
          classlist="blue btn btn-info btn-block  darken-2"
        >
          Add{" "}
        </Button>
      ) : (
        <Button
          onClick={() => remove(data)}
          classlist=" btn btn-block white-text red darken-2"
        >
          Remove
        </Button>
      )}
    </td>
  </tr>
);
const setStyle = () => ({
  fontWeight: "bold",
  fontSize: "2rem",
  color: "grey",
  lineHeight: "1em",
  padding: "1rem",
});

const Pointer = ({ text, classlist, setValue, current }) => (
  <span
    style={setStyle()}
    onClick={() => setValue(current)}
    className={classlist}
  >
    {text}
  </span>
);
export default Table;
