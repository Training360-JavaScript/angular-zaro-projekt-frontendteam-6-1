import { Observable } from 'rxjs';
import { CategoryService } from './../../service/category.service';
import { Category } from './../../model/category';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent implements OnInit {


  table: any = {

    title: 'Categories',

    columns: {
      id: { name: '#' },
      name: { name: 'Name' },
      description: { name: 'Description' },
      buttons: { name: '' }
    },

    onEdit: ( category: Category ): Observable<boolean> => {
      return new Observable(
        subscriber => {
          this.router.navigate( [ '/category', category.id ] );
          subscriber.next();
          subscriber.complete();
        }
      );
    },

    onNew: (): Observable<boolean> => {
      return new Observable(
        subscriber => {
          this.router.navigate( [ '/category', 0 ] );
          subscriber.next();
          subscriber.complete();
        }
      );
    },

  };

  constructor(
    public customService: CategoryService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }



}
