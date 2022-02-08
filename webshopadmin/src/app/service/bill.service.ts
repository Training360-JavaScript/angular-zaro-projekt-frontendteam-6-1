import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill } from '../model/bill';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class BillService extends CrudService<Bill> {

  constructor(
    http: HttpClient
  ) {
    super(http, 'bill');
   }
}
