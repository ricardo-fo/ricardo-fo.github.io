// Comunicação com o 'Local Storage' do navegador.
class Storage {
	constructor(id){
		this._id = id;

		let valor = localStorage.getItem(this._id);
		if(valor === null){
			localStorage.setItem(this._id, 0);
		}
	}

	// Retorna o id atual.
	get id(){
		return this._id;
	}

	// Muda o valor do id atual.
	set id(idNovo){
		this._id = idNovo;
	}

	// Retorna atual do id.
	getValor(){
		return localStorage.getItem(this._id);
	}

	// Muda o valor do id atual para um novo.
	setValor(novoValor){
		localStorage.setItem(this._id, novoValor);
	}
}

// Instância da classe Storage para:
// Controle do idioma atual
let idioma = new Storage('id_idioma');
// Controle da página atual
//let pagina = new Storage('id_pagina');

// Verificação se a página atual é a correta
//pagina.setValor(getPaginaAtual());

// Carregamento do menu baseado no idioma selecionado
mudarIdioma(idioma.getValor());

/* Função que retorna o id, no formato numérico (para comunicação com o
 * 'Local Storage'), da página atual. */
/*
function getPaginaAtual(){
	let pagAtual = $('body').attr('id');
	let idPagAtual = 0;

	switch(pagAtual){
		case 'body-home':
			idPagAtual = '0';
			break;
		case 'body-sobre':
			idPagAtual = '1';
			break;
		case 'body-competencias':
			idPagAtual = '2';
			break;
		case 'body-projetos':
			idPagAtual = '3';
			break;
		case 'body-contato':
			idPagAtual = '4';
			break;
	}
	return idPagAtual;
}

*/
/* Função para troca de idioma da página */
function mudarIdioma(id_idioma){
	idioma.setValor(id_idioma);
	carregarMenu(idioma.getValor());
	carregarHome(idioma.getValor());
	if(idioma.getValor() == '0'){
		$('.caixa-idiomas .botao:first').addClass('ativo');
		$('.caixa-idiomas .botao:last').removeClass('ativo');
	} else {
		$('.caixa-idiomas .botao:last').addClass('ativo');
		$('.caixa-idiomas .botao:first').removeClass('ativo');
	}
}

function carregarMenu(id){
	if(id == '0'){
		var arquivo = 'menu_portugues.json';
	} else {
		var arquivo = 'menu_english.json';
	}

	let xmlHttp = new XMLHttpRequest();
	xmlHttp.open('GET', `http://localhost/portfolio/json/idiomas/${arquivo}`);

	// Leitura dos estados da requisição.
	xmlHttp.onreadystatechange = () => {

		// Caso a requisição seja bem-sucedida.
		if(xmlHttp.readyState == 4 && xmlHttp.status == 200){

			// Vinculação de uma variável com a string contendo o JSON.
			let JSONMenu = xmlHttp.responseText;
			let objJSON = JSON.parse(JSONMenu);

			for(let i in objJSON.menu){
				let navegacoes = objJSON.menu[i].navegacoes;

				// Percorrendo navegacoes
				for(let j in navegacoes){
					let navegacao = navegacoes[j];

					// Percorrendo navegacao
					for(let k in navegacao){
						// Pegando dados do arquivo JSON
						let texto_hover = navegacao[k][0].texto_hover;
						let id = '#' + navegacao[k][1].id;

						$(`${id} span`).html(texto_hover);
					}
				}

				let sociais = objJSON.menu[i].sociais;
				// Percorrendo redes sociais
				for(let j in sociais){
					let social = sociais[j];

					// Percorrendo navegacao
					for(let k in social){
						// Pegando dados do arquivo JSON
						let texto_hover = social[k][0].texto_hover;
						let id = '#' + social[k][1].id;

						$(`${id} span`).html(texto_hover);
					}
				}
			}
		}

		if(xmlHttp.readyState == 4 && xmlHttp.status == 404){
			// ...
		}
	}

	xmlHttp.send();
}

function carregarHome(id){
	if(id == '0'){
		var arquivo = 'inicio.json';
	} else {
		var arquivo = 'home.json';
	}

	let xmlHttp = new XMLHttpRequest();
	xmlHttp.open('GET', `http://localhost/portfolio/json/idiomas/${arquivo}`);

	// Leitura dos estados da requisição.
	xmlHttp.onreadystatechange = () => {

		// Caso a requisição seja bem-sucedida.
		if(xmlHttp.readyState == 4 && xmlHttp.status == 200){

			// Vinculação de uma variável com a string contendo o JSON.
			let JSONMenu = xmlHttp.responseText;
			let objJSON = JSON.parse(JSONMenu);

			for(let i in objJSON.home){
				let conteudos = objJSON.home[i];
				//console.log(conteudos);

				// Percorrendo conteúdos das tags
				for(let j in conteudos){
					// Pegando dados do arquivo JSON
					let texto = conteudos[j][0].texto;
					let id = '#' + conteudos[j][1].id;
					let classe = '.' + conteudos[j][2].classe;

					$(`${id} ${classe}`).html(texto);
				}
			}
		}

		if(xmlHttp.readyState == 4 && xmlHttp.status == 404){
			// ...
		}
	}

	xmlHttp.send();
}

function ativarBotao(id) {
	let ids = ['#home', '#sobre', '#competencias', '#projetos', '#contato'];
	for(let i in ids){
		if($(ids[i]).hasClass('ativo')){
			$(ids[i]).addClass('link');
			$(ids[i]).removeClass('ativo');
			break;
		}
	}
	$(id).removeClass('link');
	$(id).addClass('ativo');
}

// Indicador de página atual
$(document).ready(() => {
	var secoes = $('article');

	$(window).scroll(function (){
		var scrollAtual = $(this).scrollTop();
		var secaoAtual;

		secoes.each(function() {
			var posicaoDiv = $(this).offset().top;
			if(posicaoDiv - 1 < scrollAtual){
				secaoAtual = $(this);
			}
			$('.barra-menu a').attr('class', 'link');

			var id = secaoAtual.attr('id');
			id = '#' + id.replace('secao-', '');
			$(`.barra-menu ${id}`).attr('class', 'ativo');
		});
	});
});
