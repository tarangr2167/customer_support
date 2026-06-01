import { PRIORITIES, STATUSES, type TicketPriority, type TicketStatus } from '../types/ticket';

export interface FilterState {
  customerName: string;
  subject: string;
  status: TicketStatus | '';
  priority: TicketPriority | '';
}

interface TicketFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function TicketFilters({ filters, onChange }: TicketFiltersProps) {
  function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="filters">
      <div className="filter-field filter-field--search">
        <label htmlFor="filter-customer">
          <span className="filter-icon" aria-hidden="true">⌕</span>
          Customer name
        </label>
        <input
          id="filter-customer"
          type="search"
          placeholder="Search customers…"
          value={filters.customerName}
          onChange={(e) => update('customerName', e.target.value)}
        />
      </div>

      <div className="filter-field filter-field--search">
        <label htmlFor="filter-subject">
          <span className="filter-icon" aria-hidden="true">⌕</span>
          Subject
        </label>
        <input
          id="filter-subject"
          type="search"
          placeholder="Search subjects…"
          value={filters.subject}
          onChange={(e) => update('subject', e.target.value)}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="filter-status">Status</label>
        <select
          id="filter-status"
          value={filters.status}
          onChange={(e) => update('status', e.target.value as FilterState['status'])}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="filter-priority">Priority</label>
        <select
          id="filter-priority"
          value={filters.priority}
          onChange={(e) => update('priority', e.target.value as FilterState['priority'])}
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
