import React from 'react';
import { Line } from 'react-chartjs-2';
import { Get } from 'ajwahjs'
import { AnalyserState } from '../state/AnalyserState';
import { useStream } from '../hooks';
import { map } from 'rxjs/operators';
const LineChart = () => {
    const ctrl = Get(AnalyserState)
    const data = useStream(ctrl.stream$.pipe(map(s => s.lineChart)), ctrl.state.lineChart);
    return <div>
        <Line data={data} />
    </div>;
}
export default LineChart;