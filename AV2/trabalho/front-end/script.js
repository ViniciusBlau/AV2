$(function () {

    // conecta o botão de enviar à ação javascript/jquery
    $(document).on("click", "#btn_incluir", function (e) {
        e.preventDefault();

        // rota que vai ser chamada no backend
        // rota GENÉRICA :-)
        var rota = 'http://localhost:5000/incluir_aluno';

        // obter dados form
        var vetor_dados = $("#meuform").serializeArray();

        console.log(vetor_dados)

        // conversão para formato chave:valor
        var chave_valor = {};
        for (var i = 0; i < vetor_dados.length; i++) {
            chave_valor[vetor_dados[i]['name']] = vetor_dados[i]['value'];
        }

        // convertendo para JSON
        var dados_json = JSON.stringify(chave_valor);

        // chamada ajax
        var acao = $.ajax({
            url: rota,
            method: 'POST',
            dataType: 'json', // os dados são recebidos no formato json,
            contentType: 'application/json', // os dados serão enviados em json
            data: dados_json
        });

        // se a chamada der certo
        acao.done(function (retorno) {
            try {
                if (retorno.resultado == "ok") {
                    alert("Exame realizado incluído");
                } else {
                    alert("Deu algum erro no backend: " + retorno.detalhes);
                }
            } catch (error) { // se algo der errado...
                alert("Erro ao tentar fazer o ajax: " + error +
                    "\nResposta da ação: " + retorno);
            }
        });

        // se a chamada der erro
        acao.fail(function (jqXHR, textStatus) {
            mensagem = encontrarErro(jqXHR, textStatus, rota);
            alert("Erro na chamada ajax: " + mensagem);
        });
    });
});

function listagem_generica(nome_div, lista_campos, elemento_html, html_antes, html_depois) {
    // chamada ao backend
    var rota = `http://localhost:5000/listar_alunos`;

    // chamada ajax
    var acao = $.ajax({
        url: rota,
        dataType: 'json'
    });

    // se a chamada der certo
    acao.done(function (retorno) {
        // faz uma proteção contra erros
        try {
            if (retorno.resultado == "ok") {
                // percorrer a lista de pessoas retornadas; 
                for (var reg of retorno.detalhes) { //p vai valer cada pessoa do vetor de pessoas
                    // criar um parágrafo
                    var paragrafo = $(elemento_html);
                    // informar o HTML deste parágrafo
                    // observe o apóstrofo inclinado, para interpretar as variáveis
                    //paragrafo.html(`==> ${p.nome}, ${p.email}`);
                    var s = '';
                    for (campo of lista_campos) {
                        // os campos pode ser acessados como
                        // reg.campo
                        // ou
                        // reg[campo]
                        // ***** se for um campo composto, estará descrito como, por exemplo: pessoa.nome
                        // obs: só suporta 1 ponto até o momento

                        // se tem "." no campo, precisa fazer o parse
                        var teste = String(campo);
                        if (teste.indexOf(".") !== -1) {
                            // faz o parse
                            var partes = teste.split(".");
                            // pega o valor usando campo1.campo2
                            var valor = reg[partes[0]][partes[1]];
                            // o valor não está definido? Deu problema?
                            if (valor == undefined) {
                                valor = "";
                            }
                            s = s + html_antes + valor + html_depois;
                        } else {
                            s = s + html_antes + reg[campo] + html_depois;
                        }
                    }
                    paragrafo.html(`${s}`);
                    // adicionar o parágrafo criado na div
                    $('#' + nome_div).append(paragrafo);
                }
            } else {
                alert("Erro informado pelo backend: " + retorno.detalhes);
            }
        } catch (error) { // se algo der errado...
            alert("Erro ao tentar fazer o ajax: " + error +
                "\nResposta da ação: " + retorno.detalhes);
        }
    });

    // se a chamada der erro
    acao.fail(function (jqXHR, textStatus) {
        mensagem = encontrarErro(jqXHR, textStatus, rota);
        alert("Erro na chamada ajax: " + mensagem);
    });
}

// função para encontrar o erro
// https://stackoverflow.com/questions/6792878/jquery-ajax-error-function 
function encontrarErro(jqXHR, textStatus, rota) {
    var msg = '';
    if (jqXHR.status === 0) {
        msg = 'Não foi possível conectar, ' +
            'verifique se o endereço do backend está certo' +
            ' e se o backend está rodando.';
    } else if (jqXHR.status == 404) {
        msg = 'A URL informada não foi encontrada no ' +
            'servidor [erro 404]: ' + rota;
    } else if (jqXHR.status == 500) {
        msg = 'Erro interno do servidor [erro 500], ' +
            'verifique nos logs do servidor';
    } else if (textStatus === 'parsererror') {
        msg = 'Falha ao decodificar o resultado json';
    } else if (textStatus === 'timeout') {
        msg = 'Tempo excessivo de conexão, estourou o limite (timeout)';
    } else if (textStatus === 'abort') {
        msg = 'Requisição abortada (abort)';
    } else {
        msg = 'Erro desconhecido: ' + jqXHR.responseText;
    }
    return msg;
}
let value_cpf = document.querySelector('#campo_cpf');

 value_cpf.addEventListener("keydown", function(e) {
   if (e.key > "a" && e.key < "z") {
     e.preventDefault();
   }
 });
value_cpf.addEventListener("blur", function(e) {
     //Remove tudo o que não é dígito
     let validar_cpf = this.value.replace( /\D/g , "");

     //verificação da quantidade números
     if (validar_cpf.length==11){

     // verificação de CPF valido
      var Soma;
      var Resto;

      Soma = 0;
      for (i=1; i<=9; i++) Soma = Soma + parseInt(validar_cpf.substring(i-1, i)) * (11 - i);
         Resto = (Soma * 10) % 11;

      if ((Resto == 10) || (Resto == 11))  Resto = 0;
      if (Resto != parseInt(validar_cpf.substring(9, 10)) ) return alert("CPF Inválido!");;

      Soma = 0;
      for (i = 1; i <= 10; i++) Soma = Soma + parseInt(validar_cpf.substring(i-1, i)) * (12 - i);
      Resto = (Soma * 10) % 11;

      if ((Resto == 10) || (Resto == 11))  Resto = 0;
      if (Resto != parseInt(validar_cpf.substring(10, 11) ) ) return alert("CPF Inválido!");;

      //formatação final
      cpf_final = validar_cpf.replace( /(\d{3})(\d)/ , "$1.$2");
      cpf_final = cpf_final.replace( /(\d{3})(\d)/ , "$1.$2");
      cpf_final = cpf_final.replace(/(\d{3})(\d{1,2})$/ , "$1-$2");
      document.getElementById('campo_cpf').value = cpf_final;

     } else {
       alert("CPF Inválido! É esperado 11 dígitos numéricos.")
     }   

 })

