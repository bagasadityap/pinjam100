import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  OnChanges,
} from '@angular/core';
import { AuthStateService } from '../service/auth-state.service';

@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnChanges {
  @Input() hasRole!: string;

  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authState = inject(AuthStateService);

  ngOnChanges(): void {
    this.updateView();
  }

  private updateView(): void {
    const role = this.authState.getRole();

    this.viewContainer.clear();

    if (role === this.hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
