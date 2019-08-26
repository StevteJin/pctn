import { Component } from '@angular/core';
import { GetList } from '../get-list';
import { HttpService } from '../http.service';
import { UtilService } from '../util.service';
@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent extends GetList {
  constructor(public util: UtilService, public http: HttpService) {
    super(util, http);
    this.url = 'tn/today/trade';
    this.postData = {
      'teamCode': this.util.teamCode,
      'accountCode': this.util.userName
    };
    this.exportName = '成交列表';
    this.exportUrl = 'tn/today/trade/export?isTG=true';
    this.exportData = `teamCode=${this.util.teamCode}&accountCode=${this.util.userName}`;
  }


  afterGetList() {

    this.search();
    this.util.getListTimeOut = setTimeout(() => {
      this.getList();
    }, this.util.intervarTime);
  }
}
