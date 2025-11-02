import { Component, OnInit, inject, AfterViewInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgPage } from "src/app/core/app/nz-page";

import { CommonCodeForm } from './common-code-form';
import { CommonCodeTree } from './common-code-tree';
import { CommonCodeSeacrh } from "./common-code-search";

import { NzPageHeaderCustom } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';

export class SystemTypeEnum {
  constructor(
    public label: string,
    public value: string) {}
}

@Component({
  selector: 'common-code-app',
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
    NzSpaceModule,
    CommonCodeTree,
    CommonCodeForm,
    NgPage,
    CommonCodeSeacrh
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="공통코드 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <common-code-search
    (search)="getCommonCodeTree()"
    (newForm)="newForm()"
    (saveForm)="saveCommonCode()"
    (deleteForm)="deleteCommonCode()"
  >
  </common-code-search>
</ng-template>

<ng-page [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="container">
    <div>
      <h3 class="pgm-title">공통코드 목록</h3>
    </div>

    <div class="grid-wrapper">
      <common-code-tree #commonCodeTree
        [searchValue]="queryValue"
        (itemSelected)="selectedItem($event)">
      </common-code-tree>

      <common-code-form #commonCodeForm
        (formSaved)="getCommonCodeTree()"
        (formDeleted)="getCommonCodeTree()">
      </common-code-form>
    </div>
  </div>
</ng-page>
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
export class CommonCodeApp implements OnInit, AfterViewInit {

  tree = viewChild.required(CommonCodeTree);
  form = viewChild.required(CommonCodeForm);

  systemTypeCodeList: SystemTypeEnum[] = [];

  systeTypeCode = 'COM';
  queryValue = '';
  selectedCode = '';

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.getCommonCodeTree();
  }

  getCommonCodeTree(): void {
    this.tree().getCommonCodeHierarchy(this.systeTypeCode);
    this.form().getCommonCodeHierarchy(this.systeTypeCode);
    this.selectedCode = '';
  }

  newForm(): void {
    this.form().newForm(this.systeTypeCode, this.selectedCode);
  }

  saveCommonCode(): void {
    this.form().save();
  }

  deleteCommonCode(): void {
    this.form().remove();
  }

  selectedItem(item: any): void {
    this.selectedCode = item.id;
    this.form().get(item.systemTypeCode, item.id);
  }

}
