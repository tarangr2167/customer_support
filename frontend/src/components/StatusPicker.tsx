import { STATUSES, type TicketStatus } from '../types/ticket';

const STATUS_BTN_CLASS: Record<TicketStatus, string> = {
  Open: 'status-picker__btn--open',
  'In Progress': 'status-picker__btn--progress',
  Closed: 'status-picker__btn--closed',
};

interface StatusPickerProps {
  value: TicketStatus;
  disabled?: boolean;
  onChange: (status: TicketStatus) => void;
}

export function StatusPicker({ value, disabled, onChange }: StatusPickerProps) {
  return (
    <div className="status-picker" role="radiogroup" aria-label="Ticket status">
      {STATUSES.map((status) => {
        const isActive = value === status;
        return (
          <button
            key={status}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={disabled}
            className={`status-picker__btn ${STATUS_BTN_CLASS[status]} ${isActive ? 'status-picker__btn--active' : ''}`}
            onClick={() => {
              if (!isActive) onChange(status);
            }}
          >
            <span className="status-picker__dot" aria-hidden="true" />
            {status}
          </button>
        );
      })}
    </div>
  );
}
