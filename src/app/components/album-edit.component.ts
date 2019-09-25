import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { Album } from '../models/album';
import { UploadService } from '../services/upload.service';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';


@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit{
    public titulo: string;
    public album: Album;
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
        private _uploadService: UploadService
    ){
        this.titulo = 'Editar album';
        this.url = GLOBAL.url;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.album = new Album('','','2017','','');
        this.is_edit = true;
    }

    ngOnInit(){
        // console.log('Componente album edit cargado');
        // Conseguir el album
        this.getAlbum();
    }

    getAlbum(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    if (!response.album) {
                        this._router.navigate(['/']);
                    }else{
                        this.album = response.album;
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
            let id = params['id'];
            this._albumService.editAlbum(this.token, id, this.album).subscribe(
                response => {
                    if (!response.album) {
                        this.alertMessage = 'Error en el servidor';
                    }else{
                        this.alertMessage = 'El album se ha actualizado correctamente';
                        //Subir la imagen de artista
                        if (!this.filesToUpload) {
                            this._router.navigate(['/artista', response.album.artist]);
                        }else{
                            this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + id, 
                                                                [],
                                                                this.filesToUpload,
                                                                this.token,
                                                                'image')
                                .then(
                                    (result) => {
                                        this._router.navigate(['/artista', response.album.artist]);
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
            );
        });        
    }

    public filesToUpload: Array<File>;    
    fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}