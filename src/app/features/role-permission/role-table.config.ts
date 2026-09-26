import {
  updateButton,
  deleteButton,
  changePermissionButton,
} from '../../shared/components/buttons/crud-button';
import { badge } from '../../shared/components/badges/badges';
import { RoleResponse } from './role.model';

export const ROLE_TABLE_COLUMNS = [
  {
    title: 'Role',
    data: 'roleName',
    className: 'text-base',

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
    render: (_data: null, _type: string, row: RoleResponse) => `
      <div class="flex items-center justify-center gap-2">
        ${updateButton(row.id)}
        ${changePermissionButton(row.id)}
        ${deleteButton(row.id)}
      </div>
    `,
  },
];
