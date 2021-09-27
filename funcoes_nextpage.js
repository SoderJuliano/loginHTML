function ajaxpadrao(json, metodo){
    jQuery.ajax({
        url: 'http://localhost:8080/usuarios/index',
        data: JSON.stringify(json),
        type: metodo,
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        contentType: "application/json; charset=utf8",
        success:function(data){
        console.log(data);
        return(data);
        //document.write(data);
        },
        error: function(){
          console.log("sessao invalida, realize login novamente");
          voltar();
        },
      });
}

function listallusers(){
    let data =  {
        "id_usuario": $.cookie('InovaInd').split("-")[1],
        "chave": $.cookie('InovaInd')
    }
    jQuery.ajax({
        url: 'http://localhost:8080/usuarios',
        type: 'POST',
        data: JSON.stringify(data),
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',    
        processData: false,
        success:function(data){
            console.log(data);
        return(data);
        //document.write(data);
        },
        error: function(xhr){
          console.log(xhr)
        },
      });
}

function voltar(){
    window.location.replace("/index.html");
  }
  function get(){
    console.log($.cookie('InovaInd'));

    let data =  {
          "id_usuario": $.cookie('InovaInd').split("-")[1],
          "chave": $.cookie('InovaInd')
    }
    console.log("usuario cookie id "+data.id_usuario)
        jQuery.ajax({
          url: 'http://localhost:8080/usuarios/index',
          data: JSON.stringify(data),
          type: 'POST',
          dataType: 'json',
          xhrFields: {
              withCredentials: true
          },
          contentType: "application/json; charset=utf8",
          success:function(data){
          console.log(data);
          $("#username").text(data.nome);
          return(data);
          //document.write(data);
          },
          error: function(){
            console.log("sessao invalida, realize login novamente");
            voltar();
          },
        });
  }
 function redirect(){
   if(!sessionStorage.getItem("InovaInd")){
    window.location.replace("/index.html");
   }
   get();
 }
 /*xhrFields: {
              withCredentials: true
          },*/
