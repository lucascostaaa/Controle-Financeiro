using ControleFinanceiro.BLL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleFInanceiro.DAL.Interfaces
{
    public interface ICategoriaRepository : IRepositorioGenerico<Categoria>
    {
        new IQueryable<Categoria> PegarTodos();
        new Task<Categoria> PegarPeloId(int id);

        IQueryable<Categoria> FiltraCategorias(string nomeCategoria);
    }
}
