import { RekeningResponse } from "../../../core/model/rekening.model";

export interface DisbursementResponse {
  id: string;
  loanApplicationId: string;
  dibursementAmount: number;
  adminFee: number;
  otherFee: number;
  netAmount: number;
  status: string;
  disbursedDate: string;
  rekening: RekeningResponse;
}
