import { Component } from '@angular/core';
import { GetList } from '../get-list';
import { HttpService } from '../http.service';
import { UtilService } from '../util.service';
@Component({
  selector: 'app-appoint',
  templateUrl: './appoint.component.html',
  styleUrls: ['./appoint.component.css']
})
export class AppointComponent extends GetList {
  checked: any;
  isIng = false;
  allChecked = false;
  indeterminate = false;
  chedanList: any;
  checkList = [];
  pkOrderList = [];
  isVisible = false;

  constructor(public util: UtilService, public http: HttpService) {
    super(util, http);
    this.exportName = '委托列表';
    this.exportUrl = 'tntg/appointHis/export?ing=' + this.isIng;
    this.url = 'tntg/appointHis?ing=' + this.isIng;
    this.exportData = {};
  }

  afterGetList() {
    this.search();
    this.util.getListTimeOut = setTimeout(() => {
      this.getList();
    }, this.util.intervarTime);
  }

  checkIng() {
    this.checkList = [];
    this.allChecked = false;
    this.url = 'tntg/appointHis?ing=' + this.isIng;
    this.exportUrl = 'tntg/appointHis/export?ing=' + this.isIng;
    super.getList();
  }

  isChecked(code) {
    return this.checkList.indexOf(code) !== -1 ? true : false;
  }

  refreshStatus(code): void {
    code = code + '';
    // tslint:disable-next-line:no-unused-expression
    // 判断是否是选中状态的复选框，如果是，从数组中剔除，否，添加到数组中
    if (this.checkList.indexOf(code) >= 0) {
      this.checkList.splice(this.checkList.indexOf(code), 1);
    } else {
      this.checkList.push(code);
    }
    const allChecked = this.list.filter(value => value.ing).every(value => this.checkList.indexOf(value['pkOrder']) !== -1);
    this.allChecked = allChecked;
  }

  checkAll(value: boolean): void {
    this.checkList = [];
    if (this.allChecked) { //  全选
      this.list.forEach((element) => {
        if (element['ing'] && element['pkOrder'] !== '' && element['pkOrder'] !== null) {
          this.checkList.push(element['pkOrder']);
        }

      });
    } else {
      this.checkList = [];
    }
  }

  chedan() {
    this.isVisible = true;
  }

  handleOk(): void {
    this.submitCancle(this.checkList.toString());
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  chedanAll() {
    this.checkList = [];
    this.list.forEach((element) => {
      if (element['ing'] && element['pkOrder'] !== '' && element['pkOrder'] !== null) {
        this.checkList.push(element['pkOrder']);
      }
    });
    if (this.checkList.length !== 0) {
      this.isVisible = true;
    } else {
      this.util.warningMessage('暂无可撤委托单');
    }

  }

  submitCancle(list) {
    this.http.chedanAll(list).subscribe((res) => {
      this.util.successMessage('撤单已提交');
      this.checkList = [];
      this.allChecked = false;
      this.isVisible = false;
    }, (err) => {
      this.isVisible = false;
      this.util.isError(err.error);
    });
  }

}
