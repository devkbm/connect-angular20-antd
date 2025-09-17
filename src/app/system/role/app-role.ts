import { AfterViewInit, Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResponseObject } from 'src/app/core/model/response-object';
import { NgPage } from "src/app/core/app/nz-page";

import { RoleGrid } from './role-grid';
import { RoleFormDrawer } from './role-form-drawer';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPageHeaderCustom } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom';

import { NzSearchArea } from 'src/app/third-party/ng-zorro/nz-search-area/nz-search-area';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { HttpClient } from '@angular/common/http';
import { RoleList } from './role-list';

export interface Role {
  roleCode: string | null;
  roleName: string | null;
  description: string | null;
  menuGroupCode: string | null;
}


@Component({
  selector: 'app-role',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzGridModule,
    NzSelectModule,
    NzInputModule,
    NzDividerModule,
    NzPageHeaderCustom,
    NzSearchArea,
    RoleGrid,
    RoleFormDrawer,
    NgPage,
    RoleList
],
  template: `
<ng-template #header>
  <nz-page-header-custom class="page-header" title="롤 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <nz-search-area>
    <div nz-row>
      <div nz-col [nzSpan]="12">
        <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate" [nzSuffix]="suffixIconSearch">
          <ng-template #addOnBeforeTemplate>
            <nz-select [(ngModel)]="query.role.key">
              @for (option of query.role.list; track option.value) {
              <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
              }
            </nz-select>
          </ng-template>
          <input type="text" [(ngModel)]="query.role.value" nz-input placeholder="input search text" (keyup.enter)="getRoleList()">
          <ng-template #suffixIconSearch>
            <span nz-icon nzType="search"></span>
          </ng-template>
        </nz-input-group>
      </div>

      <div nz-col [nzSpan]="12" style="text-align: right;">
        <button nz-button (click)="getRoleList()">
          <span nz-icon nzType="search"></span>조회
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button nz-button (click)="initForm()">
          <span nz-icon nzType="form" nzTheme="outline"></span>신규
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button nz-button nzDanger="true"
          nz-popconfirm nzPopconfirmTitle="삭제하시겠습니까?"
          (nzOnConfirm)="delete()" (nzOnCancel)="false">
            <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
        </button>
      </div>
    </div>
  </nz-search-area>
</ng-template>

<ng-page [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="container">
    <div>
      <h3 class="grid-title">롤 목록</h3>
    </div>

    <div style="flex: 1">
      @defer {
        @if (view === 'grid') {
          <role-grid #authGrid
            (rowClicked)="selectedItem($event)"
            (editButtonClicked)="editDrawOpen($event)"
            (rowDoubleClicked)="editDrawOpen($event)">
          </role-grid>
        }
        @else if (view === 'list') {
          <role-list (editButtonClicked)="editDrawOpen($event)">
          </role-list>
        }
      }
    </div>
  </div>
</ng-page>

<role-form-drawer
  [drawer]="drawer.role"
  (drawerClosed)="getRoleList()">
</role-form-drawer>

  `,
  styles: `
:host {
  --page-header-height: 98px;
  --page-search-height: 46px;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.grid-title {
  margin-top: var(--page-content-title-margin-height);
  margin-left: 6px;
  border-left: 6px solid green;
  padding-left: 6px;
  vertical-align: text-top;
}

[nz-button] {
  margin: auto;
}
  `
})
export class RoleApp implements AfterViewInit {

  private http = inject(HttpClient);

  grid = viewChild.required(RoleGrid);
  list = viewChild.required(RoleList);

  view: 'grid' | 'list' = 'list';

  query: {
    role : { key: string, value: string, list: {label: string, value: string}[] }
  } = {
    role : {
      key: 'roleCode',
      value: '',
      list: [
        {label: '롤', value: 'roleCode'},
        {label: '설명', value: 'description'}
      ]
    }
  }

  drawer: {
    role: { visible: boolean, formDataId: any }
  } = {
    role: { visible: false, formDataId: null }
  }

  ngAfterViewInit(): void {
  }

  openDrawer() {
    this.drawer.role.visible = true;
  }

  closeDrawer() {
    this.drawer.role.visible = false;
  }

  selectedItem(data: any) {
    if (data) {
      this.drawer.role.formDataId = data.roleCode;
    } else {
      this.drawer.role.formDataId = null;
    }
  }

  initForm() {
    this.drawer.role.formDataId = null;

    this.openDrawer();
  }

  editDrawOpen(item: any) {
    this.drawer.role.formDataId = item.roleCode;

    this.openDrawer();
  }

  getRoleList() {
    let params: any = new Object();
    if ( this.query.role.value !== '') {
      params[this.query.role.key] = this.query.role.value;
    }

    this.closeDrawer();
    this.grid().gridQuery.set(params);
  }

  delete() {
    const id = this.grid().getSelectedRows()[0].roleCode;
    const url = GlobalProperty.serverUrl() + `/api/system/role/${id}`;
    const options = getHttpOptions();

    this.http
        .delete<ResponseObject<Role>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseObject<Role>) => {
            this.getRoleList();
          }
        )
  }

}
