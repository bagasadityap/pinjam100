import { Routes } from '@angular/router';
import { authGuard } from './features/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing').then(
        m => m.Landing
      ),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(
        m => m.Login
      ),
  },

  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/reset-password/reset-password').then(
        m => m.ResetPassword
      ),
  },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(
        m => m.Dashboard
      ),
  },

  {
    path: 'request-pinjaman',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/request-pinjaman/request-pinjaman').then(
        m => m.RequestPinjaman
      ),
  },

  {
    path: 'pengajuan-pinjaman/review',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/loan-application/review/review').then(
        m => m.Review
      ),
  },

  {
    path: 'pengajuan-pinjaman/:id/review',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/loan-application/review/detail/detail').then(
        m => m.Detail
      ),
  },

  {
    path: 'pengajuan-pinjaman/approval',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/loan-application/approval/approval').then(
        m => m.Approval
      ),
  },

  {
    path: 'pengajuan-pinjaman/:id/approval',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/loan-application/approval/detail/detail').then(
        m => m.Detail
      ),
  },

  {
    path: 'pengajuan-pinjaman/disbursement',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/loan-application/disbursement/disbursement').then(
        m => m.Disbursement
      ),
  },

  {
    path: 'pengajuan-pinjaman/:id/disbursement',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/loan-application/disbursement/detail/detail').then(
        m => m.Detail
      ),
  },

  {
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/user/user').then(
        m => m.User
      ),
  },

  {
    path: 'customers',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/customer/customer').then(
        m => m.Customer
      ),
  },

  {
    path: 'customers/detail/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/customer/customer-detail/customer-detail').then(
        m => m.CustomerDetail
      ),
  },

  {
    path: 'limit-setting',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/limit-setting/limit-setting').then(
        m => m.LimitSetting
      ),
  },

  {
    path: 'limit-setting/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/limit-setting/setting/setting').then(
        m => m.Setting
      ),
  },

  {
    path: 'roles-permissions',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/role-permission/role').then(
        m => m.RolePermission
      ),
  },

  {
    path: 'branch',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/branch/branch').then(
        m => m.Branch
      ),
  },

  {
    path: '**',
    redirectTo: '',
  },

];
