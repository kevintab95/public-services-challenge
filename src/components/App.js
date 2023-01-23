import "../styles/App.css";
import React, { Component } from "react";
import Board from "./Board";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOperator: true,
    };
  }

  handleChange = (event) => {
    this.setState({isOperator: event.target.value});
  };

  render() {
    return (
      <div className="App">
        <div className="Header">
          <div>BCM Deliveries</div>
          <div className="ProfileDropdown">
          <FormControl size="small">
            <InputLabel id="demo-simple-select-helper-label">
              profile
            </InputLabel>
            <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={this.state.isOperator}
                label="profile"
                onChange={this.handleChange}>
              <MenuItem value={false}>Driver</MenuItem>
              <MenuItem value={true}>Operator</MenuItem>
            </Select>
          </FormControl>
          </div>
        </div>
        <Board edit={this.state.isOperator} />
      </div>
    );
  }
}

export default App;
