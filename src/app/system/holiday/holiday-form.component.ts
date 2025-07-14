import { Component, AfterViewInit, inject, Renderer2, input, effect, output } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ResponseObject } from 'src/app/core/model/response-object';
import { NotifyService } from 'src/app/core/service/notify.service';

import { Holiday } from './holiday.model';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormItemCustomComponent } from "src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component";
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';


@Component({
  selector: 'app-holiday-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzFormItemCustomComponent
  ],
  template: `
    {{fg.value | json}} - {{fg.valid}}
    <form nz-form [formGroup]="fg" nzLayout="vertical">

      <!-- ERROR TEMPLATE-->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
        @if (control.hasError('exists')) {
          기존 코드가 존재합니다.
        }
      </ng-template>

      <!-- 1 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="date" label="휴일" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="date" formControlName="date" style="width: 150px">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="holidayName" label="휴일명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="holidayName" formControlName="holidayName" required
                placeholder="휴일명을 입력해주세요."
              />
            </nz-form-control>
          </nz-form-item-custom>
        </div>

      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item-custom for="comment" label="설명">
            <nz-form-control>
              <textarea nz-input id="comment" formControlName="comment"
                placeholder="설명을 입력해주세요." [rows]="13">
              </textarea>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

    </form>
  `,
  styles: []
})
export class HolidayFormComponent implements AfterViewInit {

  private notifyService = inject(NotifyService);
  private renderer = inject(Renderer2);
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    date          : new FormControl<Date | null>(null, { validators: Validators.required }),
    holidayName   : new FormControl<string | null>(null, { validators: Validators.required }),
    comment       : new FormControl<string | null>(null)
  });

  formDataId = input<Date>();

  constructor() {

    effect(() => {
      if (this.formDataId()) {
        this.get(this.formDataId()!);
      }
    })
  }

  ngAfterViewInit(): void {
  }

  focusInput() {
    this.renderer.selectRootElement('#holidayName').focus();
  }

  newForm(date: Date): void {
    this.fg.reset();

    this.fg.controls.date.setValue(date);

    this.focusInput();
  }

  modifyForm(formData: Holiday): void {
    this.fg.patchValue(formData);

    this.focusInput();
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(date: Date): void {
    const id = formatDate(date,'YYYYMMdd','ko-kr');

    const url = GlobalProperty.serverUrl() + `/api/system/holiday/${id}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<Holiday>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseObject<Holiday>) => {
            model.data ? this.modifyForm(model.data) : this.newForm(date);
          }
      )
  }

  save(): void {
    if (this.fg.invalid) {
      Object.values(this.fg.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const url = GlobalProperty.serverUrl() + `/api/system/holiday`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<Holiday>>(url, this.fg.getRawValue(), options).pipe(
          //catchError(this.handleError<ResponseObject<Holiday>>('saveHoliday', undefined))
        )
        .subscribe(
          (model: ResponseObject<Holiday>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(): void {
    const id = formatDate(this.fg.controls.date.value!,'YYYYMMdd','ko-kr');

    const url = GlobalProperty.serverUrl() + `/api/system/holiday/${id}`;
    const options = getHttpOptions();

    this.http
        .delete<ResponseObject<Holiday>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<Holiday>>('deleteHoliday', undefined))
        )
        .subscribe(
          (model: ResponseObject<Holiday>) => {
          this.notifyService.changeMessage(model.message);
          this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

}
