import { CommonModule } from '@angular/common';
import { StaffCardComponent } from './staff-card';

import { Component, OnInit, inject } from '@angular/core';
import { ResponseList } from 'src/app/core/model/response-list';
import { StaffCardModel } from './staff-card.model';
import { StaffCardService } from './staff-card.service';

@Component({
  selector: 'staff-card-list',
  imports: [
    CommonModule, StaffCardComponent
  ],
  template: `
    @for (item of _list; track item.staffId) {
      <staff-card [data]="item"></staff-card>
    }
  `,
  styles: []
})
export class StaffCardListComponent implements OnInit {
  _list: StaffCardModel[] = [];

  private service = inject(StaffCardService);

  ngOnInit() {
    this.getStaffCardList();
  }

  getStaffCardList() {
    this.service
        .getList()
        .subscribe(
          (model: ResponseList<StaffCardModel>) => {
            this._list = model.data;
          }
        );
  }
}
