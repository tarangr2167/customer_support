import { useState, type FormEvent } from 'react';
import { PRIORITIES, type Ticket, type TicketPriority } from '../types/ticket';

interface CreateTicketModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (ticket: Omit<Ticket, 'id' | 'status' | 'createdAt'>) => void;
}

export function CreateTicketModal({ open, onClose, onCreate }: CreateTicketModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  function validate() {
    const next: Record<string, string> = {};
    if (!customerName.trim()) next.customerName = 'Required';
    if (!email.trim()) next.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Invalid email';
    if (!subject.trim()) next.subject = 'Required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onCreate({ customerName: customerName.trim(), email: email.trim(), subject: subject.trim(), priority });
    setCustomerName('');
    setEmail('');
    setSubject('');
    setPriority('Medium');
    setErrors({});
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-labelledby="create-ticket-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <div>
            <h2 id="create-ticket-title">New ticket</h2>
            <p>Log a new customer support request</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <form className="modal__form" onSubmit={handleSubmit} noValidate>
          <div className={`form-field ${errors.customerName ? 'form-field--error' : ''}`}>
            <label htmlFor="customerName">Customer name</label>
            <input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            {errors.customerName && <span className="field-error">{errors.customerName}</span>}
          </div>

          <div className={`form-field ${errors.email ? 'form-field--error' : ''}`}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className={`form-field ${errors.subject ? 'form-field--error' : ''}`}>
            <label htmlFor="subject">Subject</label>
            <input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            {errors.subject && <span className="field-error">{errors.subject}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <footer className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Create ticket
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
