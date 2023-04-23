
import express, { Request, Response } from 'express'
import { authenticate, createHttp1Request } from 'league-connect'
import openai from 'openai'
import AiRouter from './routes/ai';
import dotenv from 'dotenv'

dotenv.config()


const PORT = 6000;
// Create the express app
const app = express()

// Routes and middleware
// app.use(/* ... */)
// app.get(/* ... */)

export const getCredentials =  async () => await authenticate()

export const getAllChamps = async (id:number) => (await createHttp1Request({
  method: 'GET',
  url: `/lol-champions/v1/inventories/${id}/champions-minimal`
}, await getCredentials())).json()

export const getSelectedChamps = async () => {
  try {
    
    const test = await createHttp1Request({
      method: 'GET',
      url:'/lol-champ-select/v1/session'
    }, await getCredentials())
    const { myTeam=null, theirTeam=null } = test.json()
    if(!(myTeam && theirTeam)) return null
    return { myTeam, theirTeam }
  } catch (e) {
    return null
  }
}
export const getMe = async () => (await(await createHttp1Request({
  method: 'GET',
  url: '/lol-summoner/v1/current-summoner'
}, await getCredentials())).json())
export const getSummonerID = async () => {
  try {
    
    const { summonerId }: { summonerId: null | number } = await getMe() as any;
    if (!summonerId) return null
    return summonerId
  } catch (e) {
    return null
  }
}
  

app.use("/ai", AiRouter);
app.get('/me', async (req:Request, res:Response) => {

   const test = await getMe()
  return res.send(test)
})

app.get('/champs', async (req: Request, res: Response) => {
  
  const champs = await getAllChamps(2906466819114816)
  return res.send(champs)
})
app.get('/champ-select/champs', async (req:Request, res:Response) => {

  const selected = await getSelectedChamps()
  
  if (!selected) return res.status(400).send("Player not in champ select")
  return res.send(selected)
})

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server Started on: http://localhost:${PORT}` )
})