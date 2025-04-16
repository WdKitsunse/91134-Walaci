//fuçaõ que sera chamada ao clicar no botão
function consultarCep() {
    //obtem o valor do campo CEP
    const cep = document.getElementById('cep').Value;

    // verifica se o CEP tem 8 digitos
    if (cep.length !== 8) {
        alert("Por favor, insira um Cep valido com 8 digitos.");
        return; //Interrompe a execução da funçaõ se o CEP for invalido 
    }

    // URL da API de CEP (usando o serviço ViaCep como exemplo)]
    const url = `https://viacep.com.br/ws/${cep}/json/`; 

    //faz uma requisição API para obter os dados do CEP
    fetch(url)
    .then(Response => Response.json())//Converte a resposta em JSON
    .then (data => {
        //verificação se o CEP foi encontado
        if (data.erro) {
            alert("CEP não encontrado.");
            return; // interrompe a execução se o CEP não for valido
        }

        // Atualiza os campos no formularios retornados 
        document.getElementById('rua').textContent = data.logradouro;
        document.getElementById('bairro').textContent = data.bairro;
        document.getElementById('cidade').textContent = data.localidade;
        document.getElementById('estado').textContent = data.uf;
        
    })
    .catch(error => {
        console.error("erro ao consultar o CEP :" , error); //loga erros no 
        alert("Ocurreu um erro ao consultar o CEP")
    });

}