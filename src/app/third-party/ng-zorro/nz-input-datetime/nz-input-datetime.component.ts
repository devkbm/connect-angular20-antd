import { Component, Input, TemplateRef, viewChild, inject, signal } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgModel, NgControl, FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerComponent, NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerComponent, NzTimePickerModule } from 'ng-zorro-antd/time-picker';

import { formatDate } from '@angular/common';

export enum TimeFormat {
  HourMinuteSecond = 'HH:mm:ss',
  HourMinute = 'HH:mm'
}

@Component({
  selector: 'app-nz-input-datetime',
  imports: [FormsModule, NzFormModule, NzDatePickerModule, NzTimePickerModule],
  template: `
    <!--{{formField.errors | json}}-->
    <nz-date-picker #date
      [nzId]="itemId"
      [nzPlaceHolder]="placeholder"
      [required]="required"
      [nzDisabled]="disabled"
      [nzInputReadOnly]="readonly"
      nzAllowClear="false"
      [ngModel]="_value()"
      (blur)="onTouched()">
    </nz-date-picker>
    <nz-time-picker #time
      [nzDisabled]="disabled"
      [nzFormat]="timeFormat"
      [nzNowText]="' '"
      [nzMinuteStep]="30"
      [ngModel]="_value">
    </nz-time-picker>
  `,
  styles:[`
    nz-date-picker {
      width: 140px
    }
    nz-time-picker {
      width: 120px
    }
  `]
})
export class NzInputDateTimeComponent implements ControlValueAccessor {

  dateElement = viewChild.required(NzDatePickerComponent);
  timeElement = viewChild.required(NzTimePickerComponent);

  @Input() itemId: string = '';
  @Input() required: boolean | string = false;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() readonly: boolean = false;

  @Input() timeFormat: TimeFormat = TimeFormat.HourMinuteSecond;

  @Input() nzErrorTip?: string | TemplateRef<{$implicit: AbstractControl | NgModel;}>;

  _value = signal('');

  onChange!: (value: string | null) => void;
  onTouched!: () => void;

  private ngControl = inject(NgControl, { self: true, optional: true });
  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(obj: any): void {
    this._value.set(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  focus(): void {
    this.dateElement()?.focus();
  }

}
