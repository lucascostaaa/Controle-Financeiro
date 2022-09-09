import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CategoriasService } from 'src/app/services/categorias.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MatPaginator}  from '@angular/material/paginator';
import { MatSort}  from '@angular/material/sort';
import { MatSnackBar}  from '@angular/material/snack-bar';

@Component({
  selector: 'app-listagem-categorias',
  templateUrl: './listagem-categorias.component.html',
  styleUrls: ['./listagem-categorias.component.scss']
})
export class ListagemCategoriasComponent implements OnInit {

  categorias = new MatTableDataSource<any>();
  displayedColumns: string[];
  autoCompleteInput = new FormControl();
  opcoesCategorias : string[] = [];
  nomesCategorias: Observable<string[]>;

  @ViewChild(MatPaginator, {static: true})
  paginator : MatPaginator;

  @ViewChild(MatSort, {static: true})
  sort : MatSort;

  constructor(private categoriasService: CategoriasService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.categoriasService.PegarTodos().subscribe(resultado => {
      resultado.forEach(categoria => {
        this.opcoesCategorias.push(categoria.nome);
      });

      this.categorias.data = resultado;
      this.categorias.paginator = this.paginator;
      this.categorias.sort = this.sort;
    })

    this.displayedColumns = this.ExibirColunas();

    this.nomesCategorias = this.autoCompleteInput.valueChanges.pipe(startWith(''), map(nome => this.FiltrarNomes(nome)));
  }

  ExibirColunas(): string[]{
    return ['nome', 'icone', 'tipo', 'acoes']
  }

  AbrirDialog(categoriaId: any, nome: any): void{
    this.dialog.open(DialogExlusaoCategoriasComponent, {
      data:{
        categoriaId: categoriaId,
        nome: nome
      }
    }).afterClosed().subscribe(resultado =>{
      if(resultado == true)
      {
        this.categoriasService.PegarTodos().subscribe(dados => {
          this.categorias.data = dados;
        });

        this.displayedColumns = this.ExibirColunas(); 
      }
    });
  }

  FiltrarNomes(nome: string): string[]{
    if(nome.trim().length >= 4){
      this.categoriasService.FiltrarCategoria(nome.toLowerCase()).subscribe(resultado => {
        this.categorias.data = resultado;
      });
    }
    else {
      if(nome == '')
      {
        this.categoriasService.PegarTodos().subscribe(resultado => {
          this.categorias.data = resultado;
        });
      }
    }

    return this.opcoesCategorias.filter(categoria => {
      categoria.toLowerCase().includes(nome.toLowerCase());
    });
  }
}
@Component({
  selector: 'app-dialog-exclusao-categorias',
  templateUrl: 'dialog-exclusao-categorias.html'
})
export class DialogExlusaoCategoriasComponent{
  constructor(@Inject (MAT_DIALOG_DATA) public dados: any,
  private categoriasService: CategoriasService,
  private snackBar: MatSnackBar){}

    ExcluirCategoria(categoriaId: number): void{
      this.categoriasService.ExcluirCategoria(categoriaId).subscribe(resultado => {
        this.snackBar.open(resultado.mensagem, "", {
          duration: 2000, 
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      });
    }
}

