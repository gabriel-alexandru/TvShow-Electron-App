import { Link } from "react-router-dom"
import clx from 'classnames'

const NavBar = () => {
  const routes = [
    {
      path: '',
      name: 'Shows List'
    },
    {
      path: 'missing-episodes',
      name: 'Missing Episodes'
    }
  ]

  return (
    <nav className="w-1/6 flex flex-col min-h-32 h-full justify-evenly border mr-4 bg-slate-600 shadow-xl shadow-slate-600">
      {routes.map((route, index) => <Link key={route.name} className={clx({
        'px-4 w-full h-full flex justify-center items-center text-slate-100 hover:bg-slate-400 transition-colors ease-in-out': true,
        'border-t-2 border-t-slate-100': index !== 0
      })} to={route.path}>{route.name}</Link>)}
    </nav>
  )
}

export default NavBar