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
  chartData: RollingData[] = [];
    onInit() {
        this.to = moment().subtract(1,'m').toDate();
    this.from = new Date(this.to.getTime() - 1000 * 60 * 60);

    interval(1000 * 15)
      .pipe(
        startWith(0),
        filter((_) => this.state.isChecked),
        tap(() => {
          if (this.state.data.length > 0) {
            var record = this.state.data[0];
            this.from = new Date(`${record.date}T${record.time}`);
              this.to = new Date(this.from.getTime() + 1000 * 15);
              this.from = this.to;
          }
        }),

        switchMap(() =>
          this.getData(
            `${this.baseUrl}/${this.getDateString(
              this.from
            )}/${this.getDateString(this.to)}`
          )
        ),
        filter((data:any[]) => data && data.length>0),
        tap((data:RollingData[]) => {
         
          if (this.state.data.length > 0) {
            
              this.emit({
                  data: this.getGridData(this.state.data, data[0]),
                  lineChart: this.mapLineChartData(this.getChartData(this.chartData, data[0])),
            });
          } else {
              this.chartData = data;
              this.emit({ data: data.concat().sort((a, b) => b.time.localeCompare(a.time)), lineChart: this.mapLineChartData(data) });
          }
        }),
        catchError((err: Error) => {
          console.info(err.message);
          return from([]);
        })
      )
      .subscribe();
  }
    private getGridData(data: any[], record: any) {
        const temp = data.slice(0, data.length-1);
        temp.unshift(record);
        return temp;
    }
    private getChartData(data: any[], record: any) {
        const temp = [...data, record];
        temp.shift();
        this.chartData = temp;
        return temp;
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
        .catch(err => {
            console.log(err);
            debugger;
            throw err;
        })
      
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
