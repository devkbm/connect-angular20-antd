import { Component, input, output, viewChild } from '@angular/core';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCrudButtonGroupComponent } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group.component';
import { HrmTypeCodeFormComponent } from './hrm-code-form.component';

@Component({
  selector: 'app-hrm-code-form-drawer',
  imports: [
    NzDrawerModule,
    NzCrudButtonGroupComponent,
    HrmTypeCodeFormComponent
  ],
  template: `
    <nz-drawer
      nzTitle="업무코드 등록"
      nzWidth="80%"
      [nzMaskClosable]="true"
      [nzVisible]="drawer().visible"
      [nzFooter]="footerTpl"
      (nzOnClose)="drawer().visible = false">
      <app-hrm-code-form *nzDrawerContent
          [formDataId]="drawer().formDataId"
          (formSaved)="closeDrawer($event)"
          (formDeleted)="closeDrawer($event)"
          (formClosed)="drawer().visible = false">
      </app-hrm-code-form>
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
  styles: []
})
export class HrmCodeFormDrawerComponent {

  drawer = input.required<{visible: boolean, formDataId: any}>();
  drawerClosed = output<any>();

  form = viewChild.required<HrmTypeCodeFormComponent>(HrmTypeCodeFormComponent);

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
