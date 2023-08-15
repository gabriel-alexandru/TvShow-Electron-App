import 'dotenv/config'
export class MovieDB {

  private authorization: string
  private baseUrl: string

  constructor() {
    this.authorization = `Bearer ${process.env.MOVIEDB_API_KEY}`
    this.baseUrl = 'https://api.themoviedb.org/3'
  }

  searchTv = async (search: string) => {
    const url = new URL(`${this.baseUrl}/search/tv`)
    url.searchParams.set('query', search)
    const response = await fetch(url, {
      headers: {
        'Authorization': this.authorization
      }
    })

    if(response.status === 200) return await response.json()
    else {
      console.log(response)
      return 'Error'
    }
  }

  getShowDetails = async (showId: string) => {
    const url = new URL(`${this.baseUrl}/tv/${showId}`)
    const response = await fetch(url, {
      headers: {
        'Authorization': this.authorization
      }
    })

    if(response.status === 200) return await response.json()
    else {
      console.log('Error')
      return 'Error'
    }
  }

  getSeasonDetails = async (showId: string, seasonNumber: number) => {
    const url = new URL(`${this.baseUrl}/tv/${showId}/season/${seasonNumber}`)
    const response = await fetch(url, {
      headers: {
        'Authorization': this.authorization
      }
    })

    if(response.status === 200) return await response.json()
    else {
      console.log('Error')
      return 'Error'
    }
  }
}