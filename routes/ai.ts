import { Request, Response, Router } from 'express'
import { getAllChamps, getSelectedChamps, getSummonerID } from '..'
import { Champ, Teams, getChampSelectAIMessage } from '../lib/ai'
import { Configuration, OpenAIApi } from 'openai';


const AiRouter = Router()

AiRouter.get('/champ-select', champSelectController)

async function champSelectController (req: Request, res: Response) {
  console.log(process.env.OPENAI_API_KEY)
  const summonerID = await getSummonerID()
  if (!summonerID) return res.status(400).send('Summoner ID not found')
  const champs = (await getAllChamps(summonerID)) as unknown as Champ[]
  if (!champs) return res.status(400).send('Champions List not found')
  const teams = (await getSelectedChamps()) as Teams
  if (!teams) return res.status(400).send('User is not in a Champion Selection')

  const msg = getChampSelectAIMessage(teams, champs, summonerID)

  const responseAI = await getAIResponse(msg)
  return res.send(responseAI)
}

export default AiRouter


const getAIResponse = async (msg: string) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { "role": "user", "content": msg }
    ]
  })

  return response.data.choices[0].message?.content || 'No Response was given'
} 