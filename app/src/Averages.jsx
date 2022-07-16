import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { Paper } from "@mui/material";

export default function Averages({ data }) {
  const formattedPrice = (number) => {
    return "$" + (number ? parseFloat(number).toFixed(2) : 0);
  };
  if (data && data.length > 0) {
    return (
      <TableContainer component={Paper}>
        <Table style={{ marginTop: 10 }}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Age</strong></TableCell>
              <TableCell><strong>0</strong></TableCell>
              <TableCell><strong>6</strong></TableCell>
              <TableCell><strong>14</strong></TableCell>
              <TableCell><strong>18</strong></TableCell>
              <TableCell><strong>25</strong></TableCell>
              <TableCell><strong>45</strong></TableCell>
              <TableCell><strong>65</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Average</strong>
              </TableCell>
              {data.map((item, idx) => (
                <TableCell key={idx}>
                  {formattedPrice(item.price__avg || item.average)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Max</strong>
              </TableCell>
              {data.map((item, idx) => (
                <TableCell key={idx}>
                  {formattedPrice(item.price__max || item.max)}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  } else {
    return <CircularProgress />;
  }
}
