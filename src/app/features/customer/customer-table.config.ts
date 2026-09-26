import { reviewCustomerButton, deleteButton } from '../../shared/components/buttons/crud-button';
import { CustomerResponse } from './customer.model';

export const CUSTOMER_TABLE_COLUMNS = [
  {
    title: 'No Customer',
    data: 'customerNumber',
    className: 'text-center font-semibold text-gray-800/70 text-base',
  },
  {
    title: 'Nama Lengkap',
    data: 'fullName',
    className: 'text-left text-base',
  },
  {
    title: 'Email',
    data: 'email',
    className: 'text-left text-base',
  },
  // {
  //   title: 'Status',
  //   data: 'status',
  //   className: 'text-center text-base',
  //   render: (data: string, _type: string, row: UserResponse) => `
  //     <label class="relative inline-flex items-center cursor-pointer">
  //       <input
  //         type="checkbox"
  //         class="sr-only datatable-status-toggle"
  //         data-action="set-active"
  //         data-id="${row.id}"
  //         ${data === 'true' ? 'checked' : ''}
  //       >
  //       <div class="w-11 h-6 rounded-full transition-colors ${data === 'true' ? 'bg-blue-600' : 'bg-gray-300'}">
  //         <div class="w-5 h-5 mt-0.5 ml-0.5 bg-white rounded-full shadow transition-transform ${data === 'true' ? 'translate-x-5' : ''}"></div>
  //       </div>
  //     </label>
  //   `
  // },
  {
    title: 'Aksi',
    data: null,
    className: 'text-center',
    orderable: false,
    searchable: false,
    render: (_data: null, _type: string, row: CustomerResponse) => `
      <div class="flex items-center justify-center gap-2">
        ${reviewCustomerButton(row.id)}
        ${deleteButton(row.id)}
      </div>
    `,
  },
];
