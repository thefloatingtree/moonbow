import { artists } from "../../lib/stores/artists";
import type { Artist } from "./Artist";
import { LocalArtist } from "./LocalArtist";
import { RemoteArtist } from "./RemoteArtist";

export class ArtistManager {
    public artists: Array<Artist> = []

    constructor() {
        // artists.subscribe(console.log)
    }
    
    public addArtist(artist: Artist) {
        this.removeArtist(artist)
        this.artists.push(artist)
        artists.set(this.artists)
    }

    public addArtists(artists: Array<Artist>) {
        artists.forEach(artist => {
            this.addArtist(artist)
        })
    }

    public removeArtist(artist: Artist) {
        this.artists = this.artists.filter(a => {
            if (a.id === artist.id) {
                artist.destroy()
                return false
            }
            return true
        })
        artists.set(this.artists)
    }
}