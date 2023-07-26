import { Link, LinkPropsOptions } from '@tanstack/react-router'
import cx from 'classnames'
import Image from 'next/image';

function NavLink(props: LinkPropsOptions & { text: string; icon?: any; iconOnly?: boolean }) {
  const { text, icon, iconOnly, ...linkProps } = props
  return (
    <Link
      className={cx(
        'rounded-[10px] w-full h-[45px] pl-3 flex flex-row gap-3 items-center shrink-0 break-all',
        iconOnly && 'justify-center',
      )}
      activeOptions={{ exact: true }}
      activeProps={{ className: 'bg-white text-primary-text dark:bg-primary-blue' }}
      inactiveProps={{
        className: 'bg-secondary bg-opacity-20 text-primary-text opacity-80 hover:opacity-100',
      }}
      title={text}
      {...linkProps}
    >
      {icon ? <Image alt="nav" src={icon} className="w-6 h-6 ml-1" /> : (
        <div className="relative inline-flex items-center justify-center min-w-[2rem] min-h-[2rem] overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
         <span className="font-medium text-sm text-gray-600 dark:text-gray-300">{text.slice(0, 2).toUpperCase()}</span>
        </div>
      )}
      {<span className="font-medium text-sm">{iconOnly ? '' : text}</span>}
    </Link>
  )
}

export default NavLink
