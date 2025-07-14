import { Component, input, output, viewChild } from '@angular/core';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCrudButtonGroupComponent } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group.component';

import { BizCodeTypeFormComponent } from './biz-code-type-form.component';

@Component({
  selector: 'app-biz-code-type-form-drawer',
  imports: [
    NzDrawerModule,
    BizCodeTypeFormComponent,
    NzCrudButtonGroupComponent
  ],
  template: `
    <nz-drawer
      [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
      [nzMaskClosable]="true"
      nzWidth="80%"
      [nzVisible]="drawer().visible"
      nzTitle="업무코드분류 등록"
      [nzFooter]="footerTpl"
      (nzOnClose)="drawer().visible = false">
      <app-biz-code-type-form *nzDrawerContent
          [formDataId]="drawer().formDataId"
          (formSaved)="closeDrawer($event)"
          (formDeleted)="closeDrawer($event)"
          (formClosed)="drawer().visible = false">
      </app-biz-code-type-form>
    </nz-drawer>

    <ng-template #footerTpl>
      <div style="float: right">
        <app-nz-crud-button-group
          [searchVisible]="false"
          [isSavePopupConfirm]="false"
          (closeClick)="closeDrawer()"
          (saveClick)="save()"
          (deleteClick)="remove()">
        </app-nz-crud-button-group>
      </div>
    </ng-template>
  `,
  styles: [

  ]
})
export class BizCodeTypeFormDrawerComponent {

  drawer = input.required<{visible: boolean, formDataId: any}>();
  drawerClosed = output<any>();

  form = viewChild.required<BizCodeTypeFormComponent>(BizCodeTypeFormComponent);

  save() {
    this.form().save();
  }

  remove() {
    this.form().remove();
  }

  closeDrawer(params?: any) {
    this.form().closeForm();

    this.drawerClosed.emit(params);
  }
}
