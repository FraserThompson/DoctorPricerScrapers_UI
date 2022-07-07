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
  if (data && data.length > 0) {
    return (
      <TableContainer component={Paper}>
        <Table style={{ marginTop: 10 }}>
          <TableHead>
            <TableRow>
              <TableCell>Age</TableCell>
              <TableCell>0</TableCell>
              <TableCell>6</TableCell>
              <TableCell>14</TableCell>
              <TableCell>18</TableCell>
              <TableCell>25</TableCell>
              <TableCell>45</TableCell>
              <TableCell>65</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Price</TableCell>
              {data.map((item, idx) => (
                <TableCell key={idx}>
                  $
                  {(item.price__avg || item.average) &&
                    parseFloat(item.price__avg || item.average).toFixed(2)}
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
