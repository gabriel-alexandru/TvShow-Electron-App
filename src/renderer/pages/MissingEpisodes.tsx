import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { showList, missingList } from "renderer/atoms";
import { LoadingMissing, MissingList } from "renderer/components";
import { Missing, MissingEpisodesResponse, Shows } from "renderer/global";

const MissingEpisodes = () => {

  const { ipcRenderer } = window.electron;
  const shows = useRecoilValue<Shows>(showList)
  const [currentShow, setCurrentShow] = useState<number>(0)
  const [missing, setMissing] = useRecoilState<Missing[]>(missingList)

  const showNames = Object.keys(shows).sort((a, b) => {
    if(a.toLowerCase() < b.toLowerCase()) return -1
    else if(a.toLowerCase() > b.toLowerCase()) return 1
    else return 0
  })

  useEffect(() => {
    setMissing([])
  }, [])

  useEffect(() => {
    ipcRenderer.on('getMissingEpisodes', (data) => {
      const response = data as MissingEpisodesResponse
      if(response.status === 'complete') {
        if(response.result.length > 0) {
          setMissing(current => [...current, { showName: response.showName, missing: response.result }])
        }
        setCurrentShow((value) => value + 1)
      }
    });
  }, [ipcRenderer])

  useEffect(() => {
    const showName = showNames[currentShow]
    if(showName) ipcRenderer.sendMessage('getMissingEpisodes', { show: shows[showName], showName: showName });
  }, [ipcRenderer, currentShow]);

  return (
    <div className="h-screen">
      {
        currentShow < showNames.length ? 
        <LoadingMissing show={showNames[currentShow]} percent={currentShow * 100 / showNames.length}/> : 
        missing.length > 0 ? <MissingList /> : <div className="flex h-full items-center justify-center"><p>Nothing to see here. There are no missing episodes!</p></div>
      }
    </div>
  )
}

export default MissingEpisodes