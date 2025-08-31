import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, inject, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { StaffFamily } from './staff-family.model';
import { HrmCodeService } from '../../shared/hrm-code.service';
import { HrmCode } from '../../hrm-code/hrm-code.model';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormItemCustomComponent } from 'src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component';
import { NzInputSelectComponent } from 'src/app/third-party/ng-zorro/nz-input-select/nz-input-select.component';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

@Component({
  selector: 'app-staff-family-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzFormItemCustomComponent,
    NzInputSelectComponent,
  ],
  template: `
    {{fg.getRawValue() | json}} - {{fg.valid}}
    <form nz-form [formGroup]="fg" nzLayout="vertical">
      <!-- 폼 오류 메시지 템플릿 -->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
        @if (control.hasError('exists')) {
          기존 코드가 존재합니다.
        }
      </ng-template>

      <!-- 2 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item-custom for="familyRelation" label="가족관계" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="familyRelation" itemId="familyRelation"
                [options]="familyRelationList" [opt_value]="'code'" [opt_label]="'codeName'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="familyName" label="가족명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="familyName" formControlName="familyName" required
                placeholder="가족명을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="familyRRN" label="주민등록번호" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="familyRRN" formControlName="familyRRN" required
                placeholder="가족 주민번호를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 3 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item-custom for="occupation" label="직업">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="occupation" formControlName="occupation"
                placeholder="직업을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="schoolCareerType" label="학력">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="schoolCareerType" formControlName="schoolCareerType"
                placeholder="학력을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

        <!-- 4 Row -->
        <div nz-row nzGutter="8">
          <div nz-col nzSpan="24">
            <nz-form-item-custom for="comment" label="비고">
              <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
                <textarea nz-input id="comment" formControlName="comment"
                placeholder="비고를 입력해주세요." [rows]="23">
                </textarea>
              </nz-form-control>
            </nz-form-item-custom>
          </div>
        </div>
    </form>

    <!--
    <div class="footer">
      <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        [deleteVisible]="true"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove(fg.controls.staffNo.value!, fg.controls.seq.value!)">
      </app-nz-crud-button-group>
    </div>
    -->
  `,
  styles: []
})
export class StaffFamilyFormComponent implements OnInit, AfterViewInit, OnChanges {

  /**
   * 가족관계 - HR0008
   */
  familyRelationList: HrmCode[] = [];

  hrmCodeService = inject(HrmCodeService);
  notifyService = inject(NotifyService);
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    staffNo             : new FormControl<string | null>(null, { validators: Validators.required }),
    staffName           : new FormControl<string | null>(null, { validators: Validators.required }),
    seq                 : new FormControl<string | null>(null),
    familyName          : new FormControl<string | null>(null, { validators: Validators.required }),
    familyRRN           : new FormControl<string | null>(null, { validators: Validators.required }),
    familyRelation      : new FormControl<string | null>(null, { validators: Validators.required }),
    occupation          : new FormControl<string | null>(null),
    schoolCareerType    : new FormControl<string | null>(null),
    comment             : new FormControl<string | null>(null)
  });

  //@Input() staff?: {companyCode: string, staffNo: string, staffName: string};
  formDataId = input<{staffId: string, seq: string}>();
  staff = input<{companyCode: string, staffNo: string, staffName: string}>();

  constructor() {
    effect(() => {
      if (this.formDataId()) {
        this.get(this.formDataId()?.staffId!, this.formDataId()?.seq!);
      } else {
        this.newForm();
      }
    })
  }

  ngOnInit() {
    this.getFamilyRelationList();
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  newForm() {
    this.fg.controls.staffNo.disable();
    this.fg.controls.staffName.disable();

    if (this.staff()) {
      this.fg.controls.staffNo.setValue(this.staff()?.staffNo!);
      this.fg.controls.staffName.setValue(this.staff()?.staffName!);
    }
  }


  modifyForm(formData: StaffFamily) {
    this.fg.controls.staffNo.disable();
    this.fg.controls.staffName.disable();

    if (this.staff) {
      this.fg.controls.staffNo.setValue(this.staff()?.staffNo!);
      this.fg.controls.staffName.setValue(this.staff()?.staffName!);
    }

    this.fg.patchValue(formData);
  }


  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(staffId: string, seq: string): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${staffId}/family`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<StaffFamily>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<StaffFamily>>('getCurrentAppointment', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffFamily>) => {
            model.data ? this.modifyForm(model.data) : this.newForm()
          }
        )
  }

  save() {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${this.fg.controls.staffNo.value}/family`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<StaffFamily>>(url, this.fg.getRawValue(), options).pipe(
        //  catchError(this.handleError<ResponseObject<StaffFamily>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffFamily>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.notifyService.changeMessage(model.message);
          }
        )
  }

  remove(): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${this.fg.controls.staffNo.value}/family/${this.fg.controls.seq.value}`;
    const options = getHttpOptions();

    this.http
        .delete<ResponseObject<StaffFamily>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<StaffFamily>>('delete', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffFamily>) => {
            this.formDeleted.emit(this.fg.getRawValue());
            this.notifyService.changeMessage(model.message);
          }
        )
  }

  getFamilyRelationList() {
    const params = {
      typeId : 'HR0008'
    };

    this.hrmCodeService
        .getList(params)
        .subscribe(
          (model: ResponseList<HrmCode>) => {
            this.familyRelationList = model.data;
          }
      );
  }

}
