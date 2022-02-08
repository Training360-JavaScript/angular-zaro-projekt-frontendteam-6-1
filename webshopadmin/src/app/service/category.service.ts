import { HttpClient } from '@angular/common/http';
import { Category } from './../model/category';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends CrudService<Category> {

  constructor(
    http: HttpClient
  ) {
    super(http, 'category');
   }
}
