//método genérico que serve para qualquer caso de requisição para a api
function ajax(ajax){
  //declaração de variáveis
  let url, metodo, data, proximaurl, errurl, cookie;
  //este data refere-se ao cookie alternativo que foi salvo na sessão(cookies) deste navegador
  //o if confere se ja existe o cookie
  if($.cookie('InovaInd')){
    cookie =  {
      "id_usuario": $.cookie('InovaInd').split("-")[1],
      "chave": $.cookie('InovaInd')
    } 
  }
  //confere e preenche as variáveis de acordo com a necessidade da função, contendo as rotas da api
  if(ajax=='login'){
    metodo =  'POST';
    url = 'http://localhost:8080/usuarios/login';
    proximaurl = '/html/nextpage.html';
    dataLogin =  {
      "nome": $("#name").val(),
      "senha": $("#password").val()
    }
    data = dataLogin;
    //(url, metodo, data, proximaurl, errurl, cookie)
    execute(url, metodo, data, proximaurl, errurl, null, 'login');
  }
  //se o parametro passado pelo ajax() é igual a session ele entra aqui
    //esta função sessao vai vereficar se o usuario está na sessão ou se ele foi devidamente logado
  else if(ajax=='sessao'){
    metodo =  'POST';
    proximaurl = null;
    errurl = '/index';
    url = 'http://localhost:8080/usuarios/index'
    data = cookie;
    execute(url, metodo, data, null, errurl, null, 'sessao');
  }
  //funcão para retornar todos os usuarios do banco de dados
  //talvez precise previlégios para ver retornar a lista completa
  else if('listusers'){
    metodo =  'POST';
    proximaurl = null;
    errurl = '/index';
    url = 'http://localhost:8080/usuarios'
    data = cookie;
    //(url, metodo, data, proximaurl, errurl, cookie, ajax)
    execute(url, metodo, data, null, errurl, null, 'listusers');
  }
}
  // por enquanto não precisa desta função
  function setcookie(data){
    let chave = getnewDate();
    const dadossessao = chave+data["senha"]+"-"+data["id"];
    let sessao = "chave:"+dadossessao+"-id_usuario:"+data["id"]
    sessionStorage.setItem("InovaInd", sessao);
    $.cookie('InovaInd', dadossessao, { expires: 7, path: '/' });
  }
  //esta funcao seta os dados do objeto na tela (UI)
  function dadosusuario(data){
      $("#username").text(data.nome);
      $("#cargo").text(data.cargo);
      $(".bignumber").text(data.nivel_acesso);
   }
    

function execute(url, metodo, data, proximaurl, errurl, cookie, ajax){
  console.log("execute "+url+ metodo+ data.id_usuario+data.chave+ proximaurl+ errurl+ cookie+ ajax)
  //inicia a funcao padrão para todos os métodos
  jQuery.ajax({
    //url setada durante os ifs elses
    url: url,
    data: JSON.stringify(data),
    //setado durante os ifs elses
    type: metodo,
    dataType: 'json',
    //envia o cookie local no cabeçalho
    //por enquanto esse cookie é redundante
    xhrFields: {
        withCredentials: true,
        cookie: $.cookie('InovaInd')
    },
    contentType: "application/json; charset=utf8",
    success:function(resposta){
      //se estatus ok(200) retorna um corpo (resposta) já em forma de json
      //imprime a resposta em formato json (objeto)
      console.log(resposta);
      console.log(url);
      if(ajax=='login'){
        //cria cookie e sessao no navegador
        setcookie(resposta);
      }
      if(ajax=='sessao'){
        dadosusuario(resposta);
      }
      if(ajax=='listusers'){
        let names = '';
        resposta.forEach(element => {
          names += element.nome+" - ";
        });
        console.log(resposta);
        alert(names);
      }
      //se existe um redirecionamento para esta função setada acima, confere e executa aqui
      if(proximaurl!=null){
        // troca a uri para o caminho especificado na variável dentro dos ifs
        window.location.replace(proximaurl);
      }
      //caso nenhum redirecionamento foi acusado a função de estatus 200 ok bate aqui
      //um retorno simpres com a resposta da API
      return(resposta);
    },
    // qualquer resposta que não seja 200 vai gerar um erro e vai cair aqui error
    error: function(xhr){
      //imprime uma mensagem no console confirmando o erro sugerindo um novo login
      console.log("sessao invalida, realize login novamente");
      //imprime o xhr com os dados da requisição para fins de debug
      console.log(xhr);
      //executa a função (aqui neste arquivo) para retornar apagina inicial
      //voltar();
    },
  });
}//termina a função ajax

//busca e converte da data local para o formato específico
function getnewDate(){
  var now = new Date();
  const dia = now.getUTCDate();
  let month = now.getMonth()+1;
  if(month<10){month = "0"+month}
  const year = now.getFullYear();
  return  fulldate = dia+""+month+""+year
}
//volta para página inicial
function voltar(){
    window.location.replace("/index.html");
}
//primeira função executada logo após a página de login
//se a sessão e o cookie nenhum existir, volta para login, senão verefica a sessão na API com 'ajax'
function redirect(){
   if(sessionStorage.getItem("InovaInd")==null && $.cookie('InovaInd')==null){
    voltar();
   }
   ajax('sessao');
}
//quando deslogar remove o cookie e o sessionStorage e retorna para o login
function logout(){
  $.cookie('InovaInd', null, { expires: 0, path: '/' });
  sessionStorage.removeItem('InovaInd');
  voltar();
}