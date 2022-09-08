import { Component, OnInit } from '@angular/core';
import { Tipo } from 'src/app/models/Tipo';
import { TiposService } from 'src/app/services/tipos.service';
import { FormGroup, FormControl } from '@angular/forms';
import { CategoriasService } from 'src/app/services/categorias.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nova-categoria',
  templateUrl: './nova-categoria.component.html',
  styleUrls: ['../listagem-categorias/listagem-categorias.component.scss']
})
export class NovaCategoriaComponent implements OnInit {

formulario: any;
tipos : Tipo[];

  constructor(private tiposService: TiposService,
    private categoriasService: CategoriasService,
    private router: Router) { }

  ngOnInit(): void {
    this.tiposService.PegarTodos().subscribe(resultado => {
      this.tipos = resultado;
    });

    this.formulario = new FormGroup({
      nome: new FormControl(null),
      icone: new FormControl(null),
      tipoId: new FormControl(null),
    });
  }
  
  get propriedade() {
    return this.formulario.control;
  }
  EnviarFormulario() : void {
    const categoria = this.formulario.value;

    this.categoriasService.NovaCategoria(categoria).subscribe((resultado) =>{
      this.router.navigate(['categorias/listagemcategorias']);
    });
  }
}