import { Component, OnInit, DoCheck } from '@angular/core';
import { HttpService } from '../http.service';
import { UtilService } from '../util.service';
declare var StockChart: any;
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, DoCheck {
  dateList: any;
  stockHQ: any;
  date: String;
  quote50ETF: any;
  quoteDetail: any;
  q50eft = {
    lastPrice: '',
    upDiff: '',
    upRatio: '',
    stockCode: ''
  };
  code = '';
  price = [];
  isconnect: boolean;
  preClosePrice: any; // 昨收价
  volumes = [];
  staticData = {
    stockName: '',
    exerciseDate: '',
    leftDays: '',
    exercisePrice: '',
    preClosePrice: ''
  };
  constructor(public data: UtilService, public http: HttpService) { }

  ngOnInit() {
    this.stockHQ = this.data.stockHQ;
    this.getDate();
  }

  ngDoCheck() {
    this.stockHQ = this.data.stockHQ;
  }

  getDate() {
    this.http.heyuezhouqi().subscribe(res => {
      this.dateList = res;
      this.date = res[0];
      this.getlist();
    }, (err) => {
      this.data.isError(err.error);
    });
  }

  getlist() {
    this.http.heyueList(this.date).subscribe(res => {
      this.quoteDetail = res['quoteDetail'];
      this.q50eft = res['quote50ETF'];
      this.data.timeoutQoute = setTimeout(() => {
        this.getlist();
      }, 1000);
    }, (err) => {
      this.data.isError(err.error);
    });
  }
  /**
   * 返回行情加个颜色
   */
  HQColor(price) {
    if (price !== '--') {
      if (price > this.stockHQ.preClosePrice) {
        return 'red';
      } else if (price < this.stockHQ.preClosePrice) {
        return 'green';
      } else {
        return '';
      }
    }

  }

  color(string) {
    if (string) {
      if (string.indexOf('-') >= 0) {
        return 'green';
      } else {
        return 'red';
      }
    }
  }

  change(date) {
    this.date = date;
    this.data.clearTimeOut();
    this.getlist();
  }

  goto(code) {
    // this.data.setSession('optionCode', code);
    // this.code = code;
    // this.subscribeStock();
    // this.getStatic();
    this.data.searchStockCode = code;
    this.data.goto('main/sell');
  }

  getStatic() {
    this.http.getStatic(this.code).subscribe(res => {
      this.staticData = Object.assign(this.staticData, res);
      this.getFenshituList();
    }, err => {
      this.data.isError(err.error);
    });
  }

  getFenshituList() {
    if (!this.data.isNull(this.code)) {
      this.http.fenshituList(this.code).subscribe((res) => {
        this.price = [];
        this.volumes = [];
        Object.keys(res).forEach(key => {
          this.price.push(res[key].lastPrice);
          this.volumes.push(res[key].incrVolume);
        });
        this.fenshitu();
        this.data.timeoutFenshi = setTimeout(() => {
          this.getFenshituList();
        }, 30000);
      }, (err) => {
        this.data.isError(err.error);
      });
    }
  }

  /**
  * 订阅股票
  */
  subscribeStock() {
    this.http.getGPHQ(this.code).subscribe((res) => {
      if (!this.data.isNull(res['resultInfo']['quotation'])) {
        this.data.stockHQ = res['resultInfo']['quotation'];
      } else {
        this.stockHQ = this.data.stockHQ;
      }
    }, (err) => {
      this.data.isError(err.error);
    });
  }

  fenshitu() {
    StockChart.drawTrendLine({
      id: 'trendLine',
      height: 500,
      width: 500,
      prices: this.price,
      volumes: this.volumes,
      volumeHeight: 100,
      textColor: 'rgb(0,0,0)',
      preClosePrice: parseFloat(this.staticData.preClosePrice.toString()),
      middleLineColor: 'rgb(169, 126, 0)'
    });
  }
}
