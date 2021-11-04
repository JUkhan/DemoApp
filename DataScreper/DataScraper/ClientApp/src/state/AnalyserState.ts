import { StateController, effect } from 'ajwahjs';
import {
  tap,
  map,
  switchMap,
  delay,
  filter,
  startWith,
  catchError,
} from 'rxjs/operators';
import { Observable, from, interval } from 'rxjs';
import moment from 'moment';

export type RollingData = {
  date: string;
  time: string;
  frequency: number;
};

export interface IAnalyserState {
  data: RollingData[];
  lineChart: any;
  isChecked: boolean;
}

export class AnalyserState extends StateController<IAnalyserState> {
  from = new Date();
  to = new Date();
  constructor() {
    super({
      data: [],
      isChecked: true,
      lineChart: {
        labels: [],
        datasets: [
          {
            label: 'Rolling Frequency',
            data: [],
          },
        ],
      },
    });
  }
  setCheckbox(isChecked: boolean) {
    this.emit({ isChecked });
  }
  onInit() {
    this.to = moment().subtract(1, 'days').toDate();
    this.from = new Date(this.to.getTime() - 1000 * 60 * 60);

    interval(1000 * 15)
      .pipe(
        startWith(0),
        filter((_) => this.state.isChecked),
        tap(() => {
          if (this.state.data.length > 0) {
            var record = this.state.data[this.state.data.length - 1];
            this.from = new Date(`${record.date}T${record.time}`);
            this.to = new Date(this.from.getTime() + 1000 * 15);
          }
        }),

        switchMap(() =>
          this.getData(
            `${this.baseUrl}/${this.getDateString(
              this.from
            )}/${this.getDateString(this.to)}`
          )
        ),
        //map((data) => this.mapHistogramData(data)),
        tap((data) => {
          console.log(data);
          if (this.state.data.length > 0) {
            const temp = this.state.data.slice();
            temp.shift();
            temp.push(data[1]);
            this.emit({
              data: temp,
              lineChart: this.mapLineChartData(temp),
            });
          } else {
            this.emit({ data, lineChart: this.mapLineChartData(data) });
          }
        }),
        catchError((err: Error) => {
          console.error('error::', err.message);
          return from([]);
        })
      )
      .subscribe();
  }
  getDateString(date: Date) {
    return moment(date).format('yyyy-MM-DD HH:mm:ss');
  }
  baseUrl = 'RollingData';

  private getData(url: string) {
    return from(
      fetch(url, {
        method: 'GET',
        headers: {
          //Accepts: 'application/json',
          'Content-Type': 'application/json',
        },
        //body: JSON.stringify(this.searchFormData()),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.Status == 500) {
            throw new Error(data.Error);
          }
          return data;
        })
      //.catch((err) => console.error('catch:', err))
    );
  }
  private mapLineChartData(data: RollingData[]) {
    return data.reduce<any>(
      (acc, item) => {
        acc.labels.push(item.time);
        acc.datasets[0].data.push(item.frequency);
        return acc;
      },
      {
        labels: [],
        datasets: [
          {
            label: 'Rolling Frequency',
            data: [],
          },
        ],
      }
    );
  }
}
