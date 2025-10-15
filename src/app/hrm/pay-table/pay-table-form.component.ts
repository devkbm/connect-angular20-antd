import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseObject } from 'src/app/core/model/response-object';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { HrmCode, HrmCodeService } from '../shared/hrm-code.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseMap } from 'src/app/core/model/response-map';

export interface PayTable {
  id: string | null;
  companyCode: string | null;
  payItemCode: string | null;
  effectiveDate: Date | null;
  occupationCode: string | null;
  jobGradeCode: string | null;
  payStepCode: string | null;
  wageAmount: number | null;
  isEnable: boolean | null;
  comment: string | null;
}

@Component({
  selector: 'app-pay-table-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzDatePickerModule,
    NzInputNumberModule,
  ],
  template: `
    <form nz-form [formGroup]="fg" nzLayout="vertical" style="padding: 0px; margin: 0px;">
      <!-- 폼 오류 메시지 템플릿 -->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
        @if (control.hasError('exists')) {
          기존 코드가 존재합니다.
        }
      </ng-template>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="payItemCode" nzRequired>급여항목코드</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="payItemCode" formControlName="payItemCode" required/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="effectiveDate" nzRequired>적용일</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="effectiveDate" formControlName="effectiveDate"></nz-date-picker>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="occupationCode">직종</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="occupationCode" formControlName="occupationCode"/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="jobGradeCode">직급</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="jobGradeCode" formControlName="jobGradeCode"/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="payStepCode">호봉</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="payStepCode" formControlName="payStepCode"/>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="wageAmount">금액</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-number nzId="wageAmount" formControlName="wageAmount" required></nz-input-number>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayTableFormComponent {
  private http = inject(HttpClient);
  private hrmCodeService = inject(HrmCodeService);

  [key: string]: any;
  /**
   * 직종코드 - HR0003
   */
  occupationCodeList: HrmCode[] = [];
  /**
   * 직급코드 - HR0004
   */
  jobGradeCodeList: HrmCode[] = [];
  /**
   * 호봉코드 - HR0005
   */
  payStepCodeList: HrmCode[] = [];

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    id                : new FormControl<string | null>(null, { validators: Validators.required }),
    companyCode       : new FormControl<string | null>(null, { validators: Validators.required }),
    payItemCode       : new FormControl<string | null>(null),
    effectiveDate     : new FormControl<Date | null>(null),
    occupationCode    : new FormControl<string | null>(null),
    jobGradeCode      : new FormControl<string | null>(null),
    payStepCode       : new FormControl<string | null>(null),
    wageAmount        : new FormControl<number | null>(null),
    isEnable          : new FormControl<boolean | null>(null),
    comment           : new FormControl<string | null>(null),
  });

  constructor() {
    this.getCodeMap([
      {typeId: 'HR0003', propertyName: "occupationCodeList"},
      {typeId: 'HR0004', propertyName: "jobGradeCodeList"},
      {typeId: 'HR0005', propertyName: "payStepCodeList"},
    ]);
  }

  newForm(): void {
    this.fg.reset();
  }

  modifyForm(formData: PayTable): void {
    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/payitem/${id}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<PayTable>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<Staff>>('get', undefined))
        )
        .subscribe(
          (model: ResponseObject<PayTable>) => {
            model.data ? this.modifyForm(model.data) : this.newForm();
          }
    )
  }

  save(): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/payitem`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<PayTable>>(url, this.fg.getRawValue(), options).pipe(
        //  catchError(this.handleError<ResponseObject<Staff>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<PayTable>) => {
            //this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  getCodeMap(objs: {typeId: string,  propertyName: string}[]): void {

      const params = {
        typeIds : objs.map(e => e.typeId)
      };

      this.hrmCodeService
          .getMapList(params)
          .subscribe(
            (model: ResponseMap<HrmCode>) => {
              if ( model.data ) {
                let data: any = model.data;

                for (const obj of objs) {
                  this[obj.propertyName] = data[obj.typeId];
                }
              } else {
                //list = [];
              }
            }
        );

    }
}
