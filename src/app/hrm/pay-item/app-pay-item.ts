import { Component, OnInit, inject, AfterViewInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResponseList } from 'src/app/core/model/response-list';

import { PayItemGrid } from './pay-item-grid';

import { NgPage } from "src/app/core/app/nz-page";
import { NzPageHeaderCustom } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom';
import { NzSearchArea } from 'src/app/third-party/ng-zorro/nz-search-area/nz-search-area';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseObject } from 'src/app/core/model/response-object';

export class SystemTypeEnum {
  constructor(
    public label: string,
    public value: string) {}
}


@Component({
  selector: 'app-pay-item',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    NzInputModule,
    NzDividerModule,
    NzPageHeaderCustom,
    NzSearchArea,
    NgPage,
    PayItemGrid
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="회사 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <nz-search-area>
    <!--
    <company-seacrh
      (search)="getList($event)"
      (newForm)="newResource()"
      (deleteForm)="delete()">
    </company-seacrh>
    -->
  </nz-search-area>
</ng-template>

<ng-page [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="container">
    <div>
      <h3 class="grid-title">회사 목록 {{drawer| json}} </h3>
    </div>
    <div style="flex: 1">
      @defer {
        <pay-item-grid #grid
          (rowClicked)="resourceGridRowClicked($event)"
          (editButtonClicked)="editResource($event)"
          (rowDoubleClicked)="editResource($event)">
        </pay-item-grid>
      }
    </div>
  </div>
</ng-page>

<!--
<company-form-drawer
  [drawer]="drawer.company"
  (drawerClosed)="getList('')">
</company-form-drawer>
    -->

  `,
  styles: `
:host {
  --page-header-height: 98px;
  --page-search-height: 46px;
}

.pgm-title {
  padding-left: 5px;
  border-left: 5px solid green;
}

.btn-group {
  padding: 6px;
  /*background: #fbfbfb;*/
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding-left: auto;
  padding-right: 5;
}

.grid-wrapper {
  display: grid;
  grid-template-rows: 24px 1fr;
  grid-template-columns: 200px 1fr;
}

  `
})
export class AppPayItem implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  private http = inject(HttpClient);

  grid = viewChild.required(PayItemGrid);

  query: {
    company : { key: string, value: string, list: {label: string, value: string}[] }
  } = {
    company : {
      key: 'resourceCode',
      value: '',
      list: [
        {label: '회사코드', value: 'resourceCode'},
        {label: '회사명', value: 'resourceName'},
        {label: 'URL', value: 'url'},
        {label: '설명', value: 'description'}
      ]
    }
  }

  drawer: {
    company: { visible: boolean, formDataId: any }
  } = {
    company: { visible: false, formDataId: null }
  }

  ngOnInit(): void {
  }

  getList(params: any): void {
    this.drawer.company.visible = false;

    //this.grid().gridQuery.set(params);
  }

  newResource(): void {
    this.drawer.company.formDataId = null;
    this.drawer.company.visible = true;
  }

  editResource(item: any): void {
    this.drawer.company.formDataId = item.companyCode;
    this.drawer.company.visible = true;
  }

  delete(): void {

    const id = this.grid().getSelectedRows()[0].companyCode;

    const url = GlobalProperty.serverUrl() + `/api/system/company/${id}`;
    const options = getHttpOptions();

    this.http.delete<ResponseObject<void>>(url, options).pipe(
        //   catchError(this.handleError<ResponseObject<Company>>('delete', undefined))
        )
        .subscribe(
          (model: ResponseObject<void>) => {
            this.getList('');
          }
      )
  }

  resourceGridRowClicked(item: any): void {
    this.drawer.company.formDataId = item.companyCode;
  }
}
