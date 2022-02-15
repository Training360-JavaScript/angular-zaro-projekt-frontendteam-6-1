import { Address } from './../model/address';
import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable()
@Pipe({
  name: 'address'
})
export class AddressPipe implements PipeTransform {

  transform(value: Address, ...args: unknown[]): unknown {
    return value.city;
  }

}
