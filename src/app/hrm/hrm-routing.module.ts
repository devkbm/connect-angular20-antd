import { Routes } from '@angular/router';

import { AppLayout } from '../app-layout/app-layout';
import { AuthGuardChildFunction, AuthGuardService } from '../core/service/auth-guard.service';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';
import { EnvironmentProviders, importProvidersFrom } from '@angular/core';

export const provideFormlyConfig = (config: ConfigOption): EnvironmentProviders => importProvidersFrom([
  FormlyModule.forChild(config),
]);

export const routes: Routes = [
  {
    path: '', component: AppLayout/*, canActivateChild: [AuthGuardService]*/,
    children: [
      {path: 'hrmtype',           loadComponent: () => import('./hrm-code/app-hrm-code').then(m => m.HrmCodeApp), providers: [provideFormlyConfig({})]},
      {path: 'dutyapplication',   loadComponent: () => import('./attendance-application/app-attendance-application').then(m => m.AttendanceApplicationApp)},
      {path: 'staff',             loadComponent: () => import('./staff/app-staff-management').then(m => m.StaffManagementApp)}
    ]
  }
];
