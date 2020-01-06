import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public host = '';
  public ws = '';
  constructor(public http: HttpClient, public util: UtilService) {
    // this.host = 'http://106.14.120.212/tn/';
    this.host = 'http://47.99.195.183:8088/tn/';
    // this.host='http://47.102.151.13/tn/';
    // this.host = 'http://47.103.56.22/tn/';
    // this.host='http://47.102.84.50/tn/';
    this.ws = this.host + 'webSocket';
  }

  POST(url, data) {
    if (this.util.getHeader()) {
      return this.http.post(this.host + url, data, this.util.getHeader());
    }

  }

  getList(url, data) {
    return this.POST(url, data);
  }
  /**
   * 股票周期
   */
  heyuezhouqi() {
    return this.POST(`tn/quota/yymm`, {});
  }

  /**
 * 股票列表
 * @Param date
 */
  heyueList(date) {
    return this.POST(`tn/quota/yymm/${date}?qryName=true`, {});
  }

  login(phone, password) {
    const data = {
      username: phone,
      password: Md5.hashStr(password)
    };
    return this.http.post(this.host + 'tntg/login', data);
  }
  /**
   *  静态信息
   * @param code 股票代码
   */
  getStatic(code) {
    return this.POST(`tn/quota/static/${code}`, {});
  }
  /**
   * 获取手续费
   */
  commission() {
    return this.POST('tntg/commission', {});
  }
  /**
   * 分时图数组
   */
  fenshituList(optionCode) {
    return this.POST(`tn/quota/detail/${optionCode}`, {});
  }
  /**
 * 下单 参数 买入：BUY 卖出：SELL
 */
  order(type, data, stockType) {
    return this.POST(`tntg/appoint/${type}/${stockType}`, data);
  }

  /**
 * 模糊查询股票
 */
  searchStock(code) {
    return this.POST('tntg/stock?input=' + code, {});
  }

  userInfo() {
    return this.POST('tntg/capital', {});
  }

  /**
 * 重置交易员密码
 */
  reset(data) {
    data.oldPasswd = Md5.hashStr(data.oldPasswd);
    data.newPasswd = Md5.hashStr(data.newPasswd);
    return this.POST('tntg/pwdReset', data);
  }


  /**
 * 请求股票行情
 */
  getGPHQ(code) {
    return this.POST(`push/subsMarket/${code}?tokenP=${this.util.getToken()}`, {});
  }

  /**
 * 取消订阅
 */
  cancelSubscribe() {
    return this.POST('push/unsubsMarket', {});
  }

  /**
 * 确认撤单
 */
  chedan(code) {
    return this.POST('tntg/cancel/' + code, {});
  }

  /**
* 批量撤单
*/
  chedanAll(code) {
    return this.POST('tntg/batchCancel/' + code, {});
  }

  export(url, data) {
    this.util.getExportHeader();
    return this.http.post(this.host + url, data, { headers: this.util.getExportHeader(), responseType: 'arraybuffer' });
  }
}
