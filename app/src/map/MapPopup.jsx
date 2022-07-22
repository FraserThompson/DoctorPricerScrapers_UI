import {
  Link,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import ReactDOMServer from "react-dom/server";

export default function MapPopup(practice) {
  return ReactDOMServer.renderToString(
    <Box>
      <Typography variant="h6">
        <Link href={practice.url} target="_blank">
          {practice.name}
        </Link>
      </Typography>
      <Typography variant="subtitle1">{practice.pho}</Typography>
      <Typography variant="body2">
        {!practice.active ? "Not Enrolling Patients" : ""}
      </Typography>
      <Typography variant="body2">
        Last Updated: {practice.updated_at.split("T")[0]}
      </Typography>
      <Typography variant="body2">Phone: {practice.phone}</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="fee table">
          <TableRow>
            <TableCell>
              <strong>Age</strong>
            </TableCell>
            <TableCell>
              <strong>Price</strong>
            </TableCell>
          </TableRow>
          {practice.all_prices.map((priceset) => (
            <TableRow key={priceset.from_age}>
              <TableCell>{priceset.from_age}</TableCell>
              <TableCell>${priceset.price}</TableCell>
            </TableRow>
          ))}
        </Table>
      </TableContainer>
    </Box>
  );
}
