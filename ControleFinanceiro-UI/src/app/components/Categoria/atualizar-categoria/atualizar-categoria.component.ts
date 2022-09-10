import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Categoria } from 'src/app/models/Categoria';
import { Tipo } from 'src/app/models/Tipo';
import { CategoriasService } from 'src/app/services/categorias.service';
import { TiposService } from 'src/app/services/tipos.service';
import { MatSnackBar} from '@angular/material/snack-bar'

@Component({
  selector: 'app-atualizar-categoria',
  templateUrl: './atualizar-categoria.component.html',
  styleUrls: ['../listagem-categorias/listagem-categorias.component.scss']
})
export class AtualizarCategoriaComponent implements OnInit {
nomeCategoria: string;  
categoriaId: number; 
categoria : Observable<Categoria>;
tipos : Tipo[];
erros: string [];
formulario: any;
  constructor(private router : Router,
    private route: ActivatedRoute,
    private tiposService: TiposService,
    private categoriasService: CategoriasService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.erros = [];
    this.categoriaId = this.route.snapshot.params['id'];
    this.tiposService.PegarTodos().subscribe(resultado => {
      this.tipos = resultado;
    });

    this.categoriasService.PegarCategoriaPeloId(this.categoriaId).subscribe(resultado => {
      this.nomeCategoria = resultado.nome;
      this.formulario = new FormGroup({
        categoriaId: new FormControl(resultado.categoriaId),
        nome: new FormControl(resultado.nome, [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ]),
        icone: new FormControl(resultado.icone, [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
        ]),
        tipoId: new FormControl(resultado.tipoId, [Validators.required]),
      });
    });
  }

  get propriedade(){
    return this.formulario.controls;
  }

  EnviarFormulario(): void{
    const categoria = this.formulario.value;
    this.erros = [];
    this.categoriasService.AtualizarCategoria(this.categoriaId, categoria).subscribe(resultado =>{
      this.router.navigate(['categorias/listagemcategorias']);
      this.snackBar.open(resultado.mensagem, "", {
        duration: 2000, 
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    },
    (err) => {
      if (err.status === 400)
        for (const campo in err.error.errors) {
          if (err.error.errors.hasOwnProperty(campo)) {
            this.erros.push(err.error.errors[campo]);
          }
        }
    });
  }

  VoltarListagem(){
    this.router.navigate(['categorias/listagemcategorias']);
  }

}
