import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  token: string;
  userName: string;
  teamCode: string;
  mainTimeOut: any;
  getListTimeOut: any;
  intervarTime = 3000;
  searchStockCode = '';
  timeoutFenshi: any;
  timeoutQoute: any;
  timeoutbuy: any;
  sellCnt = '0';
  ableScale = 0; // 可用资金
  show = true;
  hide = false;

  stockHQ = {
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
  constructor(public router: Router, private message: NzMessageService) {
    if (!this.token) {
      this.token = this.getSession('token');
    }
    if (!this.userName) {
      this.userName = this.getSession('userName');
    }
    if (!this.teamCode) {
      this.teamCode = this.getSession('teamCode');
    }
  }
  /**
  * 页面跳转
  */
  goto(url) {
    return this.router.navigate([url]);
  }
  /**
  * 判断是否为空
  */
  isNull(string) {
    // tslint:disable-next-line:max-line-length
    return (string === 'undefined' || string === '' || string === null || string === 'null' || string === undefined || string === 'NaN' || string.length === 0) ? true : false;
  }

  getHeader() {
    if (this.isNull(this.token)) {
      if (this.isNull(this.getSession('token'))) {
        this.errorMessage('请重新登录');
        this.goto('/login');
        return;
      } else {
        this.token = this.getSession('token');
        return { headers: new HttpHeaders({ 'Authorization': this.getSession('token') }) };
      }

    } else {
      return { headers: new HttpHeaders({ 'Authorization': this.token }) };
    }
  }

  resetStockHQ() {
    this.stockHQ = {
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
  }

  downloadFile(res, text) {
    if (window.URL.createObjectURL(new Blob()).indexOf(location.host) < 0) {// 判断是否为IE
      if (window.navigator.msSaveOrOpenBlob) {// IE10+方法
        const name = text + '.xls';
        const blobObject = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const result = window.navigator.msSaveOrOpenBlob(blobObject, name);
      }
    } else {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.setAttribute('href', objectUrl);
      a.setAttribute('download', text + '.xls');
      a.click();
      URL.revokeObjectURL(objectUrl);
    }
  }


  getExportHeader() {
    if (this.isNull(this.token)) {
      if (this.isNull(this.getSession('token'))) {
        this.errorMessage('请重新登录');
        this.goto('/login');
        return;
      } else {
        this.token = this.getSession('token');
        // tslint:disable-next-line:max-line-length
        return new HttpHeaders({ 'Authorization': this.getSession('token'), 'Content-Type': 'application/x-www-form-urlencoded' });
      }

    } else {
      return new HttpHeaders({ 'Authorization': this.token, 'Content-Type': 'application/x-www-form-urlencoded' });
    }
  }

  getSession(name): any {
    return sessionStorage.getItem(name);
  }
  setSession(name, data) {
    return sessionStorage.setItem(name, data);
  }

  removeSession(name) {
    return sessionStorage.removeItem(name);
  }

  getLocalStorage(name) {
    return localStorage.getItem(name);
  }

  setLocalStorage(name, data) {
    return localStorage.setItem(name, data);
  }

  /**
   * 输入出错提示
   */
  messageAlert(type, desc) {
    this.message.create(type, desc);
  }

  /**
   * 保留n位小数
   */
  roundNum(num, n): number {
    let temp = '1';
    for (let x = 1; x <= n; x++) {
      temp = temp + '0';
    }
    const i = parseInt(temp, 0);
    return Math.round(num * i) / i;
  }

  /**
   * 成功提示
   */
  successMessage(desc) {
    this.messageAlert('success', desc);
  }

  /**
   * 警告提示
   */
  warningMessage(desc) {
    this.messageAlert('warning', desc);
  }

  /**
   * 错误提示
   */
  errorMessage(desc) {
    this.messageAlert('error', desc);
  }

  /**
   * 报错处理
   */
  isError(err) {
    this.errorMessage(err.resultInfo);
    if (err.resultCode === 'token.error') {
      this.goto('/login');
    }


  }

  /**
   * 缓存用户名跟token
   */
  saveToken(userName, token, teamCode) {
    this.setSession('userName', userName);
    this.setSession('token', token);
    this.setSession('teamCode', teamCode);
    this.token = token;
    this.userName = userName;
    this.teamCode = teamCode;
  }

  formatDate(date: string) {
    return date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2);
  }

  /**
   * 清除轮询
   */
  clearTimeOut() {
    window.clearTimeout(this.timeoutFenshi);
    window.clearTimeout(this.getListTimeOut);
    window.clearTimeout(this.timeoutQoute);
  }

  clearTimeOutGetList() {
    window.clearTimeout(this.getListTimeOut);
  }
  getToken() {
    if (this.isNull(this.token)) {
      return this.getSession('token');
    } else {
      return this.token;
    }
  }
  /**
   * 四舍五入保留两位小数
   */
  round(value) {
    if (value !== '') {
      return Math.round(value * 100) / 100;
    } else {
      return '-';
    }
  }

  /**
 * 买入卖出数量向上取整
 */
  roundDown(num) {
    return parseInt((num / 100).toString(), 0) * 100;
  }

  /**
 * 判断有几位小数
 */
  Decimal(num) {
    num = num + '';
    if (num.indexOf('.') !== -1) {
      return num.split('.')[1].length;
    } else {
      return 0;
    }
  }

  /**
 * 获取当前url最后的参数
 */
  getUrl(num) {
    return window.location.hash.split('/')[num];
  }
}
