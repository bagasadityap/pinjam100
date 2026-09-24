import { Routes } from '@angular/router';

import { authGuard } from './core/guard/auth.guard';
import { roleGuard } from './core/guard/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing').then(m => m.Landing),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/reset-password/reset-password').then(m => m.ResetPassword),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.Dashboard),
  },
  {
    path: 'pengajuan-pinjaman',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./features/loan-application/all/loan-application').then(m => m.LoanApplication),
  },
  {
    path: 'pengajuan-pinjaman/:id/detail',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./features/loan-application/all/detail/detail').then(m => m.Detail),
  },
  {
    path: 'pengajuan-pinjaman/review',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN', 'MARKETING'] },
    loadComponent: () =>
      import('./features/loan-application/review/review').then(m => m.Review),
  },
  {
    path: 'pengajuan-pinjaman/:id/review',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN', 'MARKETING'] },
    loadComponent: () =>
      import('./features/loan-application/review/detail/detail').then(m => m.Detail),
  },
  {
    path: 'pengajuan-pinjaman/approval',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN', 'BRANCH_MANAGER'] },
    loadComponent: () =>
      import('./features/loan-application/approval/approval').then(m => m.Approval),
  },
  {
    path: 'pengajuan-pinjaman/:id/approval',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN', 'BRANCH_MANAGER'] },
    loadComponent: () =>
      import('./features/loan-application/approval/detail/detail').then(m => m.Detail),
  },
  {
    path: 'pengajuan-pinjaman/disbursement',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN', 'PAYMENT'] },
    loadComponent: () =>
      import('./features/loan-application/disbursement/disbursement').then(m => m.Disbursement),
  },
  {
    path: 'pengajuan-pinjaman/:id/disbursement',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN', 'PAYMENT'] },
    loadComponent: () =>
      import('./features/loan-application/disbursement/detail/detail').then(m => m.Detail),
  },
  {
    path: 'users',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./features/user/user').then(m => m.User),
  },
  {
    path: 'customers',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./features/customer/all/customer').then(m => m.Customer),
  },
  {
    path: 'customers/detail/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN', 'DOCUMENT_CHECKER'] },
    loadComponent: () =>
      import('./features/customer/all/customer-detail/customer-detail').then(m => m.CustomerDetail),
  },
  {
    path: 'verifikasi-customer',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN', 'DOCUMENT_CHECKER'] },
    loadComponent: () =>
      import('./features/customer/verify-customer/verify-customer').then(m => m.VerifyCustomer),
  },
  {
    path: 'verifikasi-customer/detail/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN', 'DOCUMENT_CHECKER'] },
    loadComponent: () =>
      import('./features/customer/verify-customer/customer-detail/customer-detail').then(m => m.CustomerDetail),
  },
  {
    path: 'limit-setting',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN', 'CREDIT_ANALYST'] },
    loadComponent: () =>
      import('./features/limit-setting/limit-setting').then(m => m.LimitSetting),
  },
  {
    path: 'limit-setting/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN', 'CREDIT_ANALYST'] },
    loadComponent: () =>
      import('./features/limit-setting/setting/setting').then(m => m.Setting),
  },
  {
    path: 'roles-permissions',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./features/role-permission/role').then(m => m.RolePermission),
  },
  {
    path: 'branch',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN'] },
    loadComponent: () =>
      import('./features/branch/branch').then(m => m.Branch),
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./features/error/forbidden/forbidden').then(m => m.Forbidden),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/error/not-found/not-found').then(m => m.NotFound),
  },
];
