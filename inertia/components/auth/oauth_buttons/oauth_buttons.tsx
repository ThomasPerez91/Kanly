import type { FC, JSX } from 'react'
import type { OAuthButtonsProps } from './oauth_buttons_type'
import { Button } from '~/components/ui/button/button'

import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiDiscord } from 'react-icons/si'
import { FcGoogle } from 'react-icons/fc'

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
    icon: <FcGoogle size={18} />,
    buttonClassName:
      'bg-white text-[#DB4437] border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB]',
  },
  {
    key: 'github',
    label: 'Continue with GitHub',
    icon: <FaGithub size={18} />,
    buttonClassName: 'bg-[#111827] text-white border border-[#111827] hover:bg-[#0B1220]',
  },
  {
    key: 'discord',
    label: 'Continue with Discord',
    icon: <SiDiscord size={18} />,
    buttonClassName: 'bg-[#5865F2] text-white border border-[#5865F2] hover:bg-[#4752C4]',
  },
  {
    key: 'linkedin',
    label: 'Continue with LinkedIn',
    icon: <FaLinkedin size={18} />,
    buttonClassName: 'bg-[#0A66C2] text-white border border-[#0A66C2] hover:bg-[#084E96]',
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
            variant="oauth"
            fullWidth
            disabled={disabled}
            label={provider.label}
            iconLeft={provider.icon}
            type="button"
            className={provider.buttonClassName}
            elevated
          />
        </a>
      ))}
    </div>
  )
}
