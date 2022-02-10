import { Category } from './../../model/category';
import { CategoryService } from './../../service/category.service';
import { Router } from '@angular/router';
import { ProductService } from './../../service/product.service';
import { Product } from './../../model/product';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

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
      name: { name: 'Name'},
      type: { name: 'Type' },
      catID: {
        name: 'Category',
        value: ( catID: number ) => {
          const find = this.categoryList.find( (category:Category) => category.id === catID );
          return find?.name ?? '';
        }
      },
      buttons: { name: '' }
    },

    onDelete( product: Product ): Observable<boolean> {
      return new Observable(
        subscriber => {
          setTimeout(
            () => {
              subscriber.next( Math.random() < 0.5 );
              subscriber.complete();
            }, 1000
          );
        }
      );
    },

    onEdit: ( product: Product ): Observable<boolean> => {
      this.router.navigate( [ '/product', product.id ] );
      return new Observable();
     }
  };

  categoryList: Category[] = [];

  constructor(
    public customService: ProductService,
    public categoryService: CategoryService,
    private router: Router
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
