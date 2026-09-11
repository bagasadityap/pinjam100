import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { Navbar } from './navbar';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let observe: ReturnType<typeof vi.fn>;
  let disconnect: ReturnType<typeof vi.fn>;
  let intersectionCallback: IntersectionObserverCallback;

  const createEntry = (target: Element, isIntersecting: boolean): IntersectionObserverEntry => ({
    target,
    isIntersecting,
    boundingClientRect: target.getBoundingClientRect(),
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: target.getBoundingClientRect(),
    rootBounds: null,
    time: 0
  });

  beforeEach(async () => {
    observe = vi.fn();
    disconnect = vi.fn();

    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }

      observe = observe;
      disconnect = disconnect;
      unobserve = vi.fn();
      takeRecords = vi.fn(() => []);
      root = null;
      rootMargin = '-80px 0px -40% 0px';
      thresholds = [0.3];
    });

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        {
          provide: PLATFORM_ID,
          useValue: 'browser'
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have beranda as active section by default', () => {
    expect(component.activeSection).toBe('beranda');
  });

  it('should set active section', () => {
    component.setActiveSection('tentang');

    expect(component.activeSection).toBe('tentang');
  });

  it('should initialize IntersectionObserver after view init', () => {
    const sections = [
      document.createElement('section'),
      document.createElement('section'),
      document.createElement('section')
    ];

    sections[0].id = 'beranda';
    sections[1].id = 'tentang';
    sections[2].id = 'kontak';

    sections.forEach(section => document.body.appendChild(section));

    fixture.detectChanges();

    expect(observe).toHaveBeenCalledTimes(3);
    expect(observe).toHaveBeenCalledWith(sections[0]);
    expect(observe).toHaveBeenCalledWith(sections[1]);
    expect(observe).toHaveBeenCalledWith(sections[2]);

    sections.forEach(section => section.remove());
  });

  it('should update active section when a section becomes visible', () => {
    const section = document.createElement('section');
    section.id = 'tentang';

    document.body.appendChild(section);
    fixture.detectChanges();

    intersectionCallback(
      [createEntry(section, true)],
      {} as IntersectionObserver
    );

    expect(component.activeSection).toBe('tentang');

    section.remove();
  });

  it('should not update active section when no section is visible', () => {
    const section = document.createElement('section');
    section.id = 'tentang';

    document.body.appendChild(section);
    fixture.detectChanges();

    component.activeSection = 'beranda';

    intersectionCallback(
      [createEntry(section, false)],
      {} as IntersectionObserver
    );

    expect(component.activeSection).toBe('beranda');

    section.remove();
  });

  it('should use the first visible section as active section', () => {
    const firstSection = document.createElement('section');
    const secondSection = document.createElement('section');

    firstSection.id = 'tentang';
    secondSection.id = 'kontak';

    document.body.appendChild(firstSection);
    document.body.appendChild(secondSection);

    fixture.detectChanges();

    intersectionCallback(
      [
        createEntry(firstSection, true),
        createEntry(secondSection, true)
      ],
      {} as IntersectionObserver
    );

    expect(component.activeSection).toBe('tentang');

    firstSection.remove();
    secondSection.remove();
  });

  it('should disconnect IntersectionObserver on destroy', () => {
    fixture.detectChanges();

    fixture.destroy();

    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
