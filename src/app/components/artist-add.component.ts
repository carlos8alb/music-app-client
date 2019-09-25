import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';

@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit{
    public title: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ){
        this.title = 'Crear nuevo artista';
        this.url = GLOBAL.url;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.artist = new Artist('','','');
    }

    ngOnInit(){
        //conseguir el listado de artistas
    }

    onSubmit(){
        console.log(this.artist);
        this._artistService.addArtist(this.token, this.artist).subscribe(
            response => {
                if (!response.artist) {
                    this.alertMessage = 'Error en el servidor';
                }else{
                    this.alertMessage = 'El artista se ha creado correctamente';
                    this.artist = response.artist;
                    this._router.navigate(['editar-artista', response.artist._id]);
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

}