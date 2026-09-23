import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

import { AuthStateService } from '../service/auth-state.service';

export const roleGuard: CanActivateChildFn = (route) => {
  const platformId = inject(PLATFORM_ID);
  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const requiredRoles = route.data['roles'] as string[];
  const currentRole = authState.getRole();

  if (currentRole && requiredRoles.includes(currentRole)) {
    return true;
  }

  return router.createUrlTree(['/forbidden']);
};
