import {
  Directive,
  Input,
  OnChanges,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { AuthStateService } from '../service/auth-state.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnChanges {
  @Input() hasPermission!: string;

  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authState = inject(AuthStateService);

  ngOnChanges(): void {
    this.updateView();
  }

  private updateView(): void {
    const hasPermission = this.authState.hasPermission(
      this.hasPermission
    );

    this.viewContainer.clear();

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
