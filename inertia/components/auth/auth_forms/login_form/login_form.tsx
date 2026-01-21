import type { FC, FormEvent } from 'react'
import { useState } from 'react'

import { Input } from '~/components/ui/input/input'
import { Button } from '~/components/ui/button/button'
import { OAuthButtons } from '~/components/auth/oauth_buttons/oauth_buttons'

import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { useAction } from '~/hooks/utils/use_action'
import { loginAction } from '~/actions/auth/login'

import type { InputType } from '~/actions/auth/login/type'
import type { LoginFormProps } from './login_form_type'

export const LoginForm: FC<LoginFormProps> = ({ onSuccessRedirectTo }) => {
  const { csrfToken } = useAuthUser()

  const [values, setValues] = useState<InputType>({
    email: '',
    password: '',
  })

  const { execute, fieldErrors, error, isLoading } = useAction(loginAction(csrfToken), {
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
        <h2 className="h2">Welcome back</h2>
        <p className="muted">Sign in to your workspace</p>
      </div>

      <div className="flex flex-col gap-4">
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
          autoComplete="current-password"
          value={values.password}
          onChange={(e) => setValues((s) => ({ ...s, password: e.target.value }))}
          error={fieldErrors?.password?.[0]}
        />

        {error ? <p className="text-sm text-danger-600">{error}</p> : null}

        <Button type="submit" fullWidth loading={isLoading} label="Sign in" />
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
