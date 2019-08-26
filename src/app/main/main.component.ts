import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, DoCheck } from '@angular/core';
import { UtilService } from '../util.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, DoCheck {
  userInfo = {
    allottedScale: '',
    totalScale: '',
    stockScale: '',
    ableScale: 0,
    lockScale: '',
    freezeScale: ''
  };
  triggerTemplate: any;
  url = '';
  isCollapsed = false;
  isVisible = false;
  oldPass = '';
  newPass = '';
  newPass2 = '';
  userName = '';
  freezaFee: any;
  constructor(public util: UtilService, public http: HttpService) {
    this.userName = this.util.userName;
  }

  handleOk(): void {

    if (!this.oldPass) {
      this.util.warningMessage('请输入旧密码');
    } else if (!this.newPass || this.newPass.length < 4) {
      this.util.warningMessage('新密码长度不能小于4位，修改失败');
    } else if (this.newPass2 !== this.newPass) {
      this.util.warningMessage('两次新密码输入不一致，修改失败');
    } else {
      const data = {
        oldPasswd: this.oldPass,
        newPasswd: this.newPass
      };
      this.http.reset(data).subscribe((res) => {
        this.isVisible = false;
        this.util.successMessage('修改成功，请重新登录');
        this.util.goto('/login');
      }, (err) => {
        this.util.isError(err.error);
      });
    }

  }

  handleCancel(): void {
    this.isVisible = false;
  }

  reset() {
    this.isVisible = true;
  }

  logout() {
    this.util.setSession('token', '');
    this.cancelSubscribe();
    this.util.clearTimeOut();
    this.util.goto('/login');
  }

  ngOnInit() {
    this.util.clearTimeOut();
    this.getUserInfo();
    this.url = this.util.getUrl(2);
  }

  ngDoCheck() {
    if (this.util.getUrl(2) !== this.url) {
      this.url = this.util.getUrl(2);
    }
  }

  goto(url) {
    this.util.searchStockCode = '';
    this.util.sellCnt = '';
    this.cancelSubscribe();
    this.util.clearTimeOut();
    window.clearTimeout(this.util.timeoutbuy);
    this.util.goto('/main/' + url);
  }
  /**
* 取消订阅
*/
  cancelSubscribe() {
    this.http.cancelSubscribe().subscribe((res) => {
      console.log('取消订阅');
    });
  }

  getUserInfo() {
    this.http.userInfo().subscribe((res) => {
      Object.assign(this.userInfo, res);
      this.util.ableScale = this.userInfo.ableScale;
      this.freezaFee = parseFloat(this.userInfo.lockScale) + parseFloat(this.userInfo.freezeScale);
      this.util.mainTimeOut = setTimeout(() => {
        this.getUserInfo();
      }, this.util.intervarTime);
    });
  }

}
