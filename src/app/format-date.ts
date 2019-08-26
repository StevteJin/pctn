export class FormatDate {
    constructor() {

    }

    format(date, type) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const millseconds = date.getMilliseconds();
        switch (type) {
            case 'yyyyMMddhhmmss':
                return year + this.add0(month) + this.add0(day) +
                    this.add0(hour) + this.add0(minutes) + this.add0(seconds) + this.add0(millseconds);
            case 'yyyy-MM-dd':
                return year + '-' + this.add0(month) + '-' + this.add0(day);
            case 'yyyyMMss':
                return year + '' + this.add0(month) + '' + this.add0(day);
            case 'yyyy-MM':
                return year + '-' + this.add0(month);
        }
    }

    add0(num) {
        return num < 10 ? '0' + num : num;
    }
}
