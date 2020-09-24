import React from "react";
import styled from "styled-components";
import { formatNums, formatNumLocale } from "../../helpers";

const TableEl = styled.table.attrs((props) => ({
  className: props.classList,
}))``;
export const DetailsTable = ({ dataset }) => {
  return (
    <TableEl classlist="table table-bordered table-hover">
      <thead>
        <tr>
          <th>Country</th>
          <th>Total cases</th>
          <th>Total deaths</th>
          <th>Recovered</th>
        </tr>
      </thead>
      <tbody>
        {dataset.map((data, i) => (
          <TableDetailsData key={i} data={data} />
        ))}
      </tbody>
    </TableEl>
  );
};

const TableDetailsData = ({ data }) => (
  <tr>
    <td>
      {data.countryregion}{" "}
      <img src={data.flag} width={20} alt="flag" height={10} />
    </td>
    <td className="blue-text darken-1">{formatNumLocale(data.latest)}</td>
    <td className="text-danger">
      {formatNumLocale(data.stats[data.stats.length - 1].deaths)}
    </td>
    <td className="text-success">
      {formatNumLocale(data.stats[data.stats.length - 1].recovered)}
    </td>
  </tr>
);
