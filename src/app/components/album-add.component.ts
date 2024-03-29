import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { Album } from '../models/album';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';


@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit{
    public titulo: string;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService
    ){
        this.titulo = 'Crear nuevo album';
        this.url = GLOBAL.url;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.album = new Album('','','2017','','');
    }

    ngOnInit(){
        // console.log('Componente album add cargado');
    }

    onSubmit(){
        this._route.params.forEach((params: Params) => {
            let artist_id = params['artist'];
            this.album.artist = artist_id;
            this._albumService.addAlbum(this.token, this.album).subscribe(
                response => {
                    if (!response.album) {
                        this.alertMessage = 'Error en el servidor';
                    }else{
                        this.alertMessage = 'El album se ha creado correctamente';
                        this.album = response.album;
                        this._router.navigate(['editar-album', response.album._id]);
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