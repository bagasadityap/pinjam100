import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { of, throwError } from 'rxjs';

import { Login } from './login';
import { AuthService } from '../auth.service';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn()
    };

    routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('harus membuat komponen', () => {
    expect(component).toBeTruthy();
  });

  it('harus menampilkan pesan error jika NIP atau password kosong', () => {
    component.identityNumber = '  '; // Spasi saja
    component.password = '';

    component.login();

    expect(component.errorMessage()).toBe('NIP dan password wajib diisi.');
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('harus memanggil authService.login, mengubah status loading, dan navigasi ke /dashboard jika sukses', () => {
    component.identityNumber = ' 12345 ';
    component.password = 'password123';

    authServiceMock.login.mockReturnValue(of({}));

    component.login();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      identityNumber: '12345', // Harus di-trim
      password: 'password123'
    });

    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.loading()).toBe(false); // Diatur false oleh finalize
    expect(component.errorMessage()).toBe('');
  });

  it('harus menampilkan pesan error spesifik dari backend jika login gagal', () => {
    component.identityNumber = '12345';
    component.password = 'wrongpass';

    const mockError = { error: { message: 'Kredensial tidak valid' } };
    authServiceMock.login.mockReturnValue(throwError(() => mockError));

    component.login();

    expect(component.errorMessage()).toBe('Kredensial tidak valid');
    expect(component.loading()).toBe(false);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('harus menampilkan pesan error default jika login gagal tanpa pesan spesifik', () => {
    component.identityNumber = '12345';
    component.password = 'wrongpass';

    authServiceMock.login.mockReturnValue(throwError(() => ({ error: null })));

    component.login();

    expect(component.errorMessage()).toBe('Terjadi kesalahan. Silakan coba lagi.');
    expect(component.loading()).toBe(false);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
