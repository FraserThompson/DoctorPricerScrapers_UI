import React from 'react';
import Utils from './Utils';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import { ProgressBar } from 'react-toolbox/lib/progress_bar';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';

class Stats extends React.Component {
  
  constructor(props) {
    super(props);
  }

  render(){
    if (this.props.data && this.props.data.length > 0){
    return (
        <Card>
            <CardTitle title="Average fees by age" subtitle="NZ Wide"/>
            <CardText>
                <Table selectable={false} style={{ marginTop: 10 }}>
                    <TableHead>
                    <TableCell>Age</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>6</TableCell>
                    <TableCell>13</TableCell>
                    <TableCell>18</TableCell>
                    <TableCell>45</TableCell>
                    <TableCell>65</TableCell>
                    </TableHead>
                    <TableRow>
                    <TableCell>Price</TableCell>
                    {this.props.data.map((item, idx) => (
                        <TableCell key={idx}>${item.price__avg.toFixed(2)}</TableCell>
                    ))}
                    </TableRow>
                </Table>
            </CardText>
        </Card>
        )
    }
    else {
        return <ProgressBar type='circular' mode='indeterminate' multicolor />
    }
  }
}

export default Stats;