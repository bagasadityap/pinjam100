import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sidebar } from '../../../../layouts/sidebar/sidebar';
import { CustomerService } from '../../customer.service';
import { CustomerDetailResponse } from '../../customer.model';
import { HotToastService } from '@ngxpert/hot-toast';
import { DatePipe } from '@angular/common';
import { Document } from '../../../../core/model/document.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-customer-detail',
  imports: [Sidebar, DatePipe],
  templateUrl: './customer-detail.html',
  styleUrl: './customer-detail.css',
})
export class CustomerDetail implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(HotToastService);

  readonly customer = signal<CustomerDetailResponse | null>(null);

  documentUrl = environment.api.documentUrl;
  previewDocumentUrl = '';
  previewDocumentTitle = '';

  ngOnInit(): void {
    this.getCustomer();
  }

  private getCustomer(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.toast.error('ID customer tidak ditemukan');
      this.back();
      return;
    }

    this.customerService.getDetailById(id).subscribe({
      next: (response) => {
        response.documents = response.documents.map((document) => ({
          ...document,
          fileUrl: this.customerService.getDocument(document.fileUrl),
        }));

        this.customer.set(response);
      },
      error: (error) => {
        this.toast.error(
          error.error?.message ?? 'Gagal mendapatkan detail customer'
        );
        this.back();
      },
    });
  }

  back(): void {
    this.router.navigate(['/customers']);
  }

  findDocument(type: string): Document | null {
    return (
      this.customer()?.documents?.find(
        (document) => document.type === type
      ) ?? null
    );
  }

  openDocumentPreview(url: string, title: string): void {
    this.previewDocumentUrl = url;
    this.previewDocumentTitle = title;
  }

  closeDocumentPreview(): void {
    this.previewDocumentUrl = '';
    this.previewDocumentTitle = '';
  }
}
