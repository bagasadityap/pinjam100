export interface ReviewRequest {
  reviewResult: ReviewResult;
  notes?: string;
}

export enum ReviewResult {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface ReviewResponse {
  id: string;
  loanApplicationId: string;
  result: ReviewResult;
  notes: string;
  reviewedBy: string;
  reviewedDate: string;
}
