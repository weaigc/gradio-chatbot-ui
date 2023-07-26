import { useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image';
import { DEFAULT_CHATBOTS } from '~app/consts'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './Command'
import allInOneIcon from '~/assets/all-in-one.svg'

function CommandBar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const onSelectBot = useCallback(
    (name?: string) => {
      if (name) {
        navigate({ to: '/chat/$name', params: { name } })
      } else {
        navigate({ to: '/' })
      }
      setOpen(false)
    },
    [navigate],
  )

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type to search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          <CommandItem onSelect={() => onSelectBot()}>
            <Image alt="all in one" src={allInOneIcon} className="w-5 h-5 mr-2" />
            <span>All-In-One</span>
          </CommandItem>
          {DEFAULT_CHATBOTS.map((bot) => {
            return (
              <CommandItem key={bot.url} onSelect={onSelectBot} value={bot.name}>
                {/* <Image alt="avatar" src={bot.avatar} className="w-5 h-5 mr-2" /> */}
                <span>{bot.name}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export default CommandBar
