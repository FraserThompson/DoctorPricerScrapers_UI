import React from 'react';
import PHOListItem from './PHOListItem';
import List from '@mui/material/List';
import CircularProgress from '@mui/material/CircularProgress';

class PHOList extends React.Component {
  
  constructor(props) {
    super(props);
  }

  render(){

    if (this.props.list.length > 0){
      var phoList = this.props.list.map(function (pho, index) {
        return (
          <PHOListItem
            key={index}
            name={pho.name}
            website={pho.website}
            module={pho.module}
            last_run={pho.last_run}
            last_scrape={pho.last_scrape}
            average_prices={pho.average_prices}
            number_of_practices={pho.number_of_practices}
            handleSelect={this.props.handleSelect.bind(this)}
            state={pho.state}
            error={pho.error}
            time={pho.time}
            current_task_id={pho.current_task_id}
            updateTask={this.props.updateTask.bind(this)}
          />
        );
      }, this);
    } else {
      var phoList = (<CircularProgress />)
    }

    return (
      <List>
        {phoList}
      </List>
    )

  }
}

export default PHOList;