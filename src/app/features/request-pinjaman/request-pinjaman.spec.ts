import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPinjaman } from './request-pinjaman';

describe('RequestPinjaman', () => {
  let component: RequestPinjaman;
  let fixture: ComponentFixture<RequestPinjaman>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestPinjaman],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestPinjaman);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
