import type { FC } from 'react'
import type { InputProps } from './input_type'

export const Input: FC<InputProps> = ({ label, error, id, ...rest }) => {
  const inputId = id ?? rest.name

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      ) : null}

      <input
        id={inputId}
        className={['input', error ? 'border-danger-600 ring-danger-600/20' : ''].join(' ')}
        {...rest}
      />

      {error ? <p className="error">{error}</p> : null}
    </div>
  )
}
