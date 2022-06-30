import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Paper, Typography } from "@mui/material";

class Stats extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.data && this.props.data.length > 0) {
      return (
        <Box sx={{p: 2}}>
          <Typography variant="h4">Average fees by age</Typography>
          <Typography variant="subtitle1" gutterBottom>
            NZ Wide
          </Typography>
          <TableContainer component={Paper}>
            <Table style={{ marginTop: 10 }}>
              <TableHead>
                <TableCell>Age</TableCell>
                <TableCell>0</TableCell>
                <TableCell>6</TableCell>
                <TableCell>14</TableCell>
                <TableCell>18</TableCell>
                <TableCell>45</TableCell>
                <TableCell>65</TableCell>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Price</TableCell>
                  {this.props.data.map((item, idx) => (
                    <TableCell key={idx}>
                      $
                      {item.price__avg &&
                        parseFloat(item.price__avg).toFixed(2)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      );
    } else {
      return <CircularProgress />;
    }
  }
}

export default Stats;
