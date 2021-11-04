import * as React from 'react';

import { Table, Card } from 'reactstrap';
import { Get } from 'ajwahjs'
import { AnalyserState, RollingData } from '../state/AnalyserState';
import { useStream } from '../hooks';
import { map } from 'rxjs/operators';


const RollingTable = () => {
    const ctrl = Get(AnalyserState)
    const rows = useStream(ctrl.stream$.pipe(map(s => s.data)), ctrl.state.data);

    return (<div style={{ marginBottom: 20, marginTop:20, height: 450, width: '100%', display: 'inline-block', overflow: 'auto' }}>
        <Card>
        <Table size="sm">
        <thead>
            <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Frequency</th>
            </tr>
        </thead>
        <tbody>
            {rows.map((row, index) => (
                <tr
                    key={index}
                >

                    <td>{row.date}</td>
                    <td>{row.time}</td>
                    <td>{row.frequency}</td>

                </tr>
            ))}
        </tbody>
    </Table></Card></div>);
}
export default RollingTable;