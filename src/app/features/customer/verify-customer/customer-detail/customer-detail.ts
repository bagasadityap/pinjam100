import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sidebar } from '../../../../layouts/sidebar/sidebar';
import { CustomerService } from '../../customer.service';
import { CustomerDetailResponse } from '../../customer.model';
import { HotToastService } from '@ngxpert/hot-toast';
import { DatePipe } from '@angular/common';
import { DocumentService } from '../../../../core/service/document.service';
import { Document } from '../../../../core/model/document.model';
import { VerificationModal } from '../../../../shared/components/verification-modal/verification-modal';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-customer-detail',
  imports: [Sidebar, DatePipe, VerificationModal],
  templateUrl: './customer-detail.html',
  styleUrl: './customer-detail.css',
})
export class CustomerDetail implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly documentService = inject(DocumentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(HotToastService);

  readonly customer = signal<CustomerDetailResponse | null>(null);

  documentUrl = environment.api.documentUrl;
  verificationValue = '';
  isVerifyCustomerModalOpen = false;
  isVerifyDocumentModalOpen = false;
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
        response.documents = response.documents.map(document => ({
          ...document,
          fileUrl: this.customerService.getDocument(document.fileUrl)
        }));

        this.customer.set(response);
      },
      error: (error) => {
        this.toast.error(
          error.error?.message ?? 'Gagal mendapatkan detail customer'
        );
        this.back();
      }
    });
  }

  back(): void {
    this.router.navigate(['/verifikasi-customer']);
  }

  verifyCustomer(customerId: string): void {
    this.customerService.verifyCustomer(customerId, 'VERIFIED').subscribe({
      next: () => {
        this.closeVerifyModal();
        this.router.navigate(['/verifikasi-customer']);
        this.toast.success('Customer berhasil diverifikasi');
      },
      error: (error) => {
        this.toast.error(
          error.error?.message ?? 'Gagal memverifikasi customer'
        );
      }
    });
  }

  rejectCustomer(customerId: string): void {
    this.customerService.verifyCustomer(customerId, 'REJECTED').subscribe({
      next: () => {
        this.toast.success('Customer berhasil ditolak');
        this.closeVerifyModal();
        this.getCustomer();
      },
      error: (error) => {
        this.toast.error(
          error.error?.message ?? 'Gagal memverifikasi customer'
        );
      }
    });
  }

  verifyDocument(documentId: string): void {
    this.documentService.verifyDocument(documentId, 'VERIFIED').subscribe({
      next: () => {
        this.toast.success('Dokumen berhasil diverifikasi');
        this.closeVerifyModal();
        this.getCustomer();
      },
      error: (error) => {
        this.toast.error(
          error.error?.message ?? 'Gagal memverifikasi dokumen'
        );
      }
    });
  }

  rejectDocument(documentId: string): void {
    this.documentService.verifyDocument(documentId, 'REJECTED').subscribe({
      next: () => {
        this.toast.success('Dokumen berhasi ditolak');
        this.closeVerifyModal();
        this.getCustomer();
      },
      error: (error) => {
        this.toast.error(
          error.error?.message ?? 'Gagal memverifikasi dokumen'
        );
      }
    });
  }

  hasDocument(type: string): boolean {
    return this.customer()?.documents?.some(
      document => document.type === type
    ) ?? false;
  }

  findDocument(type: string): Document | null {
    return this.customer()?.documents?.find(
      document => document.type === type
    ) ?? null;
  }

  hasOtherDocuments(documents: Document[]): boolean {
    return documents.some(
      document => document.type !== 'KTP' && document.type !== 'SELFIE'
    );
  }

  openVerifyDocumentModal(documentId: string): void {
    this.verificationValue = documentId;
    this.isVerifyDocumentModalOpen = true;
  }

  openVerifyCustomerModal(customerId: string): void {
    this.verificationValue = customerId;
    this.isVerifyCustomerModalOpen = true;
  }

  closeVerifyModal(): void {
    this.verificationValue = '';
    this.isVerifyDocumentModalOpen = false;
    this.isVerifyCustomerModalOpen = false;
  }

  confirmVerifyDocument(): void {
    if (!this.verificationValue) {
      return;
    }

    this.verifyDocument(this.verificationValue);
  }

  confirmRejectDocument(): void {
    if (!this.verificationValue) {
      return;
    }

    this.rejectDocument(this.verificationValue);
  }

  confirmVerifyCustomer(): void {
    if (!this.verificationValue) {
      return;
    }

    this.verifyCustomer(this.verificationValue);
  }

  confirmRejectCustomer(): void {
    if (!this.verificationValue) {
      return;
    }

    this.rejectCustomer(this.verificationValue);
  }

  getDocumentUrl(fileUrl: string): string {
    return this.customerService.getDocument(fileUrl);
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
