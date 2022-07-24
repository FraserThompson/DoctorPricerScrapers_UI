import React, { useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import MapAgeSelector from "./map/MapAgeSelector";
import { AppContext } from "./ScraperApp";
import { DataGrid } from "@mui/x-data-grid";
import { getRegionAverage, getRegionMax } from "./Utils";

export default function DataPanel({ regions }) {
  const [active, setActive] = useState(false);

  const context = useContext(AppContext);

  const currencyFormatter = ({ value }) => {
    if (value == null) {
      return "";
    }
    return `$${value}`;
  };

  const columns = [
    { field: "name", headerName: "Region", width: 180 },
    { field: "number_of_practices", headerName: "Practices", type: "number" },
    {
      field: "enrolling",
      headerName: "Enrolling",
      type: "number",
      valueGetter: ({ row }) =>
        Number((row.number_enrolling / row.number_of_practices) * 100).toFixed(
          2
        ),
      valueFormatter: (params) => {
        if (params.value == null) {
          return "";
        }
        return `${params.value}%`;
      },
    },
    {
      field: "average",
      type: "number",
      headerName: "Average",
      valueGetter: ({ row }) => getRegionAverage(row, context.age),
      valueFormatter: currencyFormatter,
    },
    {
      field: "max",
      type: "number",
      headerName: "Max",
      valueGetter: ({ row }) => getRegionMax(row, context.age),
      valueFormatter: currencyFormatter,
    },
  ];

  return (
    <>
      <Button href="#" onClick={() => setActive(true)}>
        Table fans click here
      </Button>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={active}
        onClose={() => setActive(false)}
      >
        <DialogTitle>Practice data by Region (Age {context.age})</DialogTitle>
        <MapAgeSelector />
        <DialogContent>
          <div style={{ height: "950px", width: "600px" }}>
            <DataGrid
              rows={regions}
              columns={columns}
              pageSize={16}
              rowsPerPageOptions={[5]}
            />
          </div>
          <DialogActions>
            <Button onClick={() => setActive(false)}>Wow nice</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}
