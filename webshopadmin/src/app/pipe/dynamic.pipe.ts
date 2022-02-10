import { Pipe, PipeTransform } from '@angular/core';
import { AddressPipe } from './address.pipe';
import { UpperCasePipe } from '@angular/common';

@Pipe({
  name: 'dynamic'
})
export class DynamicPipe implements PipeTransform {

  public constructor() {
  }

  pipes: { [name:string]: PipeTransform } = {
    address: new AddressPipe,
    upperCase: new UpperCasePipe,
  }

  transform(value: any, pipeToken: any = null, pipeArgs: any[] = []): any {
      if (!pipeToken) {
          return value;
      }
      else {
        if (this.pipes[pipeToken]) {
          return this.pipes[pipeToken].transform(value, ...pipeArgs);
        }
      }
      return value;
    }

}
