import { MessageTypes } from "../../../server/MessageTypes";
import { artists } from "../../lib/stores/artists";
import { app } from "../App";
import type { Artist } from "./Artist";
import { LocalArtist } from "./LocalArtist";
import { RemoteArtist } from "./RemoteArtist";

export class ArtistManager {
    public remoteArtists: Array<Artist> = []
    public localArtist: Artist = new LocalArtist("local", "#FFFFFF")

    constructor() {
        artists.subscribe(console.log)
    }

    public addListeners() {
        app.connection.addMessageListener((message) => {
            if (message.type === MessageTypes.OnClientConnected)
                this.addRemoteArtist(new RemoteArtist(message.body.id, message.body.color))
        })
        app.connection.addMessageListener((message) => {
            if (message.type === MessageTypes.OnClientDisconected)
                this.removeRemoteArtist(new RemoteArtist(message.body.id, message.body.color))
        })
        app.connection.addMessageListener((message) => {
            if (message.type === MessageTypes.GetCurrentState)
                this.addRemoteArtists(message.body.clients.map(artistData => new RemoteArtist(artistData.id, artistData.color)))
        })
        app.connection.addMessageListener((message) => {
            if (message.type === MessageTypes.OnSelfConnected) {
                this.localArtist.id = message.body.id
                this.localArtist.color = message.body.color
            }
        })
    }

    public addRemoteArtist(artist: Artist) {
        this.removeRemoteArtist(artist)
        this.remoteArtists.push(artist)
        artists.set(this.remoteArtists)
    }

    public addRemoteArtists(artists: Array<Artist>) {
        artists.forEach(artist => {
            this.addRemoteArtist(artist)
        })
    }

    public removeRemoteArtist(artist: Artist) {
        this.remoteArtists = this.remoteArtists.filter(a => {
            if (a.id === artist.id) {
                artist.destroy()
                return false
            }
            return true
        })
        artists.set(this.remoteArtists)
    }
}