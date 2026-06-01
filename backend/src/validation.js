export const PRIORITIES = ['Low', 'Medium', 'High'];
export const STATUSES = ['Open', 'In Progress', 'Closed'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCreateTicket(body) {
  const errors = {};
  const customerName = String(body.customerName ?? '').trim();
  const email = String(body.email ?? '').trim();
  const subject = String(body.subject ?? '').trim();
  const priority = String(body.priority ?? '').trim();

  if (!customerName) errors.customerName = 'Customer name is required';
  if (!email) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(email)) errors.email = 'Invalid email address';
  if (!subject) errors.subject = 'Subject is required';
  if (!priority) errors.priority = 'Priority is required';
  else if (!PRIORITIES.includes(priority)) {
    errors.priority = `Priority must be one of: ${PRIORITIES.join(', ')}`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    data: { customerName, email, subject, priority },
  };
}

export function validateStatusUpdate(status) {
  if (!status || !STATUSES.includes(status)) {
    return {
      valid: false,
      error: `Status must be one of: ${STATUSES.join(', ')}`,
    };
  }
  return { valid: true, data: status };
}
