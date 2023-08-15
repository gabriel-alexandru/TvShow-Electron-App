import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { AddShowForm, MissingDetailsPage, MissingEpisodes, ShowList } from './pages';
import { NavBar } from './components';
import { RecoilRoot } from 'recoil';

export default function App() {
  return (
    <Router>
      <RecoilRoot>
        <div className="flex flex-row max-h-screen h-screen max-w-screen w-screen bg-slate-200">
          <NavBar />
          <div className="w-5/6 overflow-y-scroll h-full pr-4">
            <Routes>
              <Route path="/" element={<ShowList />} />
              <Route path="/missing-episodes" element={<MissingEpisodes />} />
              <Route path="/missing-episodes/:show" element={<MissingDetailsPage />} />
              <Route path="/add-show" element={<AddShowForm />} />
            </Routes>
          </div>
        </div>
      </RecoilRoot>
    </Router>
  );
}
