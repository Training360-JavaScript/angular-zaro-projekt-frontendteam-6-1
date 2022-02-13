import { ComponentType } from '@angular/cdk/portal';
import { EditProductComponent } from './../edit-product/edit-product.component';
import { Category } from './../../model/category';
import { CategoryService } from './../../service/category.service';
import { Router } from '@angular/router';
import { ProductService } from './../../service/product.service';
import { Product } from './../../model/product';
import { Observable } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {

  table: any = {

    title: 'Products',

    columns: {
      id: { name: '#' },
      active: { name: 'Active', type: 'boolean' },
      name: { name: 'Name'},
      type: { name: 'Type' },
      catID: {
        name: 'Category',
        value: ( catID: number ) => {
          const find = this.categoryList.find( (category:Category) => category.id === catID );
          return find?.name ?? '';
        }
      },
      featured: { name: 'Featured', type: 'boolean' },
      buttons: { name: '' },
    },

    onEdit: ( product: Product ): Observable<boolean> => {
      return new Observable(
        subscriber => {
          this.router.navigate( [ '/product', product.id ] );
          subscriber.next();
          subscriber.complete();
        }
      );
    },

    onNew: (): Observable<boolean> => {
      return new Observable(
        subscriber => {
          this.router.navigate( [ '/product', 0 ] );
          subscriber.next();
          subscriber.complete();
        }
      );
    },

    getItemName( product: Product ) {
      return `#${product.id} ${product.name}`;
    }
  };

  categoryList: Category[] = [];
  customComponent: ComponentType<any> = EditProductComponent;

  constructor(
    public customService: ProductService,
    public categoryService: CategoryService,
    public router: Router,
  ) {
    categoryService.getAll().subscribe( {
      next: ( categories: Category[] | null ) => {
        if ( categories !== null ) {
          this.categoryList = categories;
          customService.getAll();
        }
      }
    });
  }

  ngOnInit(): void {
  }


}


