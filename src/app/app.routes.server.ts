import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'pengajuan-pinjaman/:id/detail',
    renderMode: RenderMode.Server,
  },
  {
    path: 'pengajuan-pinjaman/:id/review',
    renderMode: RenderMode.Server,
  },
  {
    path: 'pengajuan-pinjaman/:id/approval',
    renderMode: RenderMode.Server,
  },
  {
    path: 'pengajuan-pinjaman/:id/disbursement',
    renderMode: RenderMode.Server,
  },
  {
    path: 'customers/detail/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'verifikasi-customer/detail/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'limit-setting/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
