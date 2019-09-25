import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { Song } from '../models/song';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';


@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService, ArtistService, AlbumService, SongService]
})

export class SongAddComponent implements OnInit{
    public titulo: string;
    public albumTitle: string;
    public song: Song;
    public identity;
    public token;
    public url: string;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService,
        private _songService: SongService
    ){
        this.titulo = 'Crear nueva cancion';
        this.url = GLOBAL.url;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.song = new Song(1, '', '', '', '');
    }

    ngOnInit(){
        console.log('Componente song add cargado');
        this._route.params.forEach((params: Params) => {
            let album_id = params['album'];
            this._albumService.getAlbum(this.token, album_id).subscribe(
                response => {
                    if (!response.album) {
                        this.alertMessage = 'Error en el servidor';
                    }else{
                        this.albumTitle = response.album.title;
                        console.log(response.album);
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

    onSubmit(){
        this._route.params.forEach((params: Params) => {
            let album_id = params['album'];
            this.song.album = album_id;
            console.log(this.song);
            this._songService.addSong(this.token, this.song).subscribe(
                response => {
                    if (!response.song) {
                        this.alertMessage = 'Error en el servidor';
                    }else{
                        this.alertMessage = 'La canción se ha creado correctamente';
                        this.song = response.song;
                        this._router.navigate(['editar-tema', response.song._id]);
                    }
                },
                error => {
                    var errorMessage = <any>error;
                    if (errorMessage != null) {
                    var body = JSON.parse(error._body);
                    }
                }
            );
        });        
    }
}