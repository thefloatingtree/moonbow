import { artists } from "../../lib/stores/artists";
import { Artist } from "./Artist";

export class ArtistManager {
    public artists: Array<Artist> = []

    constructor() {
        artists.subscribe(console.log)
    }

    public addArtist(data: { id: string, color: string }) {
        const artist = new Artist(data.id, data.color)
        this.artists.push(artist)
        artists.set(this.artists)
    }

    public addArtists(data: Array<{ id: string, color: string }>) {
        data.forEach(artistData => {
            if (this.artists.find(artist => artist.id === artistData.id)) return
            this.addArtist(artistData)
        })
    }

    public removeArtist(data: { id: string }) {
        const index = this.artists.findIndex(artist => artist.id === data.id)
        if (index === -1) return
        this.artists.splice(index, 1)
        artists.set(this.artists)
    }
}