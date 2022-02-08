import { Product } from './../model/product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends CrudService<Product> {

  constructor(
    http: HttpClient
  ) {
    super(http, 'product');
   }
}
