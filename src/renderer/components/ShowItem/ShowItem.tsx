import { FC } from "react"
import { useRecoilValue } from "recoil"
import { showList } from "renderer/atoms"
import { Shows } from "renderer/global"

export interface MissingItemProps {
  show: string
  children: React.ReactElement[] | React.ReactElement
}

const ShowItem: FC<MissingItemProps> = ({ show, children }) => {
  const shows = useRecoilValue<Shows>(showList)
  return (
    <div className="flex">
      <img className="w-1/3 rounded-l-xl shadow-lg shadow-slate-400" src={`https://image.tmdb.org/t/p/original${shows[show].image}`} />
      <div className="bg-white flex flex-col justify-between pl-4 rounded-r-xl w-full shadow-lg shadow-slate-400">
        <h3 className="mt-2 text-2xl font-bold">{show}</h3>
        <div className="mb-2">
          {children}
        </div>
      </div>
    </div>
  )
}

export default ShowItem