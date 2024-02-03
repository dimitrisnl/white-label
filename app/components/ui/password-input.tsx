import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import EyeSlashIcon from '@heroicons/react/24/outline/EyeSlashIcon';
import * as React from 'react';

import {Input} from './input';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    const inputType = showPassword ? 'text' : 'password';

    return (
      <div className="flex items-center space-x-3">
        <Input {...props} ref={ref} type={inputType} />
        <button type="button" onClick={togglePasswordVisibility}>
          {showPassword ? (
            <EyeSlashIcon className="h-4 w-4 text-muted-foreground" />
          ) : (
            <EyeIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export {PasswordInput};
