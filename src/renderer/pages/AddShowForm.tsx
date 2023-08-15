import { useEffect, useState } from 'react';
import { Table, TextField, Loading } from 'renderer/components';
import { debounce } from 'renderer/utils';
import { SearchShow, SearchShowResponse } from '../global';

const AddShowForm = () => {
  const [shows, setShows] = useState<SearchShow[]>([]);
  const [localShowName, setLocalShowName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { ipcRenderer } = window.electron;

  useEffect(() => {
    ipcRenderer.on('searchShows', (data) => {
      const response = data as SearchShowResponse;
      setShows(response.results);
    });

    ipcRenderer.on('addShow', (data) => {
      // Mostro un modale
      if (data === 'Ok') {
        // Alla chiusura navigo a /
      } else {
        // Alla chiusura resetto gli stati e rimango sulla pagina
      }
    });
  }, [ipcRenderer]);

  const searchShow = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    if (event.target.value.length > 0) {
      ipcRenderer.sendMessage('searchShows', { search: event.target.value });
    } else {
      setShows([]);
    }
    setLoading(false);
  });

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="top-4 sticky mt-4 w-full gap-x-4">
            <TextField
              placeholder="Local Show Name"
              onChange={(event) => setLocalShowName(event.target.value)}
            />
            <TextField
              placeholder="Search Show"
              onChange={searchShow}
              className="mt-4"
            />
          </div>
          {shows.length > 0 ? (
            <Table
              headers={['Poster', 'Show Name', 'Show Year', 'Action']}
              rows={shows
                .filter((show) => show.poster_path)
                .map((show) => {
                  return {
                    Poster: (
                      <img
                        src={`https://image.tmdb.org/t/p/original${show.poster_path}`}
                        className="w-32"
                      />
                    ),
                    'Show Name': show.name,
                    'Show Year': show.first_air_date.split('-')[0],
                    Action: (
                      <button
                        type="button"
                        onClick={() => {
                          ipcRenderer.sendMessage('addShow', {
                            showName: localShowName,
                            showId: show.id,
                            showPoster: show.poster_path,
                          });
                        }}
                        className="w-full h-10 flex items-center justify-center rounded-full shadow-lg shadow-slate-400 bg-slate-600 text-slate-100 hover:bg-slate-400 transition-colors ease-in-out"
                      >
                        Select
                      </button>
                    ),
                  };
                })}
            />
          ) : (
            <p className="flex items-center justify-center mt-10">
              I have not found any show matching the criteria
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default AddShowForm;
