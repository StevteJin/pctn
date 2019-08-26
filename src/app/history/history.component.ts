import { Component } from '@angular/core';
import { GetList } from '../get-list';
import { HttpService } from '../http.service';
import { UtilService } from '../util.service';
import { FormatDate } from '../format-date';
import { element } from 'protractor';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent extends GetList {
  selectedValue: string;
  dateRange: any;
  sDate: string;
  eDate: string;
  formatDate: FormatDate;
  constructor(public util: UtilService, public http: HttpService) {
    super(util, http);
    this.dateRange = new Date();
    this.formatDate = new FormatDate();
    this.sDate = this.formatDate.format(new Date(), 'yyyyMMss');
    this.selectedValue = '1';
    this.url = 'tn/history/appoint';
    this.postData = {
      'beginTime': this.sDate,
      'endTime': this.sDate,
      'accountCode': this.util.userName
    };
    this.exportName = '历史委托';
    this.exportUrl = 'tn/history/appoint/export?isTG=true';
    this.exportData = `beginTime=${this.sDate}&endTime=${this.sDate}&accountCode=${this.util.userName}`;
  }

  search() {
    this.sDate = this.formatDate.format(this.dateRange, 'yyyyMMss');
    this.postData = {
      'beginTime': this.sDate,
      'endTime': this.sDate,
      'accountCode': this.util.userName
    };
    this.exportData = `beginTime=${this.sDate}&endTime=${this.sDate}&accountCode=${this.util.userName}`;
    super.getList();
  }

  afterGetList() {
    // tslint:disable-next-line:no-shadowed-variable
    this.list.forEach(element => {
      if (this.selectedValue === '2') {
        element.dealDate = this.util.formatDate(element.dealDate);
      } else {
        element.orderDate = this.util.formatDate(element.orderDate);
      }

    });
  }

  provinceChange() {
    switch (this.selectedValue) {
      case '1':
        this.url = 'tn/history/appoint';
        this.exportName = '历史委托';
        this.exportUrl = 'tn/history/appoint/export?isTG=true';
        break;
      case '2':
        this.url = 'tn/history/trade';
        this.exportName = '历史成交';
        this.exportUrl = 'tn/history/trade/export?isTG=true';
        break;
      case '3':
        this.url = 'tn/history/statement';
        this.exportName = '对账单';
        this.exportUrl = 'tn/history/statement/export?isTG=true';
        break;
    }
    this.exportData = `beginTime=${this.sDate}&endTime=${this.sDate}&accountCode=${this.util.userName}`;
    this.search();
  }

}
