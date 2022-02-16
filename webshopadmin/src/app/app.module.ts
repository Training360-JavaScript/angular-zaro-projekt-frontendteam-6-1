import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { EditCategoryComponent } from './common/edit-category/edit-category.component';
import { EditProductComponent } from './common/edit-product/edit-product.component';
import { EditCustomerComponent } from './common/edit-customer/edit-customer.component';
import { EditOrderComponent } from './common/edit-order/edit-order.component';
import { EditBillComponent } from './common/edit-bill/edit-bill.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './common/header/header.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { DatabaseTableComponent } from './common/database-table/database-table.component';
import { ListProductComponent } from './common/list-product/list-product.component';
import { ListBillComponent } from './common/list-bill/list-bill.component';
import { ListCategoryComponent } from './common/list-category/list-category.component';
import { ListCustomerComponent } from './common/list-customer/list-customer.component';
import { ListOrderComponent } from './common/list-order/list-order.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';
import { DynamicPipe } from './pipe/dynamic.pipe';
import { AddressPipe } from './pipe/address.pipe';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AutocompleteComponent } from './common/autocomplete/autocomplete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogComponent } from './common/dialog/dialog.component';
import { PortalModule } from '@angular/cdk/portal';
import { DialogConfirmComponent } from './common/dialog-confirm/dialog-confirm.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ToastrModule } from 'ngx-toastr';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@NgModule({
  declarations: [
    AppComponent,
    EditCategoryComponent,
    EditProductComponent,
    EditCustomerComponent,
    EditOrderComponent,
    EditBillComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    DatabaseTableComponent,
    ListProductComponent,
    ListBillComponent,
    ListCategoryComponent,
    ListCustomerComponent,
    ListOrderComponent,
    DynamicPipe,
    AddressPipe,
    AutocompleteComponent,
    DialogComponent,
    DialogConfirmComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,

    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    DragDropModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatAutocompleteModule,
    MatInputModule,
    PortalModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }), // ToastrModule added
    NgxEchartsModule.forRoot({
      /**
       * This will import all modules from echarts.
       * If you only need custom modules,
       * please refer to [Custom Build] section.
       */
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
