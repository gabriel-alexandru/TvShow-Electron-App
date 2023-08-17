import { createRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { showList } from 'renderer/atoms';
import { Loading, ShowItem, TextField } from 'renderer/components';
import { Shows } from 'renderer/global';
import { debounce } from 'renderer/utils';

const ShowList = () => {
  const [shows, setShows] = useRecoilState<Shows>(showList);
  const [showsKeys, setShowsKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const inputRef = createRef<HTMLInputElement>();
  const { ipcRenderer } = window.electron;

  useEffect(() => {
    ipcRenderer.sendMessage('getShows');
    ipcRenderer.on('getShows', (data) => {
      setShows(data as Shows);
      setLoading(false);
    });
  }, [ipcRenderer]);

  useEffect(() => {
    setShowsKeys(Object.keys(shows));
  }, [shows]);

  const filterKeys = debounce((event: React.ChangeEvent<HTMLInputElement>) =>
    event.target.value.length > 0
      ? setShowsKeys(
          Object.keys(shows).filter((key) => {
            if (shows[key].id) {
              return (
                key.includes(event.target.value) ||
                shows[key].id.includes(event.target.value)
              );
            } else {
              return key.includes(event.target.value);
            }
          })
        )
      : setShowsKeys(Object.keys(shows))
  );

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="top-4 sticky mt-4 grid grid-cols-5 gap-x-4">
            <TextField
              placeholder="Search"
              ref={inputRef}
              className="col-span-4"
              onChange={filterKeys}
            />
            <Link
              to="add-show"
              className="col-span-1 flex items-center justify-center rounded-full shadow-lg shadow-slate-400 bg-slate-600 text-slate-100 hover:bg-slate-400 transition-colors ease-in-out"
            >
              Add Show
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4">
            {showsKeys.map(
              (show) => {
                const keys = Object.keys(shows[show]).filter(key => key.startsWith('Season'))
                const seasons = keys.length
                let episodes = 0
                keys.forEach((key: string) => episodes += (shows[show][key] as string[]).length)
                return shows[show].image && (
                  <ShowItem key={show} show={show}>
                    <p><strong>Total Seasons:</strong> {seasons ?? 0}</p>
                    <p><strong>Total Episodes:</strong> {episodes ?? 0}</p>
                    <p><strong>TheMovieDB ID:</strong> {shows[show].id}</p>
                  </ShowItem>
                )
              }
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ShowList;
