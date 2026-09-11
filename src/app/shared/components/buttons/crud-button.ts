export function readButton(id: string): string {
  return `
    <button
      type="button"
      class="
        datatable-read-button
        flex h-8 w-8 items-center justify-center
        rounded-md bg-blue-600 text-white
        transition hover:bg-blue-700
      "
      title="Read"
      data-action="read"
      data-id="${id}"
    >
      <i class="fa-solid fa-eye"></i>
    </button>
  `;
}

export function updateButton(id: string): string {
  return `
    <button
      type="button"
      class="
        datatable-update-button
        flex h-8 w-8 items-center justify-center
        rounded-md bg-yellow-500 text-white
        transition hover:bg-yellow-600
      "
      title="Update"
      data-action="update"
      data-id="${id}"
    >
      <i class="fa-solid fa-pen-to-square"></i>
    </button>
  `;
}

export function changeRoleButton(id: string): string {
  return `
    <button
      type="button"
      class="
        datatable-change-role-button
        flex h-8 w-8 items-center justify-center
        rounded-md bg-lime-500 text-white
        transition hover:bg-lime-600
      "
      title="Change Role"
      data-action="change-role"
      data-id="${id}"
    >
      <i class="fa-solid fa-user-gear"></i>
    </button>
  `;
}

export function changePermissionButton(id: string): string {
  return `
    <button
      type="button"
      class="
        datatable-change-permission-button
        flex h-8 w-8 items-center justify-center
        rounded-md bg-lime-500 text-white
        transition hover:bg-lime-600
      "
      title="Change Permission"
      data-action="change-permission"
      data-id="${id}"
    >
      <i class="fa-solid fa-gear"></i>
    </button>
  `;
}

export function reviewCustomerButton(id: string): string {
  return `
    <button
      type="button"
      class="
        datatable-review-customer-button
        flex h-8 w-8 items-center justify-center
        rounded-md bg-lime-500 text-white
        transition hover:bg-lime-600
      "
      title="Review Customer"
      data-action="review-customer"
      data-id="${id}"
    >
      <i class="fa-solid fa-user-pen"></i>
    </button>
  `;
}

export function reviewApplicationButton(id: string): string {
  return `
    <button
      type="button"
      class="
        datatable-review-application-button
        flex h-8 w-8 items-center justify-center
        rounded-md bg-lime-500 text-white
        transition hover:bg-lime-600
      "
      title="Review Application"
      data-action="review-application"
      data-id="${id}"
    >
      <i class="fa-solid fa-file-pen"></i>
    </button>
  `;
}

export function dibursementApplicationButton(id: string): string {
  return `
    <button
      type="button"
      class="
        datatable-review-application-button
        flex h-8 w-8 items-center justify-center
        rounded-md bg-blue-500 text-white
        transition hover:bg-blue-600
      "
      title="Review Application"
      data-action="review-application"
      data-id="${id}"
    >
      <i class="fa-solid fa-file-pen"></i>
    </button>
  `;
}

export function deleteButton(id: string): string {
  return `
    <button
      type="button"
      class="
        datatable-delete-button
        flex h-8 w-8 items-center justify-center
        rounded-md bg-red-600 text-white
        transition hover:bg-red-700
      "
      title="Delete"
      data-action="delete"
      data-id="${id}"
    >
      <i class="fa-solid fa-trash"></i>
    </button>
  `;
}
