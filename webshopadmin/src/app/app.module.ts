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
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    EditCategoryComponent,
    EditProductComponent,
    EditCustomerComponent,
    EditOrderComponent,
    EditBillComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }