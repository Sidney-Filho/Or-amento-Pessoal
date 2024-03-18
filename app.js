class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.tipo = tipo
    this.descricao = descricao
    this.valor = valor
  }

  validarDados() {
    for(let i in this) {
      if(this[i] == undefined || this[i] == '' || this[i] == null) {
        return false
      }
    }
    return true
  }
}

class Bd {

  constructor() {
    let id = localStorage.getItem('id')

    if(id === null) {
      localStorage.setItem('id', 0)
    }
  }

  getProximoId() {
    let proximoId = localStorage.getItem('id')
    return parseInt(proximoId) + 1
  }

  gravar(d) {
    let id = this.getProximoId()

    localStorage.setItem(id, JSON.stringify(d))

    localStorage.setItem('id', id)
  }

  recuperarTodosRegistros() {

    //array de despesas
    let despesas = Array()

    let id = localStorage.getItem('id')

    //recupera todas as despesas em localStorage
    for(let i = 1; i <= id; i++) {
      //recuperar a despesa
      let despesa = JSON.parse(localStorage.getItem(i))
      
      //existe a possibilidade de haver índices que foram pulados ou removidos
      //neste casso vamos pular esses índices
      if(despesa === null) {
        //pula para proxima iteração do laço antes de efetuar o push no array
        continue
      }

      despesa.id = i
      despesas.push(despesa)
    }
    return despesas
  }

  pesquisar(despesa) {

    let despesasFiltradas = Array()
    despesasFiltradas = this.recuperarTodosRegistros()

    console.log(despesa)
    console.log(despesasFiltradas)

    if(despesa.ano != '') {
      despesasFiltradas = despesasFiltradas.filter(d  => d.ano == despesa.ano)
    }

    if(despesa.mes != '') {
      despesasFiltradas = despesasFiltradas.filter(d  => d.mes == despesa.mes)
    }

    if(despesa.dia != '') {
      despesasFiltradas = despesasFiltradas.filter(d  => d.dia == despesa.dia)
    }

  if(despesa.tipo != '') {
    despesasFiltradas = despesasFiltradas.filter(d  => d.tipo == despesa.tipo)
  }

  if(despesa.valor != '') {
    despesasFiltradas = despesasFiltradas.filter(d  => d.valor == despesa.valor)
  }

    return despesasFiltradas

  }

  remover(id) {
    localStorage.removeItem(id)
  }
}

let bd = new Bd()

function cadastrarDespesa() {
  let ano = document.getElementById('ano')
  let mes = document.getElementById('mes')
  let dia = document.getElementById('dia')
  let tipo = document.getElementById('tipo')
  let descricao = document.getElementById('descricao')
  let valor = document.getElementById('valor')

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  )

  if(despesa.validarDados()) {
    bd.gravar(despesa)
    ano.value = ''
    mes.value = ''
    dia.value = ''
    tipo.value = ''
    descricao.value = ''
    valor.value = ''

    var titleModal = document.getElementById('exampleModalLabel')
    titleModal.innerText = 'Sucesso na gravação!'

    let modalHeader = document.getElementById('divModalHeader')
    modalHeader.className = 'modal-header text-success'

    var textModal = document.getElementById('dialogModal')
    textModal.innerText = 'Despesa Registrada com sucesso!'
    
    let btnModal = document.getElementById('buttonModal')
    btnModal.className = 'btn btn-success'
    btnModal.innerText = 'Voltar'

    let meuModal = new bootstrap.Modal(document.getElementById('modalRegistraDespesa'))
    meuModal.show();

  } else {

    var titleModal = document.getElementById('exampleModalLabel')
    titleModal.innerText = 'Erro na inclusão do registro!'

    var modalHeader = document.getElementById('divModalHeader')
    modalHeader.className = 'text-danger modal-header'

    var textModal = document.getElementById('dialogModal')
    textModal.innerText = 'Existem campos obrigatórios que não foram preenchidos!'

    var btnModal = document.getElementById('buttonModal')
    btnModal.className = 'btn btn-danger'
    btnModal.innerText = 'Voltar e corrigir'

    let meuModal = new bootstrap.Modal(document.getElementById('modalRegistraDespesa'))
    meuModal.show();
  }
  
}


function carregaListaDespesas(despesas = Array() , filtro = false) {

  if(despesas.length == 0 && filtro == false) {
    despesas = bd.recuperarTodosRegistros()
  }

  //seleciona o tbody da tabela
  let listaDespesas = document.getElementById('listaDespesas')
  listaDespesas.innerHTML = ''

  //percorre o array despesas, listando cada despesa de forma dinâmica
  despesas.forEach(function(d) {

    //cria a linha (tr)
    let linha = listaDespesas.insertRow()

    //criar as colunas (td)
    linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes} / ${d.ano}`
    
    //ajustar o tipo
    switch (d.tipo) {
      case '1':
        d.tipo = 'Alimentação'
        break;
      case '2':
        d.tipo = 'Educação'
        break;
      case '3':
        d.tipo = 'Lazer'
        break;
      case '4':
        d.tipo = 'Saúde' 
        break;    
      case '5':
        d.tipo = 'Transporte' 
        break; 
    }

    linha.insertCell(1).innerHTML = d.tipo
    linha.insertCell(2).innerHTML = d.descricao
    linha.insertCell(3).innerHTML = d.valor

    let btnDelete = document.createElement('button')
    btnDelete.className = 'btn btn-danger'
    btnDelete.innerHTML = '<i class="fas fa-times"></i>'
    btnDelete.id = `id_despesa_${d.id}`
    btnDelete.onclick = function() {
      //remover despesa

     var titleModal = document.getElementById('exampleModalLabel')
     titleModal.innerText = 'Sucesso ao remover!'

     let modalHeader = document.getElementById('divModalHeader')
     modalHeader.className = 'modal-header text-danger'

     var textModal = document.getElementById('dialogModal')
     textModal.innerText = 'Despesa Removida com sucesso!'
    
      let btnModal = document.getElementById('buttonModal')
      btnModal.className = 'btn btn-danger'
      btnModal.innerText = 'Voltar'
      let meuModal = new bootstrap.Modal(document.getElementById('modalRegistraDespesa'))
      meuModal.show();
      btnModal.addEventListener('click', function() {
        window.location.reload()
      })

      let id = this.id.replace('id_despesa_', '')
      bd.remover(id)
    }
    linha.insertCell(4).append(btnDelete)

    console.log(d)
  })
}

function pesquisarDespesa() {
  let ano = document.getElementById('ano').value
  let mes = document.getElementById('mes').value
  let dia = document.getElementById('dia').value
  let tipo = document.getElementById('tipo').value
  let descricao = document.getElementById('descricao').value
  let valor = document.getElementById('valor').value

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
  let despesas = bd.pesquisar(despesa)

  carregaListaDespesas(despesas, true)
}