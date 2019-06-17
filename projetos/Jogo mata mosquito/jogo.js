var altura = 0
var largura = 0
var vidas = 1
var tempo = 60

var cria_mosquito_tempo = 1500

// Captura do nível do jogo
var nivel = window.location.search
nivel = nivel.replace('?', '')

if(nivel === 'normal'){
	// cria_mosquito = 1500
} else if(nivel === 'dificil'){
	cria_mosquito_tempo = 1000
} else if(nivel === 'chucknorris'){
	cria_mosquito_tempo = 650
}

// Delimitar a área visível
function ajustarTamanhoPalcoJogo(){
	altura = window.innerHeight
	largura = window.innerWidth

	console.log(largura, altura)
}

ajustarTamanhoPalcoJogo()

// Tempo de jogo
var cronometro = setInterval(function(){
	tempo -= 1
	if(tempo < 0){
		// Parar cronômetro
		clearInterval(cronometro)
		clearInterval(cria_mosquito)

		// Redirecionar para página de vitória
		window.location.href = 'vitoria.html'
	}
	// Mudar o tempo no HTML
	document.getElementById('cronometro').innerHTML = tempo
}, 1000)

function posicaoAleatoria(){
	// Remover o mosquito anteriro, caso exista
	if(document.getElementById('mosquito')){
		document.getElementById('mosquito').remove()

		if(vidas > 3){
			window.location.href = 'fim_de_jogo.html'
		} else {
			// Mudar o ícone de vida
			document.getElementById('v' + vidas).src = 'imagens/coracao_vazio.png'

			// Selecão do próximo ícone
			vidas++
		}
	}

	// Criar valores aleatórios para geração dos mosquitos
	var posicao_x = Math.floor(Math.random() * largura) - 90
	var posicao_y = Math.floor(Math.random() * altura) - 90

	// Tratamento de valore menor que 0, i.e. fora da área visível
	posicao_x = posicao_x < 0 ? 0 : posicao_x
	posicao_y = posicao_y < 0 ? 0 : posicao_y

	console.log(posicao_x, posicao_y)

	// Criação do elemento HTML de forma programática
	var mosquito = document.createElement('img')

	// Adição da imagem do mosquito à tag
	mosquito.src = 'imagens/mosquito.png'

	// Redimensionar a nova imagem
	mosquito.className = tamanhoAleatorio() + ' ' + ladoAleatorio()

	// Posicionar a nova imagem no eixo x
	mosquito.style.left = posicao_x + 'px'

	// Posicionar a nova imagem no eixo y
	mosquito.style.top = posicao_y + 'px'

	// Posicionamento absoluto
	mosquito.style.position = 'absolute'

	// Adição de uma ID
	mosquito.id = 'mosquito'

	// Controle de clique sobre o elemento
	mosquito.onclick = function(){
		// Remoção do próprio elemento
		this.remove()
	}

	// Inclusão do elemento criado dentro do body
	document.body.appendChild(mosquito)
}

function tamanhoAleatorio(){
	// Classes de mosquitos (0, 1 ou 2)
	var classe = Math.floor(Math.random() * 3)

	switch(classe){
		case 0:
			return 'mosquito1'

		case 1:
			return 'mosquito2'

		case 2:
			return 'mosquito3'
	}
}

function ladoAleatorio(){
	// Face do mosquito (esquerda ou direita)
	var lado = Math.floor(Math.random() * 2)

	switch(lado){
		case 0:
			return 'ladoA'
		case 1:
			return 'ladoB'
	}
}