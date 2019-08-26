import { HttpService } from './http.service';
import { UtilService } from './util.service';
import { OnInit, AfterViewInit } from '@angular/core';
declare var QWebChannel: any;

export class GetList implements AfterViewInit {
    public url: string;
    public postData: any;
    public list: any;
    sortName = null;
    sortValue = null;
    listOfSearchName = [];
    searchAddress: string;
    displayData = this.list;
    noDataText = '';
    exportUrl = '';
    exportName = '';
    exportData = {};
    constructor(public util: UtilService, public http: HttpService) {

    }
    ngAfterViewInit() {
        this.getList();
    }
    getList() {
        this.util.clearTimeOutGetList();
        this.http.getList(this.url, this.postData).subscribe((res) => {
            this.list = res;
            if (!this.util.isNull(res)) {
                this.noDataText = '暂无更多数据';
            } else {
                this.noDataText = '暂无数据';
            }
            this.afterGetList();
        }, (err) => {

            this.util.isError(err.error);
        });
    }

    afterGetList() {

    }

    /**
     * 判断前端展示字体颜色
     */
    color(type) {
        switch (type) {
            case '买入':
                return 'red';
            case '买':
                return 'red';
            case '卖出':
                return 'blue';
            case '卖':
                return 'blue';
            default:
                break;
        }
    }

    sort(sort: { key: string, value: string }): void {
        this.sortName = sort.key;
        this.sortValue = sort.value;
        this.search();
    }

    search(): void {
        /** sort data **/
        const data = this.list;
        if (this.sortName && this.sortValue) {
            this.displayData = data.sort((a, b) => (this.sortValue === 'ascend') ?
                (a[this.sortName] > b[this.sortName] ? 1 : -1) : (b[this.sortName] > a[this.sortName] ? 1 : -1));
        } else {
            this.displayData = data;
        }
    }

    // 导出
    exportTable() {
        this.http.export(this.exportUrl, this.exportData).subscribe((res) => {
            console.log(res);
            this.util.downloadFile(res, this.exportName);
        }, (err) => {
            this.util.isError(err.error);
        });
    }
}
