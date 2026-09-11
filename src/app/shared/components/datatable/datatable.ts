import {
  afterNextRender,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';

@Component({
  selector: 'app-datatable',
  standalone: true,
  templateUrl: './datatable.html',
  styleUrl: './datatable.css',
})
export class Datatable implements OnChanges, OnDestroy {
  @Input() tableId = 'dataTable';
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Output() action = new EventEmitter<any>();

  private readonly elementRef = inject(ElementRef);
  private table: any;
  private $: any;

  constructor() {
    afterNextRender(async () => {
      await this.initializeTable();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.table) {
      this.table.clear();
      this.table.rows.add(this.data);
      this.table.draw();
    }
  }

  private async initializeTable(): Promise<void> {
    const jquery = (await import('jquery')).default;
    const DataTable = (await import('datatables.net')).default;

    DataTable.use(jquery);

    this.$ = jquery;

    const table = this.elementRef.nativeElement.querySelector(
      `#${this.tableId}`
    );

    if (!table) {
      return;
    }

    this.table = this.$(table).DataTable({
      data: this.data,
      columns: this.columns,
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50],
      ordering: true,
      searching: true,
      autoWidth: false,
      language: {
        search: '',
        searchPlaceholder: 'Cari...',
        lengthMenu: 'Tampilkan _MENU_ data',
        info: 'Menampilkan _START_ sampai _END_ dari _TOTAL_ data',
        infoEmpty: 'Tidak ada data',
        zeroRecords: 'Data tidak ditemukan',
        emptyTable: 'Belum ada data',
        paginate: {
          first: '«',
          last: '»',
          next: '›',
          previous: '‹'
        }
      }
    });

    this.$(table).on(
      'click',
      'button[data-action]',
      (event: any) => {
        event.preventDefault();

        const button = this.$(event.currentTarget);
        const type = button.attr('data-action');
        const id = button.attr('data-id');

        this.action.emit({
          type,
          id
        });
      }
    );

    this.$(table).on(
      'change',
      'input.datatable-status-toggle',
      (event: any) => {
        const input = this.$(event.currentTarget);
        const type = input.attr('data-action');
        const id = input.attr('data-id');

        this.action.emit({
          type,
          id
        });
      }
    );
  }

  ngOnDestroy(): void {
    if (this.table) {
      this.table.destroy();
      this.table = null;
    }
  }
}
