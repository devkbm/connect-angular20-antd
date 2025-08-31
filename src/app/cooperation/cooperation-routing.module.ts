
import { Routes } from '@angular/router';

import { AppLayoutComponent } from '../app-layout/app-layout.component';

import { AuthGuardService } from '../core/service/auth-guard.service';

export const routes: Routes = [
  {
    path: '', component: AppLayoutComponent/*, canActivateChild: [AuthGuardService]*/,
    children: [
      {path: 'team',          loadComponent: () => import('./team/app-team').then(m => m.TeamApp)},
      {path: 'board',         loadComponent: () => import('./board/app-board').then(m => m.BoardApp)},
      {path: 'boardm',        loadComponent: () => import('./board/board-management/app-board-management').then(m => m.BoardManagementApp)},
      {path: 'todo',          loadComponent: () => import('./todo/app-todo').then(m => m.TodoApp)},
      {path: 'workcalendar',  loadComponent: () => import('./work-calendar/app-work-calendar').then(m => m.WorkCalendarApp)}
    ]
  }
];
