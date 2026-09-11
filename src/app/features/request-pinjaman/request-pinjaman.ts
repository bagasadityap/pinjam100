import { AfterViewInit, Component, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Sidebar } from '../../layouts/sidebar/sidebar';

@Component({
  selector: 'app-request-pinjaman',
  imports: [Sidebar],
  templateUrl: './request-pinjaman.html',
  styleUrl: './request-pinjaman.css',
})
export class RequestPinjaman implements AfterViewInit, OnDestroy {

  private platformId = inject(PLATFORM_ID);
  private table: any;
  private $: any;

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const jquery = (await import('jquery')).default;
    const DataTable = (await import('datatables.net')).default;

    DataTable.use(jquery);

    this.$ = jquery;

    this.table = this.$('#requestTable').DataTable({
      data: [
        ['REQ-20260819-001', 'Bagas Aditya', '1234567890123456', 'Malang', 5000000, '2026-08-19', 'Menunggu'],
        ['REQ-20260819-002', 'Andi Rahman', '3276011201900001', 'Surabaya', 10000000, '2026-08-19', 'Disetujui'],
        ['REQ-20260818-003', 'Dewi Sari', '3578014502900002', 'Malang', 3000000, '2026-08-18', 'Ditolak'],
        ['REQ-20260818-004', 'Rina Wulandari', '3573025501880003', 'Jakarta', 25000000, '2026-08-18', 'Menunggu'],
        ['REQ-20260817-005', 'Fajar Pratama', '3273011003880004', 'Bandung', 7500000, '2026-08-17', 'Disetujui'],
        ['REQ-20260817-006', 'Sinta Maharani', '3578012304900005', 'Malang', 15000000, '2026-08-17', 'Menunggu'],
        ['REQ-20260816-007', 'Rizky Maulana', '3276011802910006', 'Surabaya', 50000000, '2026-08-16', 'Disetujui'],
        ['REQ-20260816-008', 'Nadia Putri', '3174012205950007', 'Jakarta', 4000000, '2026-08-16', 'Ditolak'],
        ['REQ-20260815-009', 'Dimas Saputra', '3573021501900008', 'Bandung', 12000000, '2026-08-15', 'Menunggu'],
        ['REQ-20260815-010', 'Ayu Lestari', '3578011003960009', 'Malang', 8000000, '2026-08-15', 'Disetujui']
      ],
      columns: [
        { title: 'No. Pengajuan' },
        {
          title: 'Nasabah',
          render: (data: string, type: string, row: any[]) => {
            const name = row[1];
            const nik = row[2];
            const initials = name.split(' ').map((word: string) => word[0]).join('').substring(0, 2).toUpperCase();

            return `
              <div class="customer">
                <div class="customer-avatar">${initials}</div>
                <div>
                  <div class="customer-name">${name}</div>
                  <div class="customer-nik">${nik}</div>
                </div>
              </div>
            `;
          }
        },
        {
          title: 'NIK',
          visible: false
        },
        { title: 'Cabang' },
        {
          title: 'Jumlah',
          render: (data: number) => `Rp${data.toLocaleString('id-ID')}`
        },
        {
          title: 'Tanggal',
          render: (data: string) => new Date(data).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
        },
        {
          title: 'Status',
          render: (data: string) => {
            if (data === 'Disetujui') {
              return `<span class="status status-approved"><span></span>Disetujui</span>`;
            }

            if (data === 'Ditolak') {
              return `<span class="status status-rejected"><span></span>Ditolak</span>`;
            }

            return `<span class="status status-pending"><span></span>Menunggu</span>`;
          }
        },
        {
          title: 'Aksi',
          orderable: false,
          searchable: false,
          render: () => `
            <button class="action-button">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
          `
        }
      ],
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50],
      ordering: true,
      searching: true,
      autoWidth: false,
      language: {
        search: '',
        searchPlaceholder: 'Cari pengajuan...',
        lengthMenu: 'Tampilkan _MENU_ data',
        info: 'Menampilkan _START_ sampai _END_ dari _TOTAL_ pengajuan',
        infoEmpty: 'Tidak ada data',
        zeroRecords: 'Data tidak ditemukan',
        emptyTable: 'Belum ada data pengajuan',
        paginate: {
          first: '<<',
          last: '>>',
          next: '>',
          previous: '<'
        }
      }
    });

    this.setupFilters();
  }

  private setupFilters(): void {
    const $ = this.$;

    $('#filterBranch').on('change', () => {
      const branch = $('#filterBranch').val() as string;

      this.table
        .column(3)
        .search(branch)
        .draw();
    });

    $('#filterDate').on('change', () => {
      const date = $('#filterDate').val() as string;

      this.table
        .column(5)
        .search(date)
        .draw();
    });

    $('#filterAmount').on('change', () => {
      const amount = $('#filterAmount').val() as string;

      $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter(
        (filter: any) => filter.name !== 'amountFilter'
      );

      if (amount) {
        const ranges: Record<string, [number, number]> = {
          '1': [0, 5000000],
          '2': [5000000, 10000000],
          '3': [10000000, 25000000],
          '4': [25000000, Infinity]
        };

        const range = ranges[amount];

        const amountFilter = (settings: any, data: string[]) => {
          if (settings.nTable.id !== 'requestTable') {
            return true;
          }

          const value = Number(
            data[4].replace(/[^\d]/g, '')
          );

          return value >= range[0] && value <= range[1];
        };

        Object.defineProperty(amountFilter, 'name', {
          value: 'amountFilter'
        });

        $.fn.dataTable.ext.search.push(amountFilter);
      }

      this.table.draw();
    });

    $('#resetFilter').on('click', () => {
      $('#filterDate').val('');
      $('#filterBranch').val('');
      $('#filterAmount').val('');

      this.table
        .search('')
        .columns()
        .search('')
        .draw();
    });
  }

  ngOnDestroy(): void {
    if (this.table) {
      this.table.destroy();
    }

    if (this.$) {
      this.$('#filterBranch').off('change');
      this.$('#filterDate').off('change');
      this.$('#filterAmount').off('change');
      this.$('#resetFilter').off('click');
    }
  }
}
