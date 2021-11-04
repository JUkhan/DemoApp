
import React from 'react';
import { Get } from 'ajwahjs'
import { AnalyserState } from '../state/AnalyserState';
import { useStream } from '../hooks';
import { map } from 'rxjs/operators';

function Header() {
    const ctrl = Get(AnalyserState)
    const isChecked = useStream(ctrl.stream$.pipe(map(s => s.isChecked)), true);

    function clickHandler() {
        ctrl.setCheckbox(!isChecked);
    }
    return (<div className="form-check">
        <input onChange={clickHandler} checked={isChecked} type="checkbox" className="form-check-input" id="exampleCheck1" />
        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
    </div>)
}

export default Header;