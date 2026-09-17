import { RekeningResponse } from "../../core/model/rekening.model";
import { BranchResponse } from "../branch/branch.model";
import { CustomerResponse, CustomerDetailResponse } from "../customer/customer.model";
import { ReviewResponse } from "./review/review.model";

export interface LoanApplicationResponse {
  applicationId: string;
  branch: BranchResponse;
  customer: CustomerResponse;
  id: string;
  interestRate: number;
  loanAmount: number;
  purpose: string;
  status: string;
  tenorMonths: number;
  createdDate: string;
}

export interface LoanApplicationReviewResponse {
  applicationId: string
  branch: Branch
  customer: CustomerDetailResponse
  id: string
  interestRate: number
  loanAmount: number
  purpose: string
  review: any
  status: string
  tenorMonths: number
}

export interface LoanApplicationApprovalResponse {
  id: string;
  applicationId: string;
  loanAmount: number;
  tenorMonths: number;
  interestRate: number;
  purpose: string;
  status: string;

  customer: CustomerDetailResponse;
  branch: Branch;

  review: ReviewResponse;
}

export interface LoanApplicationDisbursementResponse {
  id: string;
  applicationId: string;
  loanAmount: number;
  tenorMonths: number;
  interestRate: number;
  purpose: string;
  status: string;

  customer: CustomerResponse;
  branch: BranchResponse;

  rekening: RekeningResponse;
}

export interface Branch {
  city: string
  id: string
  name: string
  postalCode: string
  province: string
}
