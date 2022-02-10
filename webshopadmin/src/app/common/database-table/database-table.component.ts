import { Component, Input, ViewChild, AfterViewInit, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CrudService } from 'src/app/service/crud.service';
import { Product } from './../../model/product';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

interface ICheckBoxIndeterminate {
  checked: boolean;
  status: 'indeterminated' | 'checked' | 'unchecked';
}

@Component({
  selector: 'app-database-table',
  templateUrl: './database-table.component.html',
  styleUrls: ['./database-table.component.scss']
})
export class DatabaseTableComponent implements OnInit, AfterViewInit {


  @Input() tableConfig: any = {};
  @Input() service: CrudService<any>;

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();
  displayedColumnsKeys: string[];
  displayedColumnsFilterKeys: string[];
  filter: {[key:string]:any} = {};

  constructor() { }

  ngOnInit(): void {

    this.service.getAll().subscribe(
      ( data: any[] ) => {

        if ( !data || data.length === 0 ) return;

        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.sortingDataAccessor = (item:{[key:string]:any}, property) => {
          if ( this.tableConfig.columns[property].value )
            return this.tableConfig.columns[property].value( item[property] );
          return item[property];
        };
        this.dataSource.sort = this.sort;

        this.dataSource.paginator = this.paginator;

        this.dataSource.filterPredicate =
          (data: any, filter: string) => {

            // const filterObj = JSON.parse(filter);
            const filterObj = this.filter;

            let result = true;

            for (const k of Object.keys(filterObj)) {

              if ( this.tableConfig.columns[k].type === 'boolean' ) {
                if ( filterObj[k].status !== 'indeterminated' ) {
                  if ( filterObj[k].value !== data[k] ) {
                    result = false;
                    break;
                  }
                }
                continue;
              }

              let value =
                  this.tableConfig.columns[k].value
                ?
                  this.tableConfig.columns[k].value( data[k] )
                :
                  data[k];

              if ( filterObj[k] ) {
                if ( typeof filterObj[k] === 'number' ) {
                  if ( value !== filterObj[k] ) {
                    result = false;
                    break;
                  }
                } else if ( ! (String(value).toLowerCase()).includes( (filterObj[k] as string).toLowerCase() ) ) {
                  result = false;
                  break;
                }
              }
            }
            return result;
          }

        this.filter = JSON.parse( JSON.stringify( data[0] ) );

        for (const k of Object.keys(this.filter)) {

          if ( ! this.tableConfig.columns[k] ) {
            delete this.filter[k];
            continue;
          }

          switch ( this.tableConfig.columns[k].type ) {
            case 'boolean':
              this.filter[k] = {
                checkbox: false,
                status: 'indeterminated'
              }
              break;

            default:
              this.filter[k] = '';
          }
        }

        console.log(this.filter);

        this.dataSource.filter = JSON.stringify(this.filter);
      }
    );

    this.displayedColumnsKeys = Object.keys(this.tableConfig.columns); // this.tableConfig.columns.map((x:any):string => { return x.key; } );
    this.displayedColumnsFilterKeys = this.displayedColumnsKeys.map( key => `${key}--filter` );

    console.log(this.displayedColumnsKeys);

  }

  onChange() {
    this.dataSource.filter = JSON.stringify(this.filter);
  }

  edit( element: any ) {
    this.tableConfig.onEdit( element ).subscribe({
      next( result : boolean ) {
        alert( result );
      }
    });
  }

  delete( element: any ) {
    this.tableConfig.onDelete(element).subscribe({
      next( result : boolean ) {
        alert( result );
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumnsKeys, event.previousIndex, event.currentIndex);
    this.displayedColumnsFilterKeys = this.displayedColumnsKeys.map( key => `${key}--filter` );
  }

  setCheckBox( checkbox: ICheckBoxIndeterminate ) {
    switch (checkbox.status) {
      case 'checked':
        checkbox.status = 'unchecked';
        checkbox.checked = false;
        break;
      case "unchecked":
        checkbox.status = "indeterminated";
        break;
      case "indeterminated": {
        checkbox.status = "checked";
        checkbox.checked = true;
        break;
      }
    }
    console.log(checkbox);
    this.onChange();
  }

  ngAfterViewInit() {
    this.ngOnInit();
  }

}
