import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { DynamicTableComponent, ModalFormComponent } from './dynamic-table/dynamic-table.component';

@NgModule({
  declarations: [
    AppComponent,
    DynamicTableComponent,
    ModalFormComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CdkTableModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    NgSelectModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    ModalFormComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
