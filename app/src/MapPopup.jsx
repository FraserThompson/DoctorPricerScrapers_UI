import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import ReactDOMServer from "react-dom/server";

export default function MapPopup(practice) {
  return ReactDOMServer.renderToString(
    <h5>
      <a href={practice.url} target="_blank">
        {practice.name}
      </a>
      <br />
      {!practice.active ? (
        <>
          <small>
            <strong>Not Enrolling Patients</strong>
          </small>
          <br />
        </>
      ) : (
        <></>
      )}
      <small>Phone: {practice.phone}</small>
      <br />
      <small>{practice.pho}</small>
      <br />
      <TableContainer component={Paper}>
        <Table aria-label="fee table">
          <TableRow>
            <TableCell>Age</TableCell>
            <TableCell>Price</TableCell>
          </TableRow>
          {practice.all_prices.map((priceset) => (
            <TableRow>
              <TableCell>{priceset.from_age}</TableCell>
              <TableCell>${priceset.price}</TableCell>
            </TableRow>
          ))}
        </Table>
      </TableContainer>
    </h5>
  );
}
