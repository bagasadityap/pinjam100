import { CustomerResponse } from '../customer/customer.model';
import { LoanApplicationResponse } from '../loan-application/loan-application.model';

export interface DashboardResponse {
  totalRequests: number;
  totalRequestGrowthRate: number;
  pendingRequests: number;
  approvedRequests: number;
  approvalRate: number;
  totalDisbursements: number;
  totalDisbursementGrowthRate: number;
  totalCustomers: number;
  totalCustomerGrowthRate: number;
  totalLoanOverdue: number;
  totalLoanAmountOverdue: number;
  recentRequests: LoanApplicationResponse[];
}

export interface MarketingDashboardResponse {
  totalRequests: number;
  totalRequestGrowthRate: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  approvalRate: number;
  totalDisbursements: number;
  totalDisbursementGrowthRate: number;
  totalCustomers: number;
  totalCustomerGrowthRate: number;
  totalLoanOverdue: number;
  totalLoanAmountOverdue: number;
  recentRequests: LoanApplicationResponse[];
}

export interface PaymentDashboardResponse {
  totalRequests: number;
  approvedRequests: number;
  pendingDisbursements: number;
  totalApprovedAmount: number;
  totalDisbursements: number;
  totalDisbursementGrowthRate: number;
  recentRequests: LoanApplicationResponse[];
}

export interface DocumentCheckerDashboardResponse {
  totalCustomers: number;
  pendingVerification: number;
  verifiedCustomers: number;
  rejectedCustomers: number;
  recentCustomers: CustomerResponse[];
}

export interface CreditAnalystDashboardResponse {
  totalCustomers: number;
  verifiedCustomers: number;
  pendingLimitAnalysis: number;
  customersWithLimit: number;
  recentCustomers: CustomerResponse[];
}
