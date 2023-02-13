'use strict';

app.login = kendo.observable({
    onShow: function () {
        localStorage.setItem("ls_verRecepcion", "0");
        kendo.bind($("#vwEmpresa"), kendo.observable({ isVisible: true }));
        kendo.bind($("#vwLogin2"), kendo.observable({ isVisible: false }));
        llamarNuevoestilo("btnAceptarAli");
        llamarNuevoestiloIcon("icnAceptarAli");
        llamarColorTexto(".w3-text-red");
        llamarNuevoestiloBorde("brdAceptarAli");
    },
    afterShow: function() {}
});
app.localization.registerView('login');

function accesoEmpresa(codEmpresa) {
    //imprimirEjemplo();
    //ImprimirLogin();
    try {
     if ((codEmpresa != "") && (codEmpresa)) {
            var empResp = "";
            var Url2 = wsPrincipal + "/Services/MV/Moviles.svc/mv00EmpresasGet/1,json;" + codEmpresa + ";";
            $.ajax({
                url: Url2,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {
                        empResp = (JSON.parse(data.mv00EmpresasGetResult)).tmpEmpresas[0];
                        if (empResp.estado == "ACTIVO") {
                            
                            localStorage.setItem("ls_empresa", empResp.nombre_empresa);
                            localStorage.setItem("ls_idempresa", empResp.empresa_erp);
                            localStorage.setItem("ls_url1", empResp.URL_mayorista);
                            localStorage.setItem("ls_url2", empResp.URL_concesionario);
                            document.getElementById("usuEmpresa").innerHTML = localStorage.getItem("ls_empresa").toLocaleString();
                            llamarColorTexto(".w3-text-red");
                            kendo.bind($("#vwEmpresa"), kendo.observable({ isVisible: false }));
                            kendo.bind($("#vwLogin2"), kendo.observable({ isVisible: true }));
                        }
                        else {
                            myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado</br>Empresa Desactivada");
                        }

                    } catch (e) {
                        myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
                        return;
                    }
                },
                error: function (err) {
                    myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio");
                   return;
                }
            });
            return empResp;
        }
        else {
            myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado.</br>Ingrese el C&oacute;digo");
        }

    } catch (f) {
        myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado.</br>C&oacute;digo Incorrecto");
        return;
    }

}


/*--------------------------------------------------------------------
Fecha: 26/09/2017
Descripcion: Acceso de Usuario
Parametros:
    accUsu: usuario
    accPass: pass
--------------------------------------------------------------------*/
function accesoUsuario(accUsu, accPass) {
    try {
        if ((accUsu != "") && (accUsu)) {
            var accResp = "";
            var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/AU/Seguridad.svc/accesoUsuarioLista/" + accUsu;
            //alert(Url);
            $.ajax({
                url: Url,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {
                        var resultado_ingreso = data.accesoUsuarioListaResult;
                        if (resultado_ingreso != "") {
                            accResp = JSON.parse(data.accesoUsuarioListaResult);
                            // Datos Usuario
                            localStorage.setItem("ls_usunom", accResp.Observaciones);
                            localStorage.setItem("ls_usulog", accResp.UserName);
                            var nombre = accResp.Nombre;
                            if (nombre != null)
                            { localStorage.setItem("ls_usunomcompleto", accResp.Nombre.replace(/,/g, " ")); } else { localStorage.setItem("ls_usunomcompleto", accResp.Nombre); }
                            localStorage.setItem("ls_usumail", accResp.Mail);
                            localStorage.setItem("ls_usutelf", accResp.Telefono);
                            localStorage.setItem("bandera","0");
                            kendo.mobile.application.navigate("components/home/view.html");
                            kendo.bind($("#vwLogin"), kendo.observable({ isVisible: false }));
                            kendo.bind($("#vwLogout"), kendo.observable({ isVisible: true }));
                        }
                        else {
                            myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado</br>Usuario y/o contrase&ntilde;a no existe.");
                            return;
                        }

                    } catch (e) {
                        myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado</br>Acceso Denegado. Datos Incorrectos.");
                        return;
                    }
                },
                error: function (err) {
                    myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado</br>Acceso Denegado. Datos Incorrectos.");
                    return;
                }
            });
            return accResp;
        }
    } catch (f) {
        myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado</br>Acceso Denegado. Datos Incorrectos.");
        return;
    }

}




// Sale de la app pero solo la minimiza
function closeApp() {
    navigator.app.exitApp();
}

// END_CUSTOM_CODE_login