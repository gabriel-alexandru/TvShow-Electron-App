import 'dotenv/config'

export class Server {
  private baseUrl: string

  constructor() {
    this.baseUrl = `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}`
  }

  getShows = async () => {
    return await (await fetch(`${this.baseUrl}/shows`)).json()
  }

  addShow = async (body: { show: string, id: string, poster: string}) => {
    const response = await fetch(`${this.baseUrl}/ids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    return response.status === 200 ? 'Ok' : 'Error'
  }
}