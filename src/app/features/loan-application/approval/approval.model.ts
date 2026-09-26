export interface ApprovalRequest {
  approvalStatus: ApprovalStatus;
  notes?: string;
}

export enum ApprovalStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
