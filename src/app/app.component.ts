import { Component, DoCheck } from '@angular/core';
import { UtilService } from './util.service';
import { HttpService } from './http.service';
import * as SockJS from 'sockjs-client';
import { over } from '@stomp/stompjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  title = 'pctg';
  stompClient: any;
  isConnect = false;

  constructor(public data: UtilService, public http: HttpService) {

  }
  /**
 * 取消订阅
 */
  cancelSubscribe() {
    this.http.cancelSubscribe().subscribe((res) => {
      console.log('取消订阅');
    });
  }
  /**
      * 断开连接
      */
  disconnect() {
    this.stompClient.disconnect((() => {
      console.log('断开链接');
    }));
  }
  /**
   * 连接ws
   */
  connect() {
    console.log('发起ws请求');
    const that = this;
    const socket = new SockJS(this.http.ws);
    const headers = { token: this.data.getToken() };
    this.stompClient = over(socket);
    this.stompClient.connect(headers, function (frame) {
      that.stompClient.subscribe('/user/' + that.data.getToken() + '/topic/market', function (res) {
        const data = JSON.parse(res.body);
      if (that.data.searchStockCode === data.stockCode) {
        that.data.stockHQ = data;
      }
      });
    }, function (err) {
      console.log('err', err);
    });
  }
  ngDoCheck() {
    if (!this.data.isNull(this.data.getToken())) {
      if (!this.isConnect) {
        this.connect();
        this.isConnect = !this.isConnect;
      }
    } else {
      if (this.isConnect) {
        this.isConnect = !this.isConnect;
        this.disconnect();
      }

    }
  }
}
