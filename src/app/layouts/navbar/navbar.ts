import { AfterViewInit, Component, EventEmitter, OnDestroy, Output, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
})
export class Navbar implements AfterViewInit, OnDestroy {
  @Output() downloadRequested = new EventEmitter<void>();

  activeSection = 'simulasi';
  private observer?: IntersectionObserver;
  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const sections = document.querySelectorAll<HTMLElement>('section[id]');

    this.observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries.filter((entry) => entry.isIntersecting);

        if (visibleSections.length > 0) {
          this.activeSection = visibleSections[0].target.id;
        }
      },
      {
        rootMargin: '-80px 0px -40% 0px',
        threshold: 0.3,
      },
    );

    sections.forEach((section) => this.observer?.observe(section));
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
