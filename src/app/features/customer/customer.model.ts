import { Document } from '../../core/model/document.model';
import { Limit } from '../../core/model/limit.model';

export interface CustomerResponse {
  id: string;
  nationalId: string;
  customerNumber: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  verificationStatus: string;
  createdDate: string;
  limit: Limit;
}

export interface CustomerDetailResponse {
  customerNumber: string;
  nationalId: string;
  detail: Detail;
  documents: Document[];
  email: string;
  phoneNumber: string;
  employment: Employment;
  fullName: string;
  id: string;
  limit: Limit;
  rekening: Rekening[];
  verificationStatus: string;
  createdDate: string;
}

export interface Detail {
  address: string;
  birthDate: string;
  city: string;
  district: string;
  gender: string;
  id: string;
  placeOfBirth: string;
  postalCode: string;
  province: string;
  village: string;
}

export interface Employment {
  companyAddress: string;
  companyName: string;
  companyPhone: string;
  employmentType: string;
  id: string;
  monthlyIncome: number;
  position: string;
  startDate: string;
}

export interface Rekening {
  id: string;
  namaBank: string;
  noRekening: string;
  accountHolder: string;
}
