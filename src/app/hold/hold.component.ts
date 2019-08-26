import { Component } from '@angular/core';
import { GetList } from '../get-list';
import { HttpService } from '../http.service';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-hold',
  templateUrl: './hold.component.html',
  styleUrls: ['./hold.component.css']
})
export class HoldComponent extends GetList {
  constructor(public util: UtilService, public http: HttpService) {
    super(util, http);
    this.url = 'tntg/hold';
    this.exportName = '持仓列表';
    this.exportUrl = 'tntg/hold/export';
    this.exportData = {};
  }

  afterGetList() {
    this.list.some(element => {
      if (element['stockCode'] === this.util.searchStockCode) {
        this.util.sellCnt = element['stockCntAble'];
        return true;
      } else {
        this.util.sellCnt = '0';
      }
    });
    this.search();
    this.util.getListTimeOut = setTimeout(() => {
      this.getList();
    }, this.util.intervarTime);
  }

  select(data) {
    this.util.searchStockCode = data.stockCode;
    this.util.sellCnt = data.stockCntAble;
  }
}
