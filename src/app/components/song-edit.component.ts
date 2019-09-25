import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { Song } from '../models/song';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { UploadService } from '../services/upload.service';


@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [UserService, ArtistService, AlbumService, SongService, UploadService]
})

export class SongEditComponent implements OnInit{
    public titulo: string;
    public albumTitle: string;
    public song: Song;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService,
        private _songService: SongService,
        private _uploadService: UploadService
    ){
        this.titulo = 'Editar cancion';
        this.url = GLOBAL.url;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.song = new Song(1, '', '', '', '');
        this.is_edit = true;
    }

    ngOnInit(){
        console.log('Componente song edit cargado');
        this.getSong();
    }

    getSong(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._songService.getSong(this.token, id).subscribe(
                response => {
                    if (!response.song) {
                        this._router.navigate(['/']);
                    }else{
                        this.song = response.song;
                        this.albumTitle = response.song.album.title;
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

    public filesToUpload: Array<File>;    
    fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

    onSubmit(){
        console.log('Componente song add cargado');
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._songService.editSong(this.token, id, this.song).subscribe(
                response => {
                    if (!response.song) {
                        this.alertMessage = 'Error en el servidor';
                    }else{
                        this.alertMessage = 'La canción se ha actualizado correctamente';
                        // Subir el archivo de audio
                        if (!this.filesToUpload) {
                            this._router.navigate(['/album', response.song.album]);
                        }else{
                            this._uploadService.makeFileRequest(this.url + 'upload-file-song/' + id, 
                                                                [],
                                                                this.filesToUpload,
                                                                this.token,
                                                                'file')
                                .then(
                                    (result) => {
                                        this._router.navigate(['/album', response.song.album]);
                                    },
                                    (error) => {
                                        console.log(error);
                                    }
                                );
                            //this.artist = response.artist;
                            // this._router.navigate(['editar-artista', response.artist._id]);
                        }
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
}