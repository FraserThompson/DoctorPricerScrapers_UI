import React from "react";
import PracticeListItem from "./PracticeListItem";
import List from "@mui/material/List";
import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { Box } from "@mui/system";

export default function PracticeList({ data, selected, handleSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPractices, setFilteredPractices] = useState(data);

  useEffect(() => {
    setFilteredPractices(data || []);
  }, [data]);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim() == "") {
      setFilteredPractices(data);
      return;
    }
    const filtered = data.filter((practice) =>
      practice.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPractices(filtered);
  }, [searchQuery]);

  const practiceList = filteredPractices.map((practice, index) => {
    return (
      <PracticeListItem
        key={index}
        practice={practice}
        selected={selected == index}
        handleSelect={() => handleSelect(index)}
      />
    );
  });

  return (
    <>
      <Box p={2}>
        <TextField
          id="search"
          variant="standard"
          value={searchQuery}
          style={{ width: "100%" }}
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <List>{practiceList}</List>
    </>
  );
}
