import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import { SelectionModel } from '@angular/cdk/collections';
import { MOCK_DATA_TYPES } from '../mocks/mock-data-types';
import { MOCK_DATA } from '../mocks/mock-data';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatPaginator,
  MatSort,
  MatTableDataSource
} from '@angular/material';

import { Displayable } from '../model/displayable';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent implements OnInit {

  dropdownFilter = new FormControl();
  tableFilter = new FormControl();

  dataTypes: Displayable[] = MOCK_DATA_TYPES;
  allData = MOCK_DATA;

  selection = new SelectionModel<any>(true, []);

  public allColumns: string[];
  public dataColumns: any[];

  public tableDataSource: MatTableDataSource<any[]>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  /**
   * Load reference data to be displayed on the table based on the selected Refernce Data Type (ID).
   * @param id a Reference Data Type ID to filter for.
   */
  showTableByType(type: Displayable) {

    if (type) {

      // Identity data columns:
      this.dataColumns = type.columns;

      console.log(this.dataColumns);

      // create all columns for table (adding first column for checkboxes and last columns for action buttons):
      this.allColumns = ['select', ...this.dataColumns, 'actions'];

      // Prepare table data source:
      const tableDataSource = this.allData[type.id];
      this.tableDataSource = new MatTableDataSource(tableDataSource);
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;

      this.clearTableFilter();
    }
  }

  /**
   * Applies a global filter on the table data by the given keyword.
   * @param keyword to filter for.
   */
  applyTableFilter(keyword: string) {
    this.tableDataSource.filter = keyword.trim().toLowerCase();

    if (this.tableDataSource.paginator) {
      this.tableDataSource.paginator.firstPage();
    }
  }

  /**
   * Clears Table filter.
   */
  clearTableFilter() {
    this.tableFilter.setValue('');
    this.applyTableFilter('');
  }

  /**
   * Delete selected rows.
   */
  deleteRows(): void {

    const ids = this.selection.selected.map(obj => obj.id);
    const newTableDataSource = this.tableDataSource.data.filter(
      obj => ids.indexOf(obj['id']) === -1
    );

    this.tableDataSource.data = newTableDataSource;
    this.selection.clear();
  }

  /**
   * Delete selected row.
   * @param row to be deleted.
   */
  deleteRow(row): void {

    const newTableDataSource = this.tableDataSource.data.filter(
      obj => row['id'] !== obj['id']
    );
    this.tableDataSource.data = newTableDataSource;
    this.selection.clear();
  }

  /**
   * Opens modal form to edit selected table row and handle changes.
   * @param row to be updated.
   */
  editRow(row): void {
    const dialogRef = this.dialog.open(ModalFormComponent, {
      width: '50%',
      data: {
        type: this.dropdownFilter.value.id,
        row: row
      }
    });

    dialogRef.afterClosed().subscribe(updatedRow => {
      if (updatedRow) {
        this._updateRow(updatedRow);
      }
    });
  }

  /**
   * Opens modal form to add a new data row.
   * @param row if not specified then the new row will be added as first data row in the table.
   *   If row is specified then the new row wll be added below this one.
   */
  insertRow(row?: any) {

    const emptyObj = {};
    this.dataColumns.forEach(field => {
      emptyObj[field] = '';
    });

    const dialogRef = this.dialog.open(ModalFormComponent, {
      width: '50%',
      data: {
        type: this.dropdownFilter.value.id,
        row: emptyObj
      }
    });

    dialogRef.afterClosed().subscribe(newRow => {
      if (newRow) {
        this._insertRow(newRow, row);
      }
    });
  }

  /**
   * Adds new row into the table data source.
   * @param newRow New data row.
   * @param selectedRow if not specified then the new row will be added as first data row in the table.
   *   If row is specified then the new row wll be added below this one.
   */
  private _insertRow(newRow: any, selectedRow?: any): any {
    const newTableDataSource = [];
    if (selectedRow) {
      this.tableDataSource.data.forEach(row => {
        newTableDataSource.push(row);
        if (row['id'] === selectedRow['id']) {
          // ad new row just after the selected row:
          newTableDataSource.push(newRow);
        }
      });
    } else {
      // add new row at the begining of the data source array:
      newTableDataSource.push(newRow, ...this.tableDataSource.data);
    }
    this.tableDataSource.data = newTableDataSource;
  }

  /**
   * Performes the update of the given row in the table data source.
   * @param updatedRow existing row with new values (excluding ID).
   */
  private _updateRow(updatedRow: any): any {
    const newTableDataSource = [];
    this.tableDataSource.data.forEach(row => {
      newTableDataSource.push(row['id'] === updatedRow['id'] ? updatedRow : row);
    });
    this.tableDataSource.data = newTableDataSource;
  }

  /**
   * Whether the number of selected elements matches the total number of rows.
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableDataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.tableDataSource.data.forEach(row => this.selection.select(row));
  }
}

/**
 * A Modal form to add or edit records.
 */
@Component({
  selector: 'app-modal-form',
  templateUrl: 'modal-form.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class ModalFormComponent implements OnInit {

  fieldNames: string[];
  form: FormGroup;
  type;
  id;
  fieldSize: object = {};

  constructor(
    public dialogRef: MatDialogRef<ModalFormComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.buildForm();
  }

  /**
   * Builds dynamic Form to be displayed in the modal dialog.
   */
  buildForm() {

    this.type = this.data.type;
    this.id = this.data.row['id'];

    this.fieldNames = Object.keys(this.data.row);

    this.form = this.formBuilder.group({});
    this.fieldNames.forEach(field => {

      const value = this.data.row[field];
      this._setFieldSize(field, value);

      this.form.addControl(field, this.formBuilder.control(value, []));
    });
    console.log(JSON.stringify(this.fieldSize));
  }

  private _setFieldSize(field, value) {
    this.fieldSize[field] = value && value.length > 15 ? 'fld-size-lg' : 'fld-size-sm';
  }

  /**
   * Returns form values to main screen/component.
   *
   * Alternatively, replace (click)="onSave()" with [mat-dialog-close]="form.value"
   * and remove this method.
   */
  onSave(): void {
    this.dialogRef.close(this.form.value);
  }

  /**
   * Closes modal form without returning any data change.
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}
