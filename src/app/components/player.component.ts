import { Component, OnInit } from "@angular/core";
import { Song } from "../models/song";
import { GLOBAL } from "../services/global";

@Component({
    selector: 'player',
    templateUrl: '../views/player.html'
})

export class PlayerComponent implements OnInit{
    public url: string;
    public song;

    constructor(){
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Player cargado');
        var song = JSON.parse(localStorage.getItem('sound_song'));
        if (song) {
            this.song = song;
        }else{
            this.song = new Song(1, '', '', '', '');
        }
    }


}