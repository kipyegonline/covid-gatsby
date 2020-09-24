import React from "react"
import { formatNums, formatNumLocale } from "../helpers"
import styled from "styled-components"

const TableEl = styled.table.attrs(props => ({
  className: props.classList,
}))``
const Table = ({ tableData, region }) => (
  <div className="table-responsive">
    <p className="text-center font-weight-bold">COVID19 infections {region}</p>
    <hr />
    <TableEl classlist="table table-bordered table-hover">
      <thead>
        <tr>
          <th>#</th>
          <th>Country</th>
          <th>Total Cases</th>
          <th>Total Deaths</th>
          <th>Recovered</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((item, i) => (
          <TableContent key={i} index={i} {...item} />
        ))}
      </tbody>
    </TableEl>
  </div>
)
const TableContent = ({
  Country,
  index,
  flag,
  TotalConfirmed,
  NewConfirmed,
  TotalDeaths,
  TotalRecovered,
}) => (
  <tr>
    <td>{index + 1}</td>
    <td>
      {Country} <img src={flag} width={20} height={10} />
    </td>
    <td className="text-info">{formatNumLocale(TotalConfirmed)}</td>
    <td className="text-danger">{formatNumLocale(TotalDeaths)}</td>
    <td className="text-success">{formatNumLocale(TotalRecovered)}</td>
  </tr>
)
export default Table
