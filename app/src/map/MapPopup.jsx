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

export default function MapPopup({ practice }) {
  return (
    <Box>
      <Typography variant="h6">
        <Link href={practice.url} target="_blank">
          {practice.name}
        </Link>
      </Typography>
      <Typography variant="subtitle1">{practice.pho}</Typography>
      <Typography variant="body2" style={{ margin: 0 }}>
        {!practice.active ? "Not Enrolling Patients" : ""}
      </Typography>
      <Typography variant="body2" style={{ margin: 0 }}>
        {practice.restriction ? "Restriction: " + practice.restriction : ""}
      </Typography>
      <Typography variant="body2" style={{ margin: 0 }}>
        Last Updated: {practice.updated_at.split("T")[0]}
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="fee table">
          <TableRow sx={{ padding: 0 }}>
            <TableCell sx={{ padding: 0 }}>
              <strong>Age</strong>
            </TableCell>
            <TableCell sx={{ padding: 0 }}>
              <strong>Price</strong>
            </TableCell>
          </TableRow>
          {practice.all_prices.map((priceset) => (
            <TableRow key={priceset.from_age} sx={{ padding: 0 }}>
              <TableCell sx={{ padding: 0 }}>{priceset.from_age}</TableCell>
              <TableCell sx={{ padding: 0 }}>${priceset.price}</TableCell>
            </TableRow>
          ))}
        </Table>
      </TableContainer>
    </Box>
  );
}
