import { Link, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { showList, missingList } from 'renderer/atoms';
import moment from 'moment';
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { Shows, Missing, Episode } from 'renderer/global';

const MissingDetailsPage = () => {
  const { show } = useParams();
  const shows = useRecoilValue<Shows>(showList);
  const missing = useRecoilValue<Missing[]>(missingList);

  const groupedEpisodes = {} as { [key: number]: Episode[]};

  missing.find(miss => miss.showName === show)?.missing.forEach((episode) => {
    const { season } = episode;
    console.log(season)
    if (!groupedEpisodes[season]) {
      groupedEpisodes[season] = [];
    }
    groupedEpisodes[season].push(episode);
  });

  return (
    <div className="flex flex-col justify-between h-screen p-4">
      <Link to="/missing-episodes" className="flex items-center w-fit"><ChevronLeftIcon className="h-5 w-5"/> Back</Link>
      <div className="flex h-[95%]">
        <img
          className="w-1/2 rounded-xl shadow-lg shadow-slate-400 max-h-full"
          src={`https://image.tmdb.org/t/p/original${shows[show ?? ''].image}`}
        />
        <div className="ml-4 h-[92%] w-full">
          <h2 className="font-extrabold mb-2 text-4xl">{show}</h2>
          <div className="h-full overflow-y-scroll">
            {
              Object.keys(groupedEpisodes).map(key => {
                console.log(groupedEpisodes, key, groupedEpisodes[Number(key)])
                return (
                  <div>
                    <h3 className="text-xl font-bold">Season {Number(key) < 10 ? `0${key}` : key}</h3>
                    <div>
                      {groupedEpisodes[Number(key)].sort((ep1, ep2) => {
                        if(moment(ep1.air_date).isBefore(moment(ep2.air_date))) return -1
                        else if(moment(ep2.air_date).isBefore(moment(ep1.air_date))) return 1
                        else return 0
                      }).map(episode => <div>{episode.episode_number} - {episode.name}</div>)}
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissingDetailsPage;
