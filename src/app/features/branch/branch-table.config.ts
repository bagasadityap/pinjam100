import {
  readButton,
  updateButton,
  deleteButton
} from '../../shared/components/buttons/crud-button';
import { badge } from '../../shared/components/badges/badges';
import { BranchResponse } from './branch.model';

export const BRANCH_TABLE_COLUMNS = [
  {
    title: 'Branch',
    data: 'name',
    className: 'text-base',

    render: (data: string) => {
      return badge(data, 'blue');
    }
  },
  {
    title: 'Province',
    data: 'province',
    className: 'text-base'
  },
  {
    title: 'City',
    data: 'city',
    className: 'text-base'
  },
  {
    title: 'Postal Code',
    data: 'postalCode',
    className: 'text-base'
  },
  {
    title: 'Aksi',
    data: null,
    className: 'text-center',
    orderable: false,
    searchable: false,
    render: (_data: null, _type: string, row: BranchResponse) => `
      <div class="flex items-center justify-center gap-2">
        ${readButton(row.id)}
        ${updateButton(row.id)}
        ${deleteButton(row.id)}
      </div>
    `
  }
];
