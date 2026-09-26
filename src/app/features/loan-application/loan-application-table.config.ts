import { badge } from '../../shared/components/badges/badges';
import { reviewApplicationButton } from '../../shared/components/buttons/crud-button';
import { LoanApplicationResponse } from './loan-application.model';

export const LOAN_APPLICATION_TABLE_COLUMNS = [
  {
    title: 'Application ID',
    data: 'applicationId',
    className: 'text-center font-semibold text-gray-800/70 text-base',
  },
  {
    title: 'Customer',
    data: 'customer.fullName',
    className: 'text-left text-base',
  },
  {
    title: 'Cabang',
    data: 'branch.name',
    className: 'text-left text-base',
  },
  {
    title: 'Jumlah Pinjaman',
    data: 'loanAmount',
    className: 'text-right text-base',
    render: (data: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(data);
    },
  },
  {
    title: 'Tenor',
    data: 'tenorMonths',
    className: 'text-center text-base',
    render: (data: number) => {
      return `${data} Bulan`;
    },
  },
  {
    title: 'Status',
    data: 'status',
    className: 'text-center text-base',
    render: (data: string) => {
      return badge(data, 'blue');
    },
  },
  {
    title: 'Aksi',
    data: null,
    className: 'text-center',
    orderable: false,
    searchable: false,
    render: (_data: null, _type: string, row: LoanApplicationResponse) => `
      <div class="flex items-center justify-center gap-2">
        ${reviewApplicationButton(row.id)}
      </div>
    `,
  },
];
