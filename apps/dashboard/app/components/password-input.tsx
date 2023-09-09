import {Input} from '@white-label/ui-core';
import {EyeIcon, EyeOffIcon} from 'lucide-react';
import * as React from 'react';

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
            <EyeOffIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <EyeIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export {PasswordInput};
