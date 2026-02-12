
export enum BollywoodCategory {
  MOVIES = 'Movies',
  ACTORS = 'Actors',
  SONGS = 'Songs',
  MUSIC_DIRECTORS = 'Music Directors',
  DIRECTORS = 'Directors'
}

export interface EngineResult {
  name: string;
  category: BollywoodCategory;
  timestamp: number;
}
