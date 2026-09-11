import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Sidebar } from './sidebar';
import { AuthService } from '../../features/auth/auth.service';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  let authService: {
    logout: ReturnType<typeof vi.fn>;
  };
  let router: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authService = {
      logout: vi.fn()
    };

    router = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        {
          provide: AuthService,
          useValue: authService
        },
        {
          provide: Router,
          useValue: router
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle master data menu', () => {
    expect(component.masterDataMenuOpen).toBe(false);

    component.toggleMasterDataMenu();

    expect(component.masterDataMenuOpen).toBe(true);

    component.toggleMasterDataMenu();

    expect(component.masterDataMenuOpen).toBe(false);
  });

  it('should toggle user menu', () => {
    expect(component.userMenuOpen).toBe(false);

    component.toggleUserMenu();

    expect(component.userMenuOpen).toBe(true);

    component.toggleUserMenu();

    expect(component.userMenuOpen).toBe(false);
  });

  it('should open logout modal', () => {
    expect(component.logoutModalOpen).toBe(false);

    component.openLogoutModal();

    expect(component.logoutModalOpen).toBe(true);
  });

  it('should close logout modal', () => {
    component.logoutModalOpen = true;

    component.closeLogoutModal();

    expect(component.logoutModalOpen).toBe(false);
  });

  it('should logout and navigate to login when logout is successful', () => {
    authService.logout.mockReturnValue(of(undefined));

    component.logout();

    expect(authService.logout).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not navigate to login when logout fails', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    authService.logout.mockReturnValue(
      throwError(() => ({
        status: 500,
        message: 'Logout failed'
      }))
    );

    component.logout();

    expect(authService.logout).toHaveBeenCalledTimes(1);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith(
      'Gagal logout:',
      expect.objectContaining({
        status: 500
      })
    );

    consoleError.mockRestore();
  });
});
