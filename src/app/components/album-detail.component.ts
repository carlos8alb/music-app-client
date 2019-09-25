import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit{
    public album: Album;
    public songs: Song[];
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService,
    ){
        this.url = GLOBAL.url;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.is_edit = true;
    }

    ngOnInit(){
        //llamar al metodo del api para sacar un artista
        this.getAlbum();
    }
    
    getAlbum(){
        console.log('El metodo funciona');
        this._route.params.forEach((params: Params) => {
        let id = params['id'];
            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    if (!response.album) {
                        this._router.navigate(['/']);
                    }else{
                        this.album = response.album;
                        //Sacar las canciones del artista
                        this._songService.getSongs(this.token, response.album._id).subscribe(
                            response => {
                                if (!response.songs) {
                                    this.alertMessage = 'Este album no tiene canciones';
                                }else{
                                    this.songs = response.songs;
                                }
                            },
                            error => {
                                var errorMessage = <any>error;
                                if (errorMessage != null) {
                                var body = JSON.parse(error._body);
                                }
                            }
                        )
                    }
                },
                error => {
                    var errorMessage = <any>error;
                    if (errorMessage != null) {
                    var body = JSON.parse(error._body);
                    }
                }
            )
        });
    }

    public confirmado;
    onDeleteConfirm(id){
        this.confirmado = id;
    }

    onCancelSong(){
        this.confirmado = null;
    }

    onDeleteSong(id){
        this._songService.deleteSong(this.token, id).subscribe(
            response => {
                if (!response.song) {
                    alert('Error en el servidor');
                }else{
                    this.getAlbum();
                }
            },
            error => {
                var errorMessage = <any>error;
                if (errorMessage != null) {
                var body = JSON.parse(error._body);
                }
            }
        );
    }

    startPlayer(song){
        let song_player = JSON.stringify(song);
        let file_path = this.url + 'get-file-song/' + song.file;
        let image_path = this.url + 'get-image-album/' + song.album.image; 
        localStorage.setItem('sound_song', song_player);
        document.getElementById("mp3-source").setAttribute("src", file_path);
        (document.getElementById("player") as any).load();
        (document.getElementById("player") as any).play();
        document.getElementById("play-song-title").innerHTML = song.name;
        document.getElementById("play-song-artist").innerHTML = '| ' + song.album.artist.name;
        document.getElementById("play-image-album").setAttribute("src", image_path);
    }

}