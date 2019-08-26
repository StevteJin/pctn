import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../http.service';
import { UtilService } from '../util.service';
declare var StockChart: any;
declare var EmchartsWebTime: any;
@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit, OnDestroy, DoCheck {
  validateForm: FormGroup;
  isFullScreen = false;
  isVisible = false;
  tabUrl: string;
  text: string;
  code = '';
  list: any;
  maxAppointCnt = '0';
  fullcount = 0;
  lastPrice = '';
  socketInterval: any;
  radioValue = '';
  radioValue2 = '';
  connectStatus = false;
  classType: string;
  text2 = '';
  maxBuyCnt = '0';
  ygsxf = 0; // 预估手续费
  commission = 0; // 交易佣金
  stockInfo = {
    stockCode: '',
    stockName: '',
    appointCnt: '',
    appointPrice: '',
  };
  stockHQ = this.util.stockHQ;
  preClosePrice: any; // 昨收价
  volumes = [];
  price = [];
  userCode = '';
  totalPrice: number;
  constructor(public http: HttpService, public util: UtilService) {
    this.userCode = this.util.userName;
  }

  ableCnt() {
    if (!this.util.isNull(this.stockInfo.appointPrice)) {
      if (this.stockInfo.appointPrice === '0') {
        this.maxBuyCnt = '0';
      } else {
        this.maxBuyCnt = (this.util.ableScale / (100 * parseFloat(this.stockInfo.appointPrice) + this.commission)).toString();
        this.maxBuyCnt = parseInt(this.maxBuyCnt, 0).toString();
      }
    }
    return this.maxBuyCnt;
  }


  handleOk(): void {
    this.submintBuy();
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  ngDoCheck() {
    if (this.util.searchStockCode !== '' && this.util.searchStockCode.length === 6 && this.util.searchStockCode !== this.code) {
      this.code = this.util.searchStockCode;

      this.selectOption();
    }
    this.stockHQ = this.util.stockHQ;
    this.maxAppointCnt = this.util.sellCnt;
  }
  ngOnInit() {
    this.util.resetStockHQ();
    this.tabUrl = this.util.getUrl(3);
    if (this.util.getUrl(2) === 'buy') {
      this.text = '买入';
      this.classType = 'BUY';
      this.text2 = '买';
    } else if (this.util.getUrl(2) === 'sell') {
      this.text = '卖出';
      this.classType = 'SELL';
      this.text2 = '卖';
    }
    this.http.commission().subscribe(res => {
      this.commission = parseFloat(res.toString());
    });
    this.http.searchStock(0).subscribe((res) => {
      this.list = res;
    }, (err) => {
      this.util.isError(err.error);
    });
    this.getList();
  }

  ngOnDestroy() {
    this.util.resetStockHQ();
  }
  Multiply(a, b): number {
    if (!this.util.isNull(a) && !this.util.isNull(b)) {
      return parseFloat(a) * parseFloat(b);
    } else {
      return 0;
    }
  }
  goto(url) {
    this.tabUrl = url;
    this.util.goto(`/main/${this.util.getUrl(2)}/${url}`);
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

  /**
    * 增加减少买入价
    */
  count(type) {
    if (!this.util.isNull(this.stockInfo.appointPrice)) {
      let price = parseFloat(this.stockInfo.appointPrice);
      if (type === -1 && price > 0) { // 减
        price = price - 0.01;
      } else if (type === 1) { // 加
        price = price + 0.01;
      }
      this.formatPrice(price);
    }
  }

  onInput() {
    this.util.searchStockCode = this.code;
    this.http.searchStock(this.code).subscribe((res) => {
      this.list = res;
    }, (err) => {
      this.util.isError(err.error);
    });
    if (this.code.length === 0) {
    }
    if (this.code.length === 6) {
      this.selectOption();
    }
  }

  keyup(code) {
    this.code = code;
    this.selectOption();
  }

  selectOption() {
    this.radioValue = '';
    this.util.searchStockCode = this.code;
    this.stockInfo.stockCode = this.code;
    this.http.getGPHQ(this.code).subscribe((res) => {console.log('我在执行');
      this.stockHQ = res['resultInfo']['quotation'];
      this.util.stockHQ = this.stockHQ;
      if (this.classType === 'BUY') {
        this.fullcount = res['resultInfo']['maxBuyCnt'];
        this.stockInfo.appointCnt = '100';
      } else {
        this.fullcount = res['resultInfo']['maxSellCnt'];
        this.stockInfo.appointCnt = this.fullcount.toString();
      }
      this.stockInfo.stockName = this.stockHQ.stockName;
      this.radioValue2 = '1';
      this.formatPrice(res['resultInfo']['quotation']['lastPrice']);
      window.clearTimeout(this.util.timeoutQoute);
      this.getFenshituList();
    }, (err) => {
      this.util.isError(err.error);
    });
  }

  radio(num) {
    switch (num) {
      case 1:
        if (this.classType === 'BUY') {
          this.stockInfo.appointCnt = this.util.roundDown(this.fullcount).toString();
        } else {
          this.stockInfo.appointCnt = this.fullcount.toString();
        }
        break;
      case 2:
        this.stockInfo.appointCnt = this.util.roundDown(this.fullcount / 2).toString();
        break;
      case 3:
        this.stockInfo.appointCnt = this.util.roundDown(this.fullcount / 3).toString();
        break;
      case 4:
        this.stockInfo.appointCnt = this.util.roundDown(this.fullcount / 4).toString();
        break;
      default:
        break;
    }
  }

  /**
   * 选择买入量
   */
  selectCount(count) {
    this.stockInfo.appointCnt = count.toString();
  }

  reset() {
    this.maxBuyCnt = '0';
    this.util.searchStockCode = '';
    this.code = '';
    this.fullcount = 0;
    this.maxAppointCnt = '0';
    this.radioValue = '';
    this.util.sellCnt = '';
    this.radioValue2 = '';
    this.stockInfo = {
      stockCode: '',
      stockName: '',
      appointCnt: '',
      appointPrice: '',
    };
    this.util.stockHQ = {
      priceDownlimit: 0,
      priceUplimit: 0,
      stockName: '',
      highPrice: 0,
      lowPrice: 0,
      preClosePrice: 0,
      lastPrice: 0,
      upRatio: 0,
      buyLevel: {
        'buyPrice01': '--',
        'buyPrice02': '--',
        'buyPrice03': '--',
        'buyPrice04': '--',
        'buyPrice05': '--',
        'buyPrice06': '--',
        'buyPrice07': '--',
        'buyPrice08': '--',
        'buyPrice09': '--',
        'buyPrice10': '--',
        'buyVolume01': '--',
        'buyVolume02': '--',
        'buyVolume03': '--',
        'buyVolume04': '--',
        'buyVolume05': '--',
        'buyVolume06': '--',
        'buyVolume07': '--',
        'buyVolume08': '--',
        'buyVolume09': '--',
        'buyVolume10': '--'
      },
      sellLevel: {
        'sellPrice01': '--',
        'sellPrice02': '--',
        'sellPrice03': '--',
        'sellPrice04': '--',
        'sellPrice05': '--',
        'sellPrice06': '--',
        'sellPrice07': '--',
        'sellPrice08': '--',
        'sellPrice09': '--',
        'sellPrice10': '--',
        'sellVolume01': '--',
        'sellVolume02': '--',
        'sellVolume03': '--',
        'sellVolume04': '--',
        'sellVolume05': '--',
        'sellVolume06': '--',
        'sellVolume07': '--',
        'sellVolume08': '--',
        'sellVolume09': '--',
        'sellVolume10': '--'
      }
    };
    window.clearTimeout(this.util.timeoutFenshi);
  }

  /**
     * 选择价格类型
     */
  selectType(type) {
    switch (type) {
      case 1:
        this.stockInfo.appointPrice = this.stockHQ.lastPrice.toString();
        break;
      case 2:
        this.stockInfo.appointPrice = this.stockHQ.sellLevel.sellPrice01;
        break;
      case 3:
        this.stockInfo.appointPrice = this.stockHQ.buyLevel.buyPrice01;
        break;
      default:
        break;
    }
    this.formatPrice(this.stockInfo.appointPrice);
  }

  formatPrice(price) {
    this.stockInfo.appointPrice = this.util.roundNum(price, 4).toString();
  }

  /**
  * 选取价格
  */
  selectPrice(price) {
    if (price !== '--') {
      if (typeof (price) === 'string') {
        this.stockInfo.appointPrice = this.util.roundNum(price, 4).toString();
      } else {
        this.stockInfo.appointPrice = price;
      }
    }
    this.formatPrice(this.stockInfo.appointPrice);
  }

  handle() {
    const appointPrice = parseFloat(this.stockInfo.appointPrice);
    const appointCnt = parseInt(this.stockInfo.appointCnt, 0);
    let fee = appointPrice * appointCnt * this.ygsxf;
    if (fee <= 5) {
      fee = 5 + fee;
    }
    if (this.classType === 'BUY') { // 买入手续费
      return Math.round((fee + appointPrice * appointCnt * 0.00002) * 100) / 100;
    } else { // 卖出手续费
      // tslint:disable-next-line:max-line-length
      return Math.round((fee + appointPrice * appointCnt * 0.00002 + appointPrice * appointCnt * 0.001) * 100) / 100;
    }
  }

  count2(type) {
    let appointCnt = parseInt(this.stockInfo.appointCnt, 0);
    if (!this.util.isNull(appointCnt)) {
      if (type === -1 && appointCnt > 0) {
        appointCnt = appointCnt - 100;
      } else if (type === 1) {
        appointCnt = appointCnt + 100;
      }
    }
    this.stockInfo.appointCnt = appointCnt.toString();
  }

  /**
     * 买入
     */
  buy() {
    if (this.classType === 'SELL') {
      this.text = '卖出';
    } else {
      this.text = '买入';
    }
    this.ygsxf = this.commission;
    this.stockInfo.appointCnt = this.stockInfo.appointCnt.toString();
    const appointPrice = Number.parseFloat(this.stockInfo.appointPrice);
    if (this.util.isNull(this.stockInfo.stockName)) {
      this.util.errorMessage('股票名称不能为空');
    } else if (this.util.Decimal(appointPrice) > 2) {
      this.util.errorMessage('委托价格不能超过两位小数');
    } else if (this.util.isNull(appointPrice)) {
      this.util.errorMessage('委托价格必须大于0');
    } else if (appointPrice > this.stockHQ.priceUplimit) {
      this.util.errorMessage(' 委托价格不能超过涨停价');
    } else if (appointPrice < this.stockHQ.priceDownlimit) {
      this.util.errorMessage(' 委托价格不能低于跌停价');
    } else if (this.stockInfo.appointCnt.indexOf('.') > 0) {
      this.util.errorMessage(' 委托数量必须是整数');
    } else if (parseInt(this.stockInfo.appointCnt, 0) <= 0) {
      this.util.errorMessage('委托数量必须大于0');
    } else if (parseInt(this.stockInfo.appointCnt, 0) > this.fullcount) {
      if (this.classType === 'SELL') {
        this.util.errorMessage('可卖数量不足');
      } else {
        this.util.errorMessage('可用资金不足');
      }

    } else {
      this.isVisible = true;
      const data = {
        stockCode: this.stockInfo.stockCode,
        appointCnt: this.stockInfo.appointCnt,
        appointPrice: this.stockInfo.appointPrice
      };


    }

  }

  /**
     * 买入确认
     */
  submintBuy() {
    const content = {
      'stockCode': this.stockInfo.stockCode,
      'appointCnt': this.stockInfo.appointCnt,
      'appointPrice': this.stockInfo.appointPrice
    };
    this.http.order(this.classType, content, this.classType === 'BUY' ? 'OPEN' : 'CLOSE').subscribe((res: Response) => {
      if (res['success']) {
        this.util.successMessage('委托已提交');
        this.isVisible = false;
        this.reset();
      }
    }, (err) => {
      this.util.isError(err.error);
      this.isVisible = false;
    });
  }

  getFenshituList() {
    const marketType = (this.code.substr(0, 1) === '5' || this.code.substr(0, 1) === '6') ? '1' : '2';
    // 初始化参数
    const chart = new EmchartsWebTime({
      dpr: 1,
      code: this.code + marketType,
      container: 'chart',
      width: 600,
      height: 270,
      type: 'R'
    });
    // 调用绘图方法
    chart.draw();
  }

  fenshitu() {
    StockChart.drawTrendLine({
      id: 'trendLine',
      height: 270,
      width: 400,
      prices: this.price,
      volumes: this.volumes,
      volumeHeight: 70,
      preClosePrice: parseFloat(this.stockHQ.preClosePrice.toString()),
      middleLineColor: 'rgb(169, 126, 0)'
    });
  }

  getList() {
    this.http.getList('tntg/hold', {}).subscribe((res) => {
      const list = Object.assign([], res);
      list.some(element => {
        if (element['stockCode'] === this.util.searchStockCode) {
          this.util.sellCnt = element['stockCntAble'];
          return true;
        } else {
          this.util.sellCnt = '0';
        }
      });
      this.util.timeoutbuy = setTimeout(() => {
        this.getList();
      }, this.util.intervarTime);
    }, (err) => {
      this.util.isError(err.error);
    });
  }
}



