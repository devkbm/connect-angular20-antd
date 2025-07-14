import { Component, OnInit, Input, OnChanges, SimpleChanges, inject, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
import { ButtonRendererComponent } from 'src/app/third-party/ag-grid/renderer/button-renderer.component';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { StaffFamily } from './staff-family.model';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-staff-family-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="gridResource.value()?.data ?? []"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (selectionChanged)="selectionChanged($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
    </ag-grid-angular>
  `,
  styles: []
})
export class StaffFamilyGridComponent extends AgGridCommon {

  private http = inject(HttpClient);

  staffNo = input<string>();

  rowClicked = output<StaffFamily>();
  rowDoubleClicked = output<StaffFamily>();
  editButtonClicked = output<StaffFamily>();

  columnDefs: ColDef[] = [
    {
      headerName: '',
      width: 40,
      cellStyle: {'text-align': 'center', 'padding': '0px'},
      cellRenderer: ButtonRendererComponent,
      cellRendererParams: {
        onClick: this.onEditButtonClick.bind(this),
        label: '',
        iconType: 'form'
      }
    },
    {
      headerName: 'No',
      valueGetter: 'node.rowIndex + 1',
      width: 70,
      cellStyle: {'text-align': 'center'}
    },
    { headerName: '가족관계',       field: 'familyRelationName',  width: 90 },
    { headerName: '가족명',         field: 'familyName',          width: 90 },
    { headerName: '가족주민번호',   field: 'familyRRN',           width: 150 },
    { headerName: '직업',           field: 'occupation',          width: 100 },
    { headerName: '학력',           field: 'schoolCareerType',    width: 100 },
    { headerName: '비고',           field: 'comment',             width: 200 }
  ];

  getRowId: GetRowIdFunc<StaffFamily> = (params: GetRowIdParams<StaffFamily>) => {
    return params.data.staffNo! + params.data.seq!;
  };

  gridResource = rxResource({
    params: () => this.staffNo(),
    stream: ({params}) => this.http.get<ResponseList<StaffFamily>>(
      GlobalProperty.serverUrl() + `/api/hrm/staff/${params}/family`,
      getHttpOptions(params)
    )
  })

  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<StaffFamily>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }
}
