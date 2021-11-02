import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { Get } from 'ajwahjs'
import { AnalyserState, RollingData } from '../state/AnalyserState';
import { useStream } from '../hooks';
import { map } from 'rxjs/operators';


const RollingTable = () => {
    const ctrl = Get(AnalyserState)
    const rows = useStream<RollingData[]>(ctrl.stream$.pipe(map(s => s.data)), ctrl.state.data);

    return <TableContainer style={{ marginTop: 20, height: 400 }} component={Paper}>
        <Table aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Frequency</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, index) => (
                    <TableRow
                        key={index}
                    >

                        <TableCell align="left">{row.date}</TableCell>
                        <TableCell align="left">{row.time}</TableCell>
                        <TableCell align="left">{row.frequency}</TableCell>

                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
}
export default RollingTable;