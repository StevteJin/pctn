import { Component, OnInit } from '@angular/core';
import { UtilService } from '../util.service';
import { HttpService } from '../http.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  constructor(public util: UtilService, public http: HttpService) {
  }

  ngOnInit() {
    this.util.clearTimeOut();
  }

  login() {
    if (!this.username) {
      this.util.warningMessage('请输入用户名');
    } else if (!this.password) {
      this.util.warningMessage('请输入用户密码');
    } else {
      this.http.login(this.username, this.password).subscribe((res) => {
        this.util.successMessage('登录成功');
        this.util.searchStockCode = '';
        this.util.sellCnt = '';
        this.util.saveToken(this.username, res['resultInfo'].token, res['teamCode']);
        // this.util.saveToken(this.username, res['resultInfo'],'null');
        this.util.goto('main');
      }, (err) => {
        this.util.isError(err.error);
      });
    }
  }

}
