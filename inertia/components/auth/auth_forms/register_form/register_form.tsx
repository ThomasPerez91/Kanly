import type { FC, FormEvent } from 'react'
import { useState } from 'react'

import { Input } from '~/components/ui/input/input'
import { Button } from '~/components/ui/button/button'
import { OAuthButtons } from '~/components/auth/oauth_buttons/oauth_buttons'

import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { useAction } from '~/hooks/utils/use_action'
import { registerAction } from '~/actions/auth/register'

import type { InputType } from '~/actions/auth/register/type'
import type { RegisterFormProps } from './register_form_type'

export const RegisterForm: FC<RegisterFormProps> = ({ onSuccessRedirectTo }) => {
  const { csrfToken } = useAuthUser()

  const [values, setValues] = useState<InputType>({
    fullName: '',
    email: '',
    password: '',
    password_verify: '',
  })

  const { execute, fieldErrors, error, isLoading } = useAction(registerAction(csrfToken), {
    onSuccess: () => {
      if (onSuccessRedirectTo) window.location.href = onSuccessRedirectTo
    },
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    execute(values)
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 w-full max-w-md">
      <div className="mb-6">
        <h2 className="h2">Create your account</h2>
        <p className="muted">Start organizing your work</p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="Full name / Pseudo"
          name="fullName"
          value={values.fullName}
          onChange={(e) => setValues((s) => ({ ...s, fullName: e.target.value }))}
          error={fieldErrors?.fullName?.[0]}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => setValues((s) => ({ ...s, email: e.target.value }))}
          error={fieldErrors?.email?.[0]}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={(e) => setValues((s) => ({ ...s, password: e.target.value }))}
          error={fieldErrors?.password?.[0]}
        />

        <Input
          label="Confirm password"
          name="password_verify"
          type="password"
          autoComplete="new-password"
          value={values.password_verify}
          onChange={(e) => setValues((s) => ({ ...s, password_verify: e.target.value }))}
          error={fieldErrors?.password_verify?.[0]}
        />

        {error ? <p className="text-sm text-danger-600">{error}</p> : null}

        <Button type="submit" fullWidth loading={isLoading} label="Create account" />
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="divider" />
        <span className="muted whitespace-nowrap">or</span>
        <div className="divider" />
      </div>

      <OAuthButtons disabled={isLoading} />
    </form>
  )
}
