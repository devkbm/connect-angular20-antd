import { CommonModule } from '@angular/common';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeModule } from 'ng-zorro-antd/tree';

import { Component, OnInit, ViewChild, Output, EventEmitter, Input, inject, viewChild, output } from '@angular/core';
import { ResponseList } from 'src/app/core/model/response-list';

import { CommonCodeService } from './common-code.service';

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
  selector: 'common-code-tree',
  imports: [ CommonModule, NzTreeModule ],
  template: `
    {{searchValue}}
    <nz-tree
        #treeComponent
        [nzData]="nodeItems"
        [nzSearchValue]="searchValue"
        (nzClick)="nzClick($event)">
    </nz-tree>
  `,
  styles: ['']
})
export class CommonCodeTreeComponent implements OnInit {

  treeComponent = viewChild.required(NzTreeComponent);

  @Input() searchValue = '';

  itemSelected = output<any>();

  nodeItems: CommonCodeHierarchy[] = [];

  private service = inject(CommonCodeService);

  ngOnInit(): void {
  }

  getCommonCodeHierarchy(systemTypeCode: string) {
    const params = {
      systemTypeCode: systemTypeCode
    };

    this.service
        .getCodeHierarchy(params)
        .subscribe(
          (model: ResponseList<CommonCodeHierarchy>) => {
            model.data ? this.nodeItems = model.data : this.nodeItems = [];
          }
        );
  }

  nzClick(event: NzFormatEmitEvent) {
    const node = event.node?.origin;
    this.itemSelected.emit(node);
  }

}
