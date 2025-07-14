import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, AfterViewInit, inject, Renderer2, input, effect, output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { NotifyService } from 'src/app/core/service/notify.service';

import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { BizCodeType } from './biz-code-type.model';
import { SelectControlModel } from 'src/app/core/model/select-control.model.ts';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCrudButtonGroupComponent } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group.component';
import { NzFormItemCustomComponent } from "../../third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component";
import { NzInputSelectComponent } from 'src/app/third-party/ng-zorro/nz-input-select/nz-input-select.component';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

@Component({
  selector: 'app-biz-code-type-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzCrudButtonGroupComponent,
    NzFormItemCustomComponent,
    NzInputSelectComponent
],
  template: `
    {{fg.getRawValue() | json}} - {{fg.valid}}
    <form nz-form [formGroup]="fg" nzLayout="vertical">

      <!-- ERROR TEMPLATE-->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
      </ng-template>

      <!-- 1 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item-custom for="typeId" label="업무코드분류ID" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="typeId" formControlName="typeId" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="typeName" label="코드분류명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="typeName" formControlName="typeName" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="sequence" label="순번" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-number nzId="sequence" formControlName="sequence" required
                [nzMin]="0" [nzMax]="9999"
              ></nz-input-number>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item-custom for="bizType" label="시스템" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="bizType" itemId="bizType"
                [options]="bizTypeList" [opt_value]="'value'" [opt_label]="'label'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item-custom for="comment" label="비고">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <textarea nz-input id="comment" formControlName="comment"
              placeholder="비고를 입력해주세요." [rows]="10">
              </textarea>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

    </form>

    <div class="footer">
      <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        (searchClick)="get(fg.controls.typeId.value!)"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove()">
      </app-nz-crud-button-group>
    </div>
  `,
  styles: [`
    [nz-button] {
      margin-right: 8px;
    }

    .form-item {
      margin-top: 0px;
      margin-bottom: 5px;
    }

    .btn-group {
      padding: 6px;
      /*background: #fbfbfb;*/
      border: 1px solid #d9d9d9;
      border-radius: 6px;
    }

    .footer {
      position: absolute;
      bottom: 0px;
      width: 100%;
      border-top: 1px solid rgb(232, 232, 232);
      padding: 10px 16px;
      text-align: right;
      left: 0px;
      /*background: #fff;*/
    }

  `]
})
export class BizCodeTypeFormComponent implements OnInit, AfterViewInit {

  bizTypeList: SelectControlModel[] = [];

  private notifyService = inject(NotifyService);
  private renderer = inject(Renderer2);
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    typeId    : new FormControl<string | null>(null, { validators: [Validators.required] }),
    typeName  : new FormControl<string | null>(null, { validators: [Validators.required] }),
    sequence  : new FormControl<number | null>(null),
    bizType   : new FormControl<string | null>(null, { validators: [Validators.required] }),
    comment   : new FormControl<string | null>(null)
  });

  formDataId = input<string>('');

  constructor() {
    effect(() => {
      if (this.formDataId()) {
        this.get(this.formDataId());
      }
    });
  }

  ngOnInit(): void {
    this.getSystemList();
  }

  ngAfterViewInit(): void {
    if (this.formDataId()) {
    } else {
      this.newForm();
    }
  }

  focusInput() {
    this.renderer.selectRootElement('#typeId').focus();
  }

  newForm(): void {
  }

  modifyForm(formData: BizCodeType): void {
    this.fg.controls.typeId.disable();

    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    const url = GlobalProperty.serverUrl() + `/api/system/bizcodetype/${id}`;
    const options = getHttpOptions();

    this.http.get<ResponseObject<BizCodeType>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<BizCodeType>>('get', undefined))
        )
        .subscribe(
          (model: ResponseObject<BizCodeType>) => {
            model.data ? this.modifyForm(model.data) : this.newForm()
            this.notifyService.changeMessage(model.message);
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

    const url = GlobalProperty.serverUrl() + `/api/system/bizcodetype`;
    const options = getHttpOptions();

    this.http.post<ResponseObject<BizCodeType>>(url, this.fg.getRawValue(), options).pipe(
    //      catchError(this.handleError<ResponseObject<BizCodeType>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<BizCodeType>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/bizcodetype/${this.fg.controls.typeId.value!}`;
    const options = getHttpOptions();

    this.http.delete<ResponseObject<BizCodeType>>(url, options).pipe(
            //catchError(this.handleError<ResponseObject<BizCodeType>>('delete', undefined))
          )
          .subscribe(
            (model: ResponseObject<BizCodeType>) => {
              this.notifyService.changeMessage(model.message);
              this.formDeleted.emit(this.fg.getRawValue());
            }
          )
  }

  getSystemList(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/bizcodetype/system`;
    const options = getHttpOptions();

    this.http.get<ResponseList<SelectControlModel>>(url, options).pipe(
        //  catchError(this.handleError<ResponseList<SelectControlModel>>('getSystemList', undefined))
        )
        .subscribe(
          (model: ResponseList<SelectControlModel>) => {
            model.data ? this.bizTypeList = model.data : this.bizTypeList = [];
          }
        )
  }
}
