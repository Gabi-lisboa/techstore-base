import { useState } from 'react'
import { Link, useParams } from 'react-router'

export default function PaginaProduto({ produtos, onAdicionar, onRegistrarInteresse }) {
  const { id } = useParams()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagemEspera, setMensagemEspera] = useState('')
  const produto = produtos.find((item) => item.id === id)

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const esgotado = Number(produto.estoque) === 0
  const relacionados = produtos
    .filter((item) => item.category === produto.category && item.id !== produto.id && Number(item.estoque) > 0)
    .slice(0, 4)

  function handleInteresse(evento) {
    evento.preventDefault()

    if (!nome.trim() || !email.trim()) {
      setMensagemEspera('Preencha nome e e-mail para receber o aviso.')
      return
    }

    onRegistrarInteresse({ produtoId: produto.id, nome: nome.trim(), email: email.trim() })
    setNome('')
    setEmail('')
    setMensagemEspera('Você foi adicionado à lista de espera deste produto.')
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">R$ {produto.price.toFixed(2).replace('.', ',')}</p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">
            {esgotado ? 'Produto esgotado no momento' : `${produto.estoque} unidades disponíveis`}
          </p>

          {!esgotado && (
            <button
              className="botao botao-grande"
              onClick={() => onAdicionar(produto)}
              disabled={produto.estoque === 0}
            >
              Adicionar ao carrinho
            </button>
          )}

          {esgotado && (
            <form className="aviso-form" onSubmit={handleInteresse}>
              <label className="rotulo" htmlFor="nome-aviso">
                Nome
              </label>
              <input
                id="nome-aviso"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                placeholder="Seu nome"
              />

              <label className="rotulo" htmlFor="email-aviso">
                E-mail
              </label>
              <input
                id="email-aviso"
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                placeholder="seu@email.com"
              />

              <button className="botao botao-grande" type="submit">
                Avise-me quando voltar
              </button>
              {mensagemEspera && <p className="mensagem-espera">{mensagemEspera}</p>}
            </form>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">R$ {Number(item.price).toFixed(2).replace('.', ',')}</p>
            <button className="botao" onClick={() => onAdicionar(item)}>
              Adicionar ao carrinho
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
