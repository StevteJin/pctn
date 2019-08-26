import { Directive } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appNumberInput]',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(keydown)': 'onkeyup($event)'
  }
})
export class NumberInputDirective {

  constructor(public control: NgModel) {
  }

  onkeyup(event) {
    const key = event.keyCode;
    if ((key >= 96 && key <= 105) || key === 110 || key === 8 || (key >= 48 && key <= 57) || key === 190 || key === 9) {

    } else {
      event.preventDefault();
    }
  }

}
