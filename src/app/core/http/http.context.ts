import { HttpContextToken } from '@angular/common/http';

export type ApiAccess = 'public' | 'authorized';

export const API_ACCESS = new HttpContextToken<ApiAccess>(() => 'authorized');

export const PUBLIC: ApiAccess = 'public';
export const AUTHORIZED: ApiAccess = 'authorized';
