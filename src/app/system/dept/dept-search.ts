import { Component, ChangeDetectionStrategy, output, signal, model, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CompanySelectService } from 'src/app/third-party/ng-zorro/company-select.service';


@Component({
  selector: 'app-dept-search',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    NzDividerModule,
    NzPopconfirmModule,
  ],
  template: `
    <div nz-row>
      <div nz-col [nzSpan]="12" style="display: flex;">

        <nz-select [(ngModel)]="companyCode" (ngModelChange)="change($event)">
          @for (option of companySelectService.list; track option) {
            <nz-option
              [nzLabel]="option.companyName"
              [nzValue]="option.companyCode">
            </nz-option>
          }
        </nz-select>
        <nz-input-group nzSearch [nzSuffix]="suffixIconSearch">
          <input type="text" [(ngModel)]="queryValue" nz-input placeholder="input search text">
        </nz-input-group>
        <ng-template #suffixIconSearch>
          <span nz-icon nzType="search"></span>
        </ng-template>
      </div>
      <div nz-col [nzSpan]="12" style="text-align: right;">
        <button nz-button (click)="btnSearchClicked()">
          <span nz-icon nzType="search"></span>조회
        </button>

        <nz-divider nzType="vertical"></nz-divider>

        <button nz-button (click)="btnNewClicked()">
          <span nz-icon nzType="form" nzTheme="outline"></span>신규
        </button>

        <nz-divider nzType="vertical"></nz-divider>

        <button nz-button nzType="primary" (click)="btnSaveClicked()">
          <span nz-icon nzType="save" nzTheme="outline"></span>저장
        </button>

        <nz-divider nzType="vertical"></nz-divider>

        <button nz-button nzDanger
          nz-popconfirm nzPopconfirmTitle="삭제하시겠습니까?"
          (nzOnConfirm)="btnDeleteClicked()" (nzOnCancel)="false">
          <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
        </button>

      </div>
    </div>
  `,
  styles: `
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeptSearchComponent {

  queryValue = signal('');
  companyCode = model<string>('001');

  companySelectService = inject(CompanySelectService);

  search = output<Object>();
  newForm = output<void>();
  saveForm = output<void>();
  deleteForm = output<void>();

  constructor() {
    this.companySelectService.getCompanyList();
  }

  change(val: any) {
    this.companyCode.set(val);
    console.log(val);

    this.btnSearchClicked();
  }

  btnSearchClicked() {
    this.search.emit({companyCode: this.companyCode()});
  }

  btnNewClicked() {
    this.newForm.emit();
  }

  btnSaveClicked() {
    this.saveForm.emit();
  }

  btnDeleteClicked() {
    this.deleteForm.emit();
  }

}
