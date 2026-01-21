import type { FC, JSX } from 'react'
import type { OAuthButtonsProps } from './oauth_buttons_type'
import { Button } from '~/components/ui/button/button'

import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { SiDiscord } from 'react-icons/si'

type ProviderConfig = {
  key: 'google' | 'github' | 'discord' | 'linkedin'
  label: string
  icon: JSX.Element
  buttonClassName: string
}

const providers: ProviderConfig[] = [
  {
    key: 'google',
    label: 'Continue with Google',
    icon: <FcGoogle />,
    buttonClassName:
      'bg-white text-[#DB4437] border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB]',
  },
  {
    key: 'github',
    label: 'Continue with GitHub',
    icon: <FaGithub />,
    buttonClassName: 'bg-[#111827] text-white hover:bg-[#0B1220] border border-[#111827]',
  },
  {
    key: 'discord',
    label: 'Continue with Discord',
    icon: <SiDiscord />,
    buttonClassName: 'bg-[#5865F2] text-white hover:bg-[#4752C4] border border-[#5865F2]',
  },
  {
    key: 'linkedin',
    label: 'Continue with LinkedIn',
    icon: <FaLinkedin />,
    buttonClassName: 'bg-[#0A66C2] text-white hover:bg-[#084E96] border border-[#0A66C2]',
  },
]

export const OAuthButtons: FC<OAuthButtonsProps> = ({ disabled = false }) => {
  return (
    <div className="flex flex-col gap-2">
      {providers.map((provider) => (
        <a
          key={provider.key}
          href={`/auth/${provider.key}/redirect`}
          className={disabled ? 'pointer-events-none opacity-60' : ''}
        >
          <Button
            variant="secondary"
            fullWidth
            disabled={disabled}
            label={provider.label}
            iconLeft={provider.icon}
            type="button"
            className={provider.buttonClassName}
          />
        </a>
      ))}
    </div>
  )
}
