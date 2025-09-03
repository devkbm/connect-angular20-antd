import { inject, Injectable, signal } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { ResponseList } from 'src/app/core/model/response-list';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { HttpClient } from '@angular/common/http';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { GlobalProperty } from 'src/app/core/global-property';



export interface NzInputTreeSelectDept {
  parentDeptCode: string;
  deptCode: string;
  deptNameKorean: string;
  deptAbbreviationKorean: string;
  deptNameEnglish: string;
  deptAbbreviationEnglish: string;
  fromDate: string;
  toDate: string;
  seq: number;
  comment: string;

  title: string;
  key: string;
  isLeaf: boolean;
  children: NzInputTreeSelectDept[];
}


@Injectable({
  providedIn: 'root'
})
export class DeptTreeSelectService {

  private http = inject(HttpClient);
  nodes = signal<NzTreeNodeOptions[] | NzTreeNode[] | NzInputTreeSelectDept[]>([]);

  getDeptHierarchy(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/depttree`;
    const options = getHttpOptions();

    this.http.get<ResponseList<NzInputTreeSelectDept>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<Dept>>('saveDept', undefined))
        )
        .subscribe(
          (model: ResponseList<NzInputTreeSelectDept>) => {
            if (model.data) {
              this.nodes.set(model.data);
            } else {
              this.nodes.set([]);
            }
          }
        )
  }

}
