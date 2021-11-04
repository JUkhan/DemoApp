import React, { Component } from 'react';
import RollingTable from './RollingTable';
import LineChart from './LineChart';
import Header from './RollingHeader';

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
        <div>
            <Header />
            <LineChart />
            <RollingTable />
      </div>
    );
  }
}
