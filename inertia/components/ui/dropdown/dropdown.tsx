import type { FC } from 'react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'

import type { DropdownPlacement, DropdownProps } from './dropdown_type'
import { DropdownContext } from './dropdown_context'

const getPlacementClasses = (placement: DropdownPlacement) => {
  switch (placement) {
    case 'bottom-start':
      return 'left-0'
    case 'bottom-end':
    default:
      return 'right-0'
  }
}

export const Dropdown: FC<DropdownProps> = ({
  trigger,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-end',
  widthClassName = 'w-64',
  panelClassName,
}) => {
  const dropdownId = useId()
  const rootRef = useRef<HTMLDivElement | null>(null)

  const isControlled = typeof open === 'boolean'
  const [internalOpen, setInternalOpen] = useState(defaultOpen)

  const isOpen = isControlled ? Boolean(open) : internalOpen

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  const close = () => setOpen(false)

  const panelPlacementClass = useMemo(() => getPlacementClasses(placement), [placement])

  // Animation states
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true)
      // next frame => allow transition
      requestAnimationFrame(() => setIsVisible(true))
    } else {
      setIsVisible(false)
      // unmount after transition
      const t = window.setTimeout(() => setIsMounted(false), 160)
      return () => window.clearTimeout(t)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const onDocMouseDown = (e: MouseEvent) => {
      const el = rootRef.current
      if (!el) return
      if (el.contains(e.target as Node)) return
      close()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }

    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  const onTriggerClick = () => setOpen(!isOpen)

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        onClick={onTriggerClick}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        className="inline-flex"
      >
        {trigger}
      </button>

      {isMounted ? (
        <div
          id={dropdownId}
          role="menu"
          className={[
            'absolute top-full mt-2',
            panelPlacementClass,
            widthClassName,
            'max-w-[calc(100vw-24px)]',
            'dropdown-panel dropdown-anim',
            isVisible ? 'dropdown-enter' : 'dropdown-leave',
            panelClassName ?? '',
          ].join(' ')}
        >
          <DropdownContext.Provider value={{ close }}>
            {children}
          </DropdownContext.Provider>
        </div>
      ) : null}
    </div>
  )
}
