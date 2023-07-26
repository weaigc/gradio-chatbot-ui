import { FC } from 'react'
import { Link } from '@tanstack/react-router'

const AddMore: FC<{ text: string }> = ({ text }) => {
  return (
    <Link to="/setting">
      <div
        className="flex flex-row justify-center items-center gap-[10px] rounded-[10px] px-4 py-[6px] cursor-pointer"
        style={{
          background:
            'linear-gradient(275deg, rgb(var(--color-primary-purple)) 1.65%, rgb(var(--color-primary-blue)) 100%)',
        }}
      >
        {!!text && <span className="text-white font-semibold text-base">{text}</span>}
      </div>
    </Link>
  )
}

export default AddMore
