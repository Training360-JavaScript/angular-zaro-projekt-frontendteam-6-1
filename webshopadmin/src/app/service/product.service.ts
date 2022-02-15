import { Category } from './../model/category';
import { CategoryService } from './category.service';
import { Product } from './../model/product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { mergeMap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends CrudService<Product> {

  constructor(
    http: HttpClient,
    private cs: CategoryService
  ) {
    super(http, 'product');
  }

  override createInstanceOfT() { return new Product(); }

  getCategory(product: Product): Observable<Category> {
    return this.cs.get(product.catID);
  }

  getCategoryAsync(product$: Observable<Product>): Observable<Category> {
    return product$.pipe(mergeMap(product => this.cs.get(product.catID)));
  }

}
