import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { ApiError } from '../api/client';
import { createTicket } from '../api/tickets';
import { PRIORITIES, type CreateTicketInput, type TicketPriority } from '../types/ticket';

interface CreateTicketModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateTicketModal({ open, onClose }: CreateTicketModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateTicketInput>({
    customerName: '',
    email: '',
    subject: '',
    priority: 'Medium',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      setForm({ customerName: '', email: '', subject: '', priority: 'Medium' });
      setFieldErrors({});
      onClose();
    },
    onError: (err) => {
      if (err instanceof ApiError && err.details && typeof err.details === 'object') {
        const errors = (err.details as { errors?: Record<string, string> }).errors;
        if (errors) setFieldErrors(errors);
      }
    },
  });

  if (!open) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    mutation.mutate({
      customerName: form.customerName.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      priority: form.priority,
    });
  }

  function updateField<K extends keyof CreateTicketInput>(key: K, value: CreateTicketInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
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
          <div className={`form-field ${fieldErrors.customerName ? 'form-field--error' : ''}`}>
            <label htmlFor="customerName">Customer name</label>
            <input
              id="customerName"
              value={form.customerName}
              onChange={(e) => updateField('customerName', e.target.value)}
            />
            {fieldErrors.customerName && (
              <span className="field-error">{fieldErrors.customerName}</span>
            )}
          </div>

          <div className={`form-field ${fieldErrors.email ? 'form-field--error' : ''}`}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>

          <div className={`form-field ${fieldErrors.subject ? 'form-field--error' : ''}`}>
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              value={form.subject}
              onChange={(e) => updateField('subject', e.target.value)}
            />
            {fieldErrors.subject && <span className="field-error">{fieldErrors.subject}</span>}
          </div>

          <div className={`form-field ${fieldErrors.priority ? 'form-field--error' : ''}`}>
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={form.priority}
              onChange={(e) => updateField('priority', e.target.value as TicketPriority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {fieldErrors.priority && <span className="field-error">{fieldErrors.priority}</span>}
          </div>

          {mutation.isError && Object.keys(fieldErrors).length === 0 && (
            <p className="field-error" role="alert">
              {mutation.error instanceof Error ? mutation.error.message : 'Failed to create ticket'}
            </p>
          )}

          <footer className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating…' : 'Create ticket'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
