import {
  ChangeEventHandler,
  FocusEventHandler,
  FormEventHandler,
  forwardRef,
} from 'react';
import clx from 'classnames';
import './TextField.css';

export interface TextFieldProps {
  id?: string;
  placeholder?: string;
  defaultValue?: string | number;
  value?: string | number;
  className?: string;
  type?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onInput?: FormEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  dark?: boolean;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id = '',
      placeholder,
      value,
      defaultValue,
      className = '',
      type = 'text',
      onChange,
      onInput,
      onBlur,
      onFocus,
      dark = false,
      ...otherProps
    },
    ref
  ) => {
    const fieldsProps = {
      id,
      placeholder,
      value,
      defaultValue,
      type,
      onChange,
      onInput,
      onBlur,
      onFocus,
      ...otherProps,
    };

    return (
      <div
        className={clx({
          'relative flex flex-row items-center': true,
          [className]: !!className,
        })}
      >
        <input
          ref={ref}
          {...fieldsProps}
          className={clx({
            input: true,
            dark: dark,
          })}
        />
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
