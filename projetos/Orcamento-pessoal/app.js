// Classe com os atributos permitidos no cadastro.
class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano;
		this.mes = mes;
		this.dia = dia;
		this.tipo = tipo;
		this.descricao = descricao;
		this.valor = valor;
	}

	validarDados() {
		// Esta função verifica se todos os campos estão preenchidos
		// this faz referência para a própria despesa, pegando todos os atributos, sem o valor
		for(let i in this) {
			// this[i] é o valor do atributo i
			if(this[i] == undefined || this[i] == '' || this[i] == null){
				return false;
			}
		}
		return true;
	}
}

// Classe que controla a comunicação com o Local Storage.
class Bd {
	constructor() {
		// pega o último id.
		let id = localStorage.getItem('id');

		// caso id seja igual a null, então está é a primeira inserção.
		if(id === null) {
			// inclusão do primeiro id, valor igual a zero.
			localStorage.setItem('id', 0);
		}
	}

	getProximoId() {
		// função que pega o último id cadastrado em Local Storage e soma 1 ao seu valor.
		let proximoId = localStorage.getItem('id');
		return parseInt(proximoId) + 1;
	}

	gravar(d) {
		// procedimento que pega o próximo id e grava ele em Local Storage.
		// pega o próximo id.
		let id = this.getProximoId();

		// grava o novo id com o JSON da despesa.
		localStorage.setItem(id, JSON.stringify(d));

		// atualiza o id antigo.
		localStorage.setItem('id', id);
	}

	recuperarTodosRegistros() {
		// função que recupera todas as despesas salvas em Local Storage
		// array de despesas
		let despesas = Array();
 
		let id = localStorage.getItem('id');

		// Recuparação de todas as despesas cadastradas em Local Storage
		for(let i = 1; i <= id; i++) {
			// recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(i));
			
			if(despesa === null) {
				continue;
			}

			despesa.id = i;
			console.log(despesa);
			despesas.push(despesa);
		}
		return despesas;
	}

	pesquisar(despesa) {
		let despesasFiltradas = Array();
		despesasFiltradas = this.recuperarTodosRegistros();

		// busca pelo ano
		if(despesa.ano != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);	
		}

		// busca pelo mes
		if(despesa.mes != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);	
		}

		// busca pelo dia
		if(despesa.dia != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);	
		}

		// busca pelo tipo
		if(despesa.tipo != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);	
		}

		// busca pelo descricao
		if(despesa.descricao != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);	
		}

		// busca pelo valor
		if(despesa.valor != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);	
		}

		return despesasFiltradas;
	}

	remover(id) {
		// procedimento que remove uma despesa
		localStorage.removeItem(id);
	}
}

let bd = new Bd();

// procedimento que as informações do cadastro e grava-as no Local Storage.
function cadastrarDespesa() {
	let ano = document.getElementById('ano');
	let mes = document.getElementById('mes');
	let dia = document.getElementById('dia');
	let tipo = document.getElementById('tipo');
	let descricao = document.getElementById('descricao');
	let valor = document.getElementById('valor');

	// Objeto com os atributos com os valores do cadastro.
	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value, 
		valor.value
	);

	if(despesa.validarDados()) {
		// SUCESSO
		bd.gravar(despesa);

		// Mudar a cor do botão
		mudarCorAviso('btnCor', 'btn-success', 'btn-danger');

		// Mudar a cor do texto
		mudarCorAviso('textoCor', 'text-success', 'text-danger');

		// Mudar o título do texto
		mudarTextoAviso('tituloAviso', 'Registro inserido com sucesso');

		// Mudar texto
		mudarTextoAviso('textoAviso', 'Despesa foi cadastrada com sucesso!');

		// Utilização de JQuery para exibir o modal do Bootstrap
		$('#modalRegistraDespesa').modal('show');

		// Resetar campos de inserção
		// let elemento = document.getElementById('btnCor');
		// elemento.setAttribute('onclick', 'location.reload();');
		ano.value = '';
		mes.value = '';
		dia.value = '';
		tipo.value = '';
		descricao.value = '';
		valor.value = '';
	} else {
		// ERRO
		// Mudar a cor do botão
		mudarCorAviso('btnCor', 'btn-danger', 'btn-success');

		// Mudar a cor do texto
		mudarCorAviso('textoCor', 'text-danger', 'text-success');

		// Mudar o título do texto
		mudarTextoAviso('tituloAviso', 'Erro ao inserir registro');

		// Mudar texto
		mudarTextoAviso('textoAviso', 'Preencha todos os campos obrigatórios!');

		// Utilização de JQuery para exibir o modal do Bootstrap
		$('#modalRegistraDespesa').modal('show');
	}
}

function mudarCorAviso(id, adicionar, remover) {
	// Captura do elemento HTML.
	let elemento = document.getElementById(id);

	// Tentativa de busca pela classe informada.
	let existe = elemento.classList.contains(adicionar);

	// Verificação se a classe existe.
	if(!existe) {
		// Remoção a classe anterior.
		elemento.classList.remove(remover);
	}
	// Adição da nova classe.
	elemento.classList.add(adicionar);
}

function mudarTextoAviso(id, novo_valor) {
	// Procedimento que modifica o valor dos textos do aviso
	document.getElementById(id).innerHTML = novo_valor;
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
	if(despesas.length == 0 && filtro == false) {
		// caso não queira buscar, apenas mostrar todas as despesas
		despesas = bd.recuperarTodosRegistros();	
	}

	// manipulação do elemento HMTL que contém a tabela que exibirá as despesas.
	let listaDespesas = document.getElementById('listaDespesas');
	// limpa as linhas da tabela.
	listaDespesas.innerHTML = '';
	
	// percorrendo cada elemento do array despesas.
	despesas.forEach(function(d) {
		// criação de uma linha <tr>
		let linha = listaDespesas.insertRow();

		// criação de colunas <td>
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
		
		// ajuste do tipo
		switch(d.tipo) {
			case '1':
				d.tipo = 'Alimentação';
				break;
			case '2':
				d.tipo = 'Educação';
				break;
			case '3':
				d.tipo = 'Lazer';
				break;
			case '4':
				d.tipo = 'Saúde';
				break;
			case '5':
				d.tipo = 'Transporte';
		}
		linha.insertCell(1).innerHTML = d.tipo;
		linha.insertCell(2).innerHTML = d.descricao;
		linha.insertCell(3).innerHTML = d.valor;

		// botão de exclusão
		let btn = document.createElement("button");
		btn.className = 'btn btn-danger';
		btn.innerHTML = '<i class="fas fa-times"></i>';
		btn.id = `id_despesa_${d.id}`;
		btn.onclick = function() { // remover a despesa
			let id = this.id.replace('id_despesa_', '');
			bd.remover(id);
			window.location.reload();
		}
		linha.insertCell(4).append(btn);
	});
}

function pesquisarDespesa() {
	// procedimento que recupera os dados da pesquisa
	let ano = document.getElementById('ano').value;
	let mes = document.getElementById('mes').value;
	let dia = document.getElementById('dia').value;
	let tipo = document.getElementById('tipo').value;
	let descricao = document.getElementById('descricao').value;
	let valor = document.getElementById('valor').value;

	// criação de um objeto com os dados da pesquisa
	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
	
	// recuperação dos objetos que dão match com as pesquisas passadas.
	let despesas = bd.pesquisar(despesa);

	carregaListaDespesas(despesas, true);
}