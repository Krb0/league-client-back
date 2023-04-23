export function formatTeam (
  team: Team,
  champs: Champ[],
  mySummonerId: number
): SimplifiedPick[] {
  const getChampName = (id: number) => champs.find(champ => champ.id == id)

  return team.map(player => ({
    champ: getChampName(player.championId)?.name || 'Not Selected Yet',
    rol: player?.assignedPosition || 'Unknown',
    isMe: player.summonerId === mySummonerId
  }))
}
export function formatTeamDescriptionText (team: SimplifiedPick[]): string {
  return team.reduce(
    (acc, player) =>
      acc +
      `- ${player.isMe ? 'My ' : ''}Champion: ${player.champ} | ${
        player.isMe ? 'My ' : ''
      }Position: ${player.rol}\n`,
    ''
  )
}

export function getChampSelectAIMessage(teams:Teams,champs:Champ[],summonerID:number) {
    const formattedMyTeam = formatTeam(teams.myTeam, champs, summonerID)
    const formattedTheirTeam = formatTeam(teams.theirTeam, champs, summonerID)
  
    const msg = `
    I'm playing League of Legends. The match has has the following composition:

    My Team:
      ${formatTeamDescriptionText(formattedMyTeam)}
    Their Team:
      ${formatTeamDescriptionText(formattedTheirTeam)}


    Provide me a Jungler to play for my team to counter against the current enemy team.
    Also Provide me an explanation on how should I play againts every of the already revealed champions`
    return msg    
}

export type Team = Player[]
export type Teams = { myTeam: Team; theirTeam: Team }
export interface Player {
  assignedPosition: string
  cellId: number
  championId: number
  championPickIntent: number
  entitledFeatureType: string
  nameVisibilityType: string
  obfuscatedPuuid: string
  obfuscatedSummonerId: number
  puuid: string
  selectedSkinId: number
  spell1Id: number
  spell2Id: number
  summonerId: number
  team: number
  wardSkinId: number
}
export interface SimplifiedPick {
  champ: string | null
  rol: string | null
  isMe: boolean
}
export interface Champ {
  active: boolean
  alias: string
  banVoPath: string
  baseLoadScreenPath: string
  baseSplashPath: string
  botEnabled: boolean
  chooseVoPath: string
  freeToPlay: false
  id: number
  name: string
  purchased: number
  rankedPlayEnabled: false
  roles: string[]
  squarePortraitPath: string
  stingerSfxPath: string
  title: string
}
