export interface Pokemon {
  species: {
    name: string
    url: string
  }
  sprites: {
    front_default: string
    back_default: string
  }
}

export interface Species {
  flavor_text_entries: {
    flavor_text: string
    language: {
      name: string
      url: string
    }
    version: {
      name: string
      url: string
    }
  }[]
}
