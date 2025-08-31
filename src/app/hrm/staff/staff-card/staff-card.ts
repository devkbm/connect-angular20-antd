import { CommonModule } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';

import { Component, Input, OnInit } from '@angular/core';
import { GlobalProperty } from 'src/app/core/global-property';
import { StaffCardModel } from './staff-card.model';

@Component({
  selector: 'app-staff-card',
  imports: [
    CommonModule, NzCardModule, NzAvatarModule
  ],
  template: `
    <nz-card class="card" nzHoverable nz-card-grid nzSize="small">
      <nz-card-meta
        [nzAvatar]="avatarTemplate"
        [nzTitle]="this.data?.staffName!"
        [nzDescription]="this.data?.blngDeptName!">
      </nz-card-meta>
    </nz-card>
    <ng-template #avatarTemplate>
      <nz-avatar
        [nzSrc]="getProfilePicture()"
        [nzShape]="'square'" [nzSize]="48">
      </nz-avatar>
    </ng-template>
  `,
  styles: [`
    .card {
      width: 200px;
      height: 80px;
      margin-top: 16px;
      margin-right: 8px;
      padding-top: 8px;
      padding-left: 0px;
      text-align: left;
    }
  `]
})
export class StaffCardComponent implements OnInit {

  @Input() data?: StaffCardModel;

  constructor() { }

  ngOnInit() {
  }

  getProfilePicture() {
    if (this.data?.profilePicture) {
      return GlobalProperty.serverUrl() + '/static/' + this.data?.profilePicture;
    }
    return undefined;
  }

}
