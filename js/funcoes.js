// Comunicação com o 'Local Storage' do navegador.
class Storage {
	/* Valores possíveis para o atributo id:
	 * 0: indica que o idioma deve ser o português-br;
	 * 1: indica que o idioma deve ser o inglês-us. */
	constructor(id){
		this._id = id;

		let valor = localStorage.getItem(this._id);
		if(valor === null){
			localStorage.setItem(this._id, 0);
		}
	}

	// Retorna o id atual.
	get id(){
		return localStorage.getItem(this._id);
	}

	// Muda o valor do id atual.
	set id(idNovo){
		// Verificação se o valor passado é válido, i.e. é ou 0 ou 1;
		if(idNovo == 0 || idNovo == 1){
			localStorage.setItem(this._id, idNovo);
		} else {
			throw new Error(RangeError);
		}
	}
}

// Instância da classe Storage para controle do idioma atual
let idioma = new Storage('id_idioma');

// Carregamento do menu baseado no idioma selecionado
mudarIdioma(idioma.id);

/* Função para troca de idioma da página */
function mudarIdioma(id_idioma){
	// Troca o id do idioma
	//console.log(id_idioma);
	idioma.id = id_idioma;

	// Recarrega a página com o novo idioma
	carregarMenu(id_idioma);
	carregarHome(id_idioma);

	// Muda o botão ativo
	if(idioma.id == '0'){
		// Português
		$('#btn-idioma div a:first').addClass('active');
		$('#btn-idioma div a:last').removeClass('active');
	} else {
		// Inglês
		$('#btn-idioma div a:last').addClass('active');
		$('#btn-idioma div a:first').removeClass('active');
	}
}

function carregarMenu(id){
	if(id == '0'){
		var arquivo = 'menu_portugues.json';
	} else {
		var arquivo = 'menu_english.json';
	}

	let xmlHttp = new XMLHttpRequest();
	xmlHttp.open('GET', `http://ricardooliveira.ga/json/idiomas/${arquivo}`);

	// Leitura dos estados da requisição.
	xmlHttp.onreadystatechange = () => {

		// Caso a requisição seja bem-sucedida.
		if(xmlHttp.readyState == 4 && xmlHttp.status == 200){

			// Vinculação de uma variável com a string contendo o JSON.
			let JSONMenu = xmlHttp.responseText;
			let objJSON = JSON.parse(JSONMenu);			

			// Todas as tags HTML onde o texto do arquivo .json será inserido
			let tags = $('#links .item .texto');
			let i = 0;

			// Passagem dos conteúdo do arquivo .json para as tags HTML
			// Links do menu de navegação
			for(let j in objJSON.menu){
				let texto = objJSON.menu[j].navegacao.texto;
				$(tags[i]).text(texto);
				i++;
			}

			// Mudança do idioma para tags span para leitores de tela
			tags = $('.nav-menu span.sro');
			i = 0;
			for(let j in objJSON.menu){
				let sr_only = objJSON.menu[j].navegacao;
				for(let k in sr_only){
					let texto = sr_only[k].texto;
					if(typeof texto === 'undefined') continue;
					$(tags[i]).text(texto);
					i++;
				}
			}
		}

		if(xmlHttp.readyState == 4 && xmlHttp.status == 404){
			throw "Erro ao requisitar arquivo via AJAX.";
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
	xmlHttp.open('GET', `http://ricardooliveira.ga/json/idiomas/${arquivo}`);
    
    // Leitura dos estados da requisição.
	xmlHttp.onreadystatechange = () => {

		// Caso a requisição seja bem-sucedida.
		if(xmlHttp.readyState == 4 && xmlHttp.status == 200){

			// Vinculação de uma variável com a string contendo o JSON.
			let JSONMenu = xmlHttp.responseText;
			let objJSON = JSON.parse(JSONMenu);			

			// Passagem dos conteúdo do arquivo .json para as tags HTML
			for(let j in objJSON.home){
				let texto = objJSON.home[j];
				let largura = $('.terminal').width();
				let hifen = '-';
				let i = 0;
				while(i < largura / 11){
					hifen += '-';
					i++;
				}
				$('.usuario span.before-link').html(`<br>${hifen}<br><br>${texto[0].prepend}`);
				$('.usuario span.after-link').html(`${texto[1].append}<br><br>${hifen}`);
				$('button.botao').html(texto[2].botao);
			}
		}

		if(xmlHttp.readyState == 4 && xmlHttp.status == 404){
			throw "Erro ao requisitar arquivo via AJAX.";
		}
	}

	xmlHttp.send();	
}


$(document).ready(() => {
	// Indicador da página atual
	// Captura de todas as páginas com a tag article
	var secoes = $('main').find('section.secao');

	// Captura dos eventos de scroll ocorridos na tela
	$(window).scroll(function (){
		// Distância entre o scroll atual até o topo da página
		var scrollAtual = $(this).scrollTop();
		var secaoAtual;

		// Laço percorrendo todas as tags article
		secoes.each(function() {
			// Posição do elemento atual até o topo
			var posicaoDiv = $(this).offset().top;
			// Verificação se o elemento atual é menor que o scroll
			if(posicaoDiv - ($(window).attr('innerHeight') / 8) < scrollAtual){
				secaoAtual = $(this);
			}

			// Mudança do link ativo
			if(typeof secaoAtual !== 'undefined'){
				var id = secaoAtual.attr('id');
				id = '#' + 'link-' + id;

				// Remove o antigo link ativo
				$('#links .ativo').removeClass('ativo');

				// Cria o novo link ativo
				$(id).addClass('ativo');
			}
		});
	});

	// Mudar idioma
	$('#btn-idioma div a').on('click', e => {
		// Captura do valor do evento disparado
		if(e.target.attributes.value !== undefined){

			// Captura do valor em forma de tipo primitivo e chamada da função de troca de idioma
			let id_idioma = e.target.attributes.value.value;
			mudarIdioma(id_idioma);
		}
	});

	// Efeito hover dos botões do menu
	// Mouse com o cursor sobre o link
	let mouseEnter = function() {
		if(!( $(this).find('a').hasClass('ativo') )){
			$(this).addClass('ativo');	
		}
	}

	// Mouse com o cursor fora do link
	let mouseLeave = function() {
		if(!( $(this).find('a').hasClass('ativo') )){
			$(this).removeClass('ativo');	
		}
	}

	$('#links .item').hover(mouseEnter, mouseLeave);

	/* Espaçamento superior da seção home */
	let height = $('.nav-menu').height();
	$('section.home').css({
		'padding-top': `${height + 20}px`,
		'height': `calc(100vh - ${height})`
	});

	$('section.secao').not(':first').css({
		'padding-top': height,
		'height': `calc(100vh - ${height})`
	});

	/* Efeito de digitação da home page */
	let mensagem = Array();
	if(idioma.id == '0'){
		mensagem.push("./saudacoes");
	} else {
		mensagem.push("./saudacoes");
	}
	$('.conheca').fadeOut(0);

	function typeWriter(texto, i, callBack) {
		if(i < texto.length){
			$('#texto-digitado').html(texto.substring(0, i + 1) + '<span aria-hidden="true"></span>');

			setTimeout(() => {
				typeWriter(texto, i + 1, callBack);
			}, 100);
		} else if(typeof callBack == 'function') {
			setTimeout(callBack, 700);
		}
	} 

	function startTextAnimation(i) {
		if(typeof mensagem[i] == 'undefined') {
			$('.hidden').css('display', 'inline');
			$('#texto-digitado').removeClass('cursor');
			$('.conheca').fadeIn(1000);
			return;
		}
		if(i < mensagem[i].length) {
			typeWriter(mensagem[i], 0, () => {
				startTextAnimation(i + 1);
			});
		}
	}
	startTextAnimation(0);

	/* Página Competências */
	// Mostrar e esconder de habilidades
	$('#competencias .lista-habilidades .corpo').slideUp();
	$('#competencias .habilidades .lista-habilidades .corpo:first').slideDown();
	$('#competencias .cursos .lista-habilidades .corpo:first').slideDown();
	$('#competencias .lista-habilidades .habilidade').on('click', e => {
		let corpo = $(e.target).parent().find('.corpo');
		let sinal = $(e.target).parent().find('.cabecalho .sinal-expandir i');
		corpo.slideToggle();
		sinal.toggleClass('fa-chevron-right');
		sinal.toggleClass('fa-chevron-down');
	});
});