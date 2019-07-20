function getDadosEnderecoPorCEP(cep){
	// Criação da url baseada no cep passado.
	let url = 'https://viacep.com.br/ws/' + cep + '/json/unicode/';
	// Instância da classe que controla as requisições XML.
	let xmlHttp = new XMLHttpRequest();
	xmlHttp.open('GET', url);

	// Controle dos retornos dos estados informados pelo servidor.
	xmlHttp.onreadystatechange = () => {
		// Caso o estado tenha sido bem-sucedido.
		if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
			// Vinculação da string contendo o JSON a uma variável.
			let dadosJSONText = xmlHttp.responseText;

			// Parse da string para a linguagem JSON.
			let dadosJSONObj = JSON.parse(dadosJSONText);
			//console.log(dadosJSONObj);
			
			// Modificando o DOM para exibir os dados.
			document.getElementById('endereco').value = dadosJSONObj.logradouro;
			document.getElementById('cidade').value = dadosJSONObj.localidade;
			document.getElementById('bairro').value = dadosJSONObj.bairro;
			document.getElementById('uf').value = dadosJSONObj.uf;
		}
	}
	xmlHttp.send();
}