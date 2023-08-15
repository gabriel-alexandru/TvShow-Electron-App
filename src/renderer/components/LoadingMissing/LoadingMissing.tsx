import { FC } from "react"

export interface LoadingMissingProps {
  show: string
  percent: number
}

const LoadingMissing: FC<LoadingMissingProps> = ({ show, percent }) => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-full bg-gray-300 rounded-full h-5">
        <div className={`bg-slate-600 h-5 rounded-full transition-all ease-out duration-1000 text-xs font-medium text-slate-100 flex items-center justify-center leading-none`} style={{width: `${percent}%`}}>{percent > 10 ? `${Math.floor(percent)} %` : ''}</div>
        <p className="text-lg pt-4">Checking {show} ...</p>
      </div>
    </div>
  )
}

export default LoadingMissing