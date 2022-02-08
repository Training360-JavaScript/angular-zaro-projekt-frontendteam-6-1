import { Order } from './../model/order';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends CrudService<Order> {

  constructor(
    http: HttpClient
  ) {
    super(http, 'order');
   }
}
