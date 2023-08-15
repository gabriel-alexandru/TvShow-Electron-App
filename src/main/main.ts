/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { format, resolveHtmlPath } from './util';
import moment from 'moment';
import { MovieDB } from './moviedb';
import { Server } from './server';

const movieDb = new MovieDB()
const server = new Server()

ipcMain.on('getShows', async (event, args) => {
  event.reply('getShows', await server.getShows())
})

ipcMain.on('searchShows', async (event, args) => {
  event.reply('searchShows', await movieDb.searchTv(args.search))
})

ipcMain.on('addShow', async (event, args) => {
  event.reply('addShow', await server.addShow({
    show: args.showName,
    id: args.showId,
    poster: args.showPoster
  }))
})

ipcMain.on('getMissingEpisodes', async (event, args) => {
  const { show, showName } = args
  const result = [] as {
    name: string
    air_date: string
    episode_number: string
    season: number
  }[]

  const dbShow = await movieDb.getShowDetails(show.id)
  if(dbShow === 'Error') {
    event.reply('getMissingEpisodes', { status: 'error', result: result, showName: showName })
    return
  }
  const { seasons: dbSeasons } = dbShow
  const dbEpisodes = {} as { [ key: string ]: any }
  for(const season of dbSeasons) {
    if(season.air_date && moment(season.air_date).isSameOrBefore(moment(), 'day')) dbEpisodes[`Season ${format(season.season_number)}`] = await getDbEpisodes(show.id, season.season_number)
  }

  const seasonsNumbers = Object.keys(show).filter(key => key.startsWith('Season'))
  const dbSeasonsNumbers = Object.keys(dbEpisodes).filter(key => key.startsWith('Season') && key !== 'Season 00')
  const missingSeasons = dbSeasonsNumbers.filter(season => !seasonsNumbers.includes(season));
  missingSeasons.forEach(missing => result.push(dbEpisodes[missing]))


  dbSeasonsNumbers.forEach(seasonNumber => {
    const dbEpisodesNumbers = Object.keys(dbEpisodes[seasonNumber])
    const missingEpisodes = dbEpisodesNumbers.filter(episodeNumber => !show[seasonNumber].includes(episodeNumber));
    missingEpisodes.forEach(episode => {
      result.push(dbEpisodes[seasonNumber][episode])
    })
  })
  event.reply('getMissingEpisodes', { status: 'complete', result: result, showName: showName })
})

async function getDbEpisodes(showId: string, seasonNumber: number) {
  const result = {} as { [ key: string ]: any }
  const season = await movieDb.getSeasonDetails(showId, seasonNumber)
  if(season === 'Error') return result
  const { episodes } = season
  episodes.filter((episode: any) => moment(episode.air_date).isSameOrBefore(moment(), 'day')).forEach((episode: any) => {
    result[`Episode ${format(episode.episode_number)}`] = {
      name: episode.name,
      air_date: episode.air_date,
      episode_number: `Episode ${format(episode.episode_number)}`,
      season: seasonNumber,
    }
  })
  return result
}

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    resizable: false,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
