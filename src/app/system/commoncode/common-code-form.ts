import { Component, OnInit, Renderer2, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { CommonCodeService } from './common-code.service';
import { NotifyService } from 'src/app/core/service/notify.service';

import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzSelectModule } from 'ng-zorro-antd/select';


export interface CommonCodeFormData {
  systemTypeCode: string | null;
  codeId: string | null;
  parentId: string | null;
  code: string | null;
  codeName: string | null;
  codeNameAbbreviation: string | null;
  fromDate: Date | null;
  toDate: Date | null;
  seq: number | null;
  hierarchyLevel: number | null;
  lowLevelCodeLength: number | null;
  cmt: string | null;
}

export class SystemTypeEnum {
  constructor(
    public label: string,
    public value: string) {}
}


export class CommonCodeHierarchy {
  constructor(
    public id: string,
    public systemTypeCode: string,
    public code: string,
    public codeName: string,
    public codeNameAbbreviation: string,
    public fromDate: string,
    public toDate: string,
    public hierarchyLevel: number,
    public fixedLengthYn: boolean,
    public codeLength: number,
    public cmt: string,
    public parentId: string,
    public title: string,
    public key: string,
    public isLeaf: boolean,
    public children: CommonCodeHierarchy[]) { }
}


@Component({
  selector: 'common-code-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzSelectModule,
    NzTreeSelectModule,
  ],
  template: `
    {{fg.getRawValue() | json}}
    {{fg.get('fixedLengthYn')?.value}}
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

      <!-- 1 row -->
      <div nz-row nzGutter="8">

        <div nz-col nzSpan="4">
          <nz-form-item>
            <nz-form-label nzFor="systemTypeCode" nzRequired>시스템구분코드</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-select nzId="systemTypeCode" formControlName="systemTypeCode">
                @for (option of systemTypeCodeList; track option) {
                  <nz-option
                    [nzLabel]="option.label"
                    [nzValue]="option.value">
                  </nz-option>
                }
              </nz-select>

            </nz-form-control>
          </nz-form-item>
        </div>

        <!--상위 공통코드 필드-->
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="parentId" nzRequired>상위 공통코드</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-tree-select
                nzId="parentId"
                formControlName="parentId"
                [nzNodes]="nodeItems"
                nzPlaceHolder="부서 없음"
                >
              </nz-tree-select>

            </nz-form-control>
          </nz-form-item>
        </div>

      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="code" nzRequired>코드</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="code" formControlName="code" required
                placeholder="코드를 입력해주세요."
              />
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="codeName" nzRequired>코드명</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="codeName" formControlName="codeName" required
                placeholder="코드명 입력해주세요."
              />
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="codeNameAbbreviation">코드약어</nz-form-label>
            <nz-form-control>
              <input nz-input id="codeNameAbbreviation" formControlName="codeNameAbbreviation"
                placeholder="코드약어를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item>
        </div>

      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="5">
          <nz-form-item>
            <nz-form-label nzFor="fromDate" nzRequired>시작일</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="fromDate" formControlName="fromDate">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item>
        </div>
        <div nz-col nzSpan="5">
          <nz-form-item>
            <nz-form-label nzFor="toDate" nzRequired>종료일</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="toDate" formControlName="toDate">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="5">
          <nz-form-item>
            <nz-form-label nzFor="seq" nzRequired>출력 순번</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-number nzId="seq" formControlName="seq" required
                [nzMin]="0" [nzMax]="9999">
              </nz-input-number>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="5">
          <nz-form-item>
            <nz-form-label nzFor="lowLevelCodeLength">하위 코드 길이</nz-form-label>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-number nzId="lowLevelCodeLength" formControlName="lowLevelCodeLength"
                [nzMin]="0" [nzMax]="9999">
              </nz-input-number>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 4 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item>
            <nz-form-label nzFor="cmt">비고</nz-form-label>
            <nz-form-control>
              <textarea nz-input id="cmt" formControlName="cmt"
                placeholder="비고" [rows]="13">
              </textarea>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

    </form>

    <!--<div class="footer">
        <button
            nz-button
            (click)="closeForm()">
            <span nz-icon type="form" nzTheme="outline"></span>
            닫기
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button
            nz-button
            nzType="primary"
            nz-popconfirm
            nzTitle="저장하시겠습니까?"
            (nzOnConfirm)="submitCommonCode()"
            (nzOnCancel)="false">
            <span nz-icon type="save" nzTheme="outline"></span>
            저장
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button
            nz-button
            nzDanger
            nz-popconfirm
            nzTitle="삭제하시겠습니까?"
            (nzOnConfirm)="deleteCommonCode()"
            (nzOnCancel)="false">
            <span nz-icon type="delete" nzTheme="outline"></span>
            삭제
        </button>

    </div>
    -->

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
export class CommonCodeFormComponent implements OnInit {

  nodeItems: CommonCodeHierarchy[] = [];
  systemTypeCodeList: SystemTypeEnum[] = [];

  private commonCodeService = inject(CommonCodeService);
  private notifyService = inject(NotifyService);
  private renderer = inject(Renderer2);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    systemTypeCode          : new FormControl<string | null>(null),
    codeId                  : new FormControl<string | null>(null),
    parentId                : new FormControl<string | null>(null),
    code                    : new FormControl<string | null>(null, { validators: [Validators.required] }),
    codeName                : new FormControl<string | null>(null, { validators: [Validators.required] }),
    codeNameAbbreviation    : new FormControl<string | null>(null),
    fromDate                : new FormControl<Date | null>(null, { validators: [Validators.required] }),
    toDate                  : new FormControl<Date | null>(null, { validators: [Validators.required] }),
    hierarchyLevel          : new FormControl<number | null>(null),
    seq                     : new FormControl<number | null>(null),
    lowLevelCodeLength      : new FormControl<number | null>(null),
    cmt                     : new FormControl<string | null>(null)
  });

  ngOnInit(): void {
    this.getCommonCodeHierarchy('');
    this.getSystemTypeCode();
  }

  focusInput() {
    this.renderer.selectRootElement('#code').focus();
  }

  newForm(systemTypeCode: string, parentId: any): void {
    this.fg.reset();

    this.fg.controls.codeId.disable();
    this.fg.controls.code.enable();
    this.fg.controls.systemTypeCode.enable();
    this.fg.controls.systemTypeCode.setValue(systemTypeCode);
    this.fg.controls.parentId.setValue(parentId);
    this.fg.controls.seq.setValue(1);
    this.fg.controls.lowLevelCodeLength.setValue(0);
    this.fg.controls.fromDate.setValue(new Date());
    this.fg.controls.toDate.setValue(new Date(9999, 11, 31));

    this.focusInput();
  }

  modifyForm(formData: CommonCodeFormData): void {
    this.fg.controls.codeId.disable();
    this.fg.controls.code.disable();
    this.fg.controls.systemTypeCode.disable();
    this.fg.controls.parentId.disable();

    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(systemTypeCode: string, codeId: string): void {
    this.commonCodeService
        .getCode(systemTypeCode, codeId)
        .subscribe(
          (model: ResponseObject<CommonCodeFormData>) => {
            if ( model.data ) {
              this.modifyForm(model.data);
            }
            this.notifyService.changeMessage(model.message);
          }
        );
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

    this.commonCodeService
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<CommonCodeFormData>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove(): void {
    this.commonCodeService
        .remove(this.fg.controls.systemTypeCode.value!, this.fg.controls.codeId.value!)
        .subscribe(
          (model: ResponseObject<CommonCodeFormData>) => {
            this.notifyService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

  getSystemTypeCode(): void {
    this.commonCodeService
      .getSystemTypeList()
      .subscribe(
        (model: ResponseList<SystemTypeEnum>) => {
          this.systemTypeCodeList = model.data;
        }
      );
  }

  getCommonCodeHierarchy(systemTypeCode: string): void {
    const params = {
      systemTypeCode: systemTypeCode
    };

    this.commonCodeService
        .getCodeHierarchy(params)
        .subscribe(
          (model: ResponseList<CommonCodeHierarchy>) => {
            if ( model.data ) {
              this.nodeItems = model.data;
            } else {
              this.nodeItems = new Array<CommonCodeHierarchy>(0);
            }
          }
        );
  }

}
