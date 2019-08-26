import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFix'
})
export class ToFixPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value !== '' && value !== '--') {
      return Math.round(value * 100) / 100;
    } else {
      return '--';
    }
  }

}
