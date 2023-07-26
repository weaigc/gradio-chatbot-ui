import { FC, PropsWithChildren } from 'react'

const PagePanel: FC<PropsWithChildren<{ title: string, footer: React.ReactNode }>> = (props) => {
  return (
    <div className="flex flex-col overflow-hidden bg-primary-background dark:text-primary-text rounded-[20px] h-full">
      <div className="text-center border-b border-solid border-primary-border flex flex-col justify-center mx-10 py-3">
        <span className="font-semibold text-lg">{props.title}</span>
      </div>
      <div className="px-10 h-full overflow-auto">{props.children}</div>
      <div className="text-center border-t border-solid border-primary-border">
        {props.footer}
      </div>
    </div>
  )
}

export default PagePanel
