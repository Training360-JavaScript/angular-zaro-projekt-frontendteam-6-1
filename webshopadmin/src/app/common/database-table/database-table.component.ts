import { DialogConfirmComponent, DialogData } from './../dialog-confirm/dialog-confirm.component';
import { Component, Input, ViewChild, AfterViewInit, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CrudService } from 'src/app/service/crud.service';
import { Product } from './../../model/product';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';


class CheckBoxIndeterminate {
  checked: boolean = false;
  status: 'indeterminated' | 'checked' | 'unchecked' = 'indeterminated';
}

@Component({
  selector: 'app-database-table',
  templateUrl: './database-table.component.html',
  styleUrls: ['./database-table.component.scss']
})
export class DatabaseTableComponent implements OnInit, AfterViewInit {

  deepCopyObject(obj:Object) {
    return JSON.parse( JSON.stringify( obj ) );
  };

  @Input() tableConfig: any = {};
  @Input() service: CrudService<any>;
  @Input() component: ComponentType<any>;

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();
  displayedColumnsKeys: string[];
  displayedColumnsFilterKeys: string[];
  filter: {[key:string]:any} = {};

  emptyFilter: any;

  constructor(
    public dialog: MatDialog,
    private dom: DomSanitizer ) { }

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
          (data: any, filter: string ) => {

            // const filterObj = JSON.parse(filter);
            const filterObj = this.filter;

            let result = true;

            for (const k of Object.keys(filterObj)) {

              if ( this.tableConfig.columns[k].type === 'boolean' ) {

                if ( filterObj[k].status !== 'indeterminated' ) {
                  if ( filterObj[k].checked !== data[k] ) {
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

        if ( JSON.stringify(this.filter) === '{}' ) {

          this.filter = this.deepCopyObject( data[0] );

          for (const k of Object.keys(this.filter)) {

            if ( ! this.tableConfig.columns[k] ) {
              delete this.filter[k];
              continue;
            }

            switch ( this.tableConfig.columns[k].type ) {

              case 'boolean':
                this.filter[k] = new CheckBoxIndeterminate();
                break;

              default:
                this.filter[k] = '';
            }
          }

          this.emptyFilter = this.deepCopyObject( this.filter );
        }

        this.startFilter();
      }
    );

    this.displayedColumnsKeys = Object.keys(this.tableConfig.columns);
    this.displayedColumnsFilterKeys = this.displayedColumnsKeys.map( key => `${key}--filter` );
  }

  startFilter() {
    this.dataSource.filter = JSON.stringify(this.filter);
  }

  onChange() {
    this.startFilter();
  }

  newItem(): void {
    this.tableConfig.onNew().subscribe({
      next( result : boolean ) {
        //
      }
    });
  }

  editItem( element: any ): void {
    this.tableConfig.onEdit( element ).subscribe({
      next( result : boolean ) {
        //
      }
    });
  }

  deleteItem( element: any ): void {

    let itemName = `#${element.id}`;
    if ( this.tableConfig.getItemName ) {
      itemName = this.tableConfig.getItemName( element );
    }

    const dialogData: DialogData = {
      title: `Selected item: '${itemName}'`,
      content:'Are you sure to delete?',
      options: [
        { name: 'No',  value: 'no',  color: 'primary' },
        { name: 'Yes', value: 'yes', color: 'primary' }
      ]
    }

    const dialogConfirm = this.dialog.open(
      DialogConfirmComponent,
      { data:  dialogData }
    );

    dialogConfirm.beforeClosed().subscribe( ( selectedOption: string ) => {
      if ( selectedOption === 'yes' ) {
        const obs = this.service.delete( element.id );
        obs.subscribe( {
          next: ( p: any ) => {
            this.ngOnInit();
          }
        } );
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumnsKeys, event.previousIndex, event.currentIndex);
    this.displayedColumnsFilterKeys = this.displayedColumnsKeys.map( key => `${key}--filter` );
  }

  setCheckBox( checkbox: CheckBoxIndeterminate ) {

    switch ( checkbox.status ) {
      case "indeterminated":
        checkbox.status = "checked";
        checkbox.checked = true;
        break;
      case 'checked':
        checkbox.status = 'unchecked';
        checkbox.checked = false;
        break;
      case "unchecked":
        checkbox.status = "indeterminated";
        checkbox.checked = false;
        break;
    }

    this.startFilter();
  }

  ngAfterViewInit() {
    this.ngOnInit();
  }


  clearFilter() {
    this.filter = this.deepCopyObject( this.emptyFilter );
    this.startFilter();
  }

}
