import { useRecoilValue } from "recoil"
import { missingList } from "renderer/atoms"
import { Link } from "react-router-dom"
import { Missing } from "renderer/global"
import { ShowItem } from "../ShowItem"

const MissingList = () => {
  const missing = useRecoilValue<Missing[]>(missingList)
  return (
    <div className="grid grid-cols-2 gap-4 my-4">
      {
        missing.map(show => {
          return (
            <Link className="cursor-pointer" to={`${show}`}>
              <ShowItem key={show.showName} show={show.showName}>
                <p><strong>Missing Episodes:</strong> {show.missing.length}</p>
              </ShowItem>
            </Link>
          )
        })
      }
    </div>
  )
}

export default MissingList