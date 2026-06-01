import { SIGNUP_ROLES, type SignupRole } from '../lib/roles';

interface RolePickerProps {
  value: SignupRole;
  onChange: (role: SignupRole) => void;
  error?: string;
}

export function RolePicker({ value, onChange, error }: RolePickerProps) {
  return (
    <div className={`role-picker ${error ? 'role-picker--error' : ''}`}>
      <span className="role-picker__label" id="role-picker-label">
        Account type
      </span>
      <div className="role-picker__options" role="radiogroup" aria-labelledby="role-picker-label">
        {SIGNUP_ROLES.map((role) => {
          const isActive = value === role;
          return (
            <button
              key={role}
              type="button"
              role="radio"
              aria-checked={isActive}
              className={`role-picker__btn role-picker__btn--${role} ${isActive ? 'role-picker__btn--active' : ''}`}
              onClick={() => onChange(role)}
            >
              <span className="role-picker__title">
                {role === 'agent' ? 'Agent' : 'Customer'}
              </span>
            </button>
          );
        })}
      </div>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
