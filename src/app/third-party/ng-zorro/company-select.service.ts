import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { getHttpOptions } from 'src/app/core/http/http-utils';
import { GlobalProperty } from 'src/app/core/global-property';
import { ResponseList } from 'src/app/core/model/response-list';

export interface CompanyModel {
    companyCode: string;
    companyName: string;
    businessRegistrationNumber: string;
    coporationNumber: string;
    nameOfRepresentative: string;
    establishmentDate: Date;
    [key:string]:any;
}
  
@Injectable({
  providedIn: 'root'
})
export class CompanySelectService {

  private http = inject(HttpClient);
  list: CompanyModel[] = [];

  getCompanyList(): void {
    const params = {isEnabled: true};

    const url = GlobalProperty.serverUrl() + `/api/system/company`;
    const options = getHttpOptions(params);

    this.http.get<ResponseList<CompanyModel>>(url, options).pipe(
        //  catchError(this.handleError<ResponseList<NzInputSelectDeptModel>>('getDeptList', undefined))
        )
        .subscribe(
            (model: ResponseList<CompanyModel>) => {
                this.list = model.data;            
            }
        )
}

}
