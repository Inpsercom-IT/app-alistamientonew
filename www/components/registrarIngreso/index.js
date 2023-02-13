var arrMenuIMG = ["GRABAR","NOVEDAD"];
var dialoMNIMG = "";
app.ingresoPDI = kendo.observable({
    onShow: function () {
        localStorage.setItem("bandera","1");
        llamarNuevoestilo("btnBusquedas");
        llamarNuevoestiloIconB("icnBusquedas");
        
}}); 
    
app.localization.registerView('ingresoPDI');
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {

    $(document).ready(function () {
        $("#tabstripING").kendoTabStrip({

            // Evento selecciona tab
            select: onSelecciona,

            animation: {
                open: {
                    effects: "fadeIn"
                }
            }
        });
    });
    navigator.splashscreen.hide();
    var app = new App();
    app.run();
}
function App() { }

App.prototype = {
    resultsField: null,
    _pictureSource: null,
    _destinationType: null,
    _scan: function () {
        var that = this;
        try {
           // alert("entro");
            if (window.navigator.simulator === true) {
                // loading
                document.getElementById("divLoading").innerHTML = "";
                // Borrar imagen de placa
                document.getElementById("smallImage").style.display = "none";

                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Aplicaci\u00F3n no compatible.");
            } else {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                     //   alert(result);
                        if (!result.cancelled) {
                           // alert(result);
                            that._addMessageToLog(result.format, result.text);
                        }
                    },
                    function (error) {
                        // ERROR: SCAN  is already in progress   
                        //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se realiz\u00F3 el escaneo. Intentelo nuevamente.");

                    });
            }
        } catch (e) {
            //alert(e);
        }
    },
    _onFail: function (message) {
        // no se tomo la foto
        //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se ha guardado ninguna imagen. Intentelo nuevamente.");
    }
}

function scan() {
    var that = this;
        try {
            try {
                localStorage.removeItem("codigoIMEI");
            } catch (error) {
                
            }
           // alert("entro");
            if (window.navigator.simulator === true) {
                // loading
                document.getElementById("divLoading").innerHTML = "";
                // Borrar imagen de placa
                document.getElementById("smallImage").style.display = "none";

                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Aplicaci\u00F3n no compatible.");
            } else {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        //alert(result);
                        try {
                        if (!result.cancelled) {
                            //alert(result.text);
                            $("#infoPlacasVINING").val(result.text);
                            document.getElementById("infoPlacasVINING").innerHTML = result.text;
                            localStorage.setItem("codigoIMEI", result.text);
                            //that._addMessageToLog(result.format, result.text);
                            //buscaPlacaVINING(document.getElementById('infoPlacasVINING').value);
                            TraerInformacionING(result.text, "C");
                        }
                    } catch (error) {
                          alert(error);  
                    }
                    },
                    function (error) {
                        // ERROR: SCAN  is already in progress   
                        //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se realiz\u00F3 el escaneo. Intentelo nuevamente.");

                    });
            }
        } catch (e) {
            //alert(e);
        }
}

function buscaPlacaVINING(placaVIN) {
    // Destruye el grid
    try {
        // Grid detalle ot
        var grid = $("#gridconsultaAE").data("kendoGrid");
        grid.destroy();
    }
    catch (ex) {
    }
    // Borrar imagen de placa
    if (document.getElementById('infoPlacasVINING').value != "") {

        kendo.ui.progress($("#ingresoPDIScreen"), true);
        setTimeout(function () {
            // precarga----------------------------
            if (placaVIN.includes("*") == true) {
            }
            else {
                if (placaVIN.length > 8) {
                    var patron = /^\d*$/;
                    if (patron.test(placaVIN)) {
                        TraerInformacionING(placaVIN, "O");
                    }
                    else {
                        // Busca la placa con los datos del cliente de cita
                        TraerInformacionING(placaVIN, "C");
                    }
                }
                else {
                    // Busca la placa con los datos del cliente de cita
                    TraerInformacionING(placaVIN, "P");
                }
                
            }
        }, 2000); 
    }
    else {
        // loading
        document.getElementById("divLoading").innerHTML = "";
        // Borrar imagen de placa
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese la Placa o VIN");
    }
}

function TraerInformacionING(responseText, tipo) {
    try {
        var Url = "";
        var InforAE = "";
        var recurrenteOT = 0;
        var errorConex = false;
        /* alert(localStorage.ls_ussucursal);
        alert(localStorage.ls_usagencia); */
        var cllave = "12,json;"+localStorage.getItem("ls_idempresa").toLocaleString()+";;;;"+responseText+";"+localStorage.getItem("ls_usulog").toLocaleString()+";;;;;;";
        /* if (tipo == "P") {
            // Placa
            Url = localStorage.getItem("ls_url2").toLocaleString()  + "/Services/VH/Vehiculos.svc/vh51VehiculoGet/"+cllave;
        } else if (tipo == "C") { */
            // Chasis
            Url = localStorage.getItem("ls_url2").toLocaleString()  + "/Services/VH/Vehiculos.svc/vh01VehiculoGet/"+cllave;
        /* }
        else {
            // OT
            Url = localStorage.getItem("ls_url2").toLocaleString()  + "/Services/VH/Vehiculos.svc/vh51VehiculoGet/"+cllave;
        } */
        //alert(Url);
         $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    var aux = JSON.stringify(data.vh01VehiculoGetResult);
                    if (aux.substr(1,1) == "0") {
                        alert(JSON.stringify(data.vh01VehiculoGetResult));
                    } else {
                        InforAE = (JSON.parse(data.vh01VehiculoGetResult)).tvh01;
                    }
                } catch (e) {
                    recurrenteOT = 1;
                }
            },
            error: function (err) {
                alert(err);
                kendo.ui.progress($("#ingresoPDIScreen"), false);
                // loading
                //document.getElementById("divLoading").innerHTML = "";
                // Borrar imagen de placa
                 errorConex = true;
             return;
            }
        });
        

        if (errorConex == true) {
            //vaciaCampos();
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No existe conexi&oacute;n con el servicio Taller</center>");
            return;
        }
        // Si no existe data envia mensaje de error
        
          if (inspeccionar(InforAE).substring(0,1) == "0") {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existen datos para el registro <b>" + responseText + "</b>");
        }
        if (recurrenteOT < 1) {
            var tam_panatalla = (screen.width - 100);
            document.getElementById("gridconsultaING").style.width = tam_panatalla+"px";
            document.getElementById("tablaconsultaIMG").width = tam_panatalla+"px"; /* screen.width+ *///"1425px";
            var grid=$("#gridconsultaING").kendoGrid({
                dataSource: {
                    data: InforAE,
                    pageSize: 20
                },
                scrollable: false,
                dataBound: onDataBound,
                persistSelection: true,
                pageable: true,
                sortable: true,
                
                width: tam_panatalla + "px",
                columns: [
                    { title: "Grabar", width: 11,
                    command: [{
                        name: "nuevo",text: "",imageClass: "fa fa-floppy-o",
                           click: function (emo03) {
                            try {
                                var dataItem = this.dataItem($(emo03.currentTarget).closest("tr"));
                                emo03.preventDefault();
                                nuevoMenuIMG(dataItem);
                            }
                            catch (fmo3) {
                                kendo.ui.progress($("#admOtScreen"), false);
                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo3);
                                return;
                            }
                        }
                    }],
                    },
                    { field: "chasis", title: "Vin" },
                    { field: "codigo_modelo", title: "Modelo" },
                    { field: "codigo_sucursal", title: "Sucursal" },
                    { field: "codigo_agencia", title: "Agencia"},
                    { field: "color_vehiculo", title: "Color"},
                    { field: "numero_motor", title: "Motor"},
                    { field: "fecha_ingreso_pdi ", title: "Fecha Ingreso"},
                    { title: "Fotos Videos", width: 11,
                        command: [{ name: "fotosALI", text: "", imageClass: "fa fa-file-text-o",
                            click: function (emo04) {
                                try {
                                    var dataItemCC = this.dataItem($(emo04.currentTarget).closest("tr"));
                                    emo04.preventDefault();
                                    alert("En construcción");
                                    /* localStorage.setItem("fotosviedeosALI", JSON.stringify(dataItemCC));
                                    kendo.mobile.application.navigate("components/fotosVideos/view.html"); */

                                    //kendo.ui.progress($("#controlCalidadScreen"), true);
                                }
                                catch (fmo4) {
                                    kendo.ui.progress($("#controlCalidadScreen"), false);
                                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo4);
                                    return;
                                }
                            }
                        }],
                    },          
                ]

            }).data("kendoGrid");
            llamarColorBotonGeneral(".k-state-selected"); 
    }
    } catch (e) {
        alert("aqui"+e);
    }
    kendo.ui.progress($("#ingresoPDIScreen"), false);
}
function nuevoMenuIMG(dataItem) {
    
    localStorage.setItem("dataMNIMG", JSON.stringify(dataItem));
    var htmlrbMenu = ""; 
        for(var i = 0; i < arrMenuIMG.length; i++){
            if(arrMenuIMG[i] == "GRABAR"){
                htmlrbMenu += "<p><input type='radio' name='rbgEI' value='" + arrMenuIMG[i] + "' onclick='cambiaMNIMG(this.value);'><strong><FONT SIZE=6> " + arrMenuIMG[i] + "</FONT></strong></p>";
            }
            if(arrMenuIMG[i] == "NOVEDAD"){  
                htmlrbMenu += "<p><input type='radio' name='rbgEI' value='" + arrMenuIMG[i] + "' onclick='cambiaMNIMG(this.value);'><strong><FONT SIZE=6> " + arrMenuIMG[i] + "</FONT></strong></p>";
            }        
            
        }
        dialoMNIMG = $("#dialogMNIMG").kendoDialog({
            width: "350px",
            buttonLayout: "normal",
            title: "<center><i class=\"fa fa-play\"></i> MENU GRABAR</center>",
            closable: false,
            modal: false,
            content: htmlrbMenu,
            actions: [
                //{ text: '<font style=\"font-size:12px\"> <button  class=\"w3-btn w3-red\"> &nbsp;&nbsp;ELEGIR&nbsp;&nbsp;</button></font>', action: accCambioMN },
                { text: '<font style=\"font-size:12px\"><button id="btnCancelarAli0"  class=\"w3-btn\"> CANCELAR</button></font>', primary: true }
            ]
        });
        dialoMNIMG.data("kendoDialog").open();
        llamarNuevoestilo("btnCancelarAli");
        llamarColorBotonGeneral(".k-primary");
}
function cambiaMNIMG(e){
    try {
        var dataMenu = JSON.parse(localStorage.getItem("dataMNIMG")); 
        switch(e){
            case arrMenuIMG[0]: 
                kendo.ui.progress($("#ingresoPDIScreen"), true);
                setTimeout(function () {
                    try {
                        var cllaveIMG = "13,json;"+localStorage.getItem("ls_idempresa").toLocaleString()+";"+
                        localStorage.getItem("ls_ussucursal").toLocaleString()+";"+
                        localStorage.getItem("ls_usagencia").toLocaleString()+";;"+dataMenu.chasis+";"+localStorage.getItem("ls_usulog").toLocaleString()+";;;;;;"; 
                        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh01VehiculoGet/" + cllaveIMG;
                        var resul="";
                        //alert(Url);
                        $.ajax({
                            url: Url,
                            type: "GET",
                            dataType: "json",
                            async: false,
                            success: function (datos1) {
                                try {
                                    if (datos1.vh01VehiculoGetResult == "1,Success") {
                                    alert("DATOS GUARDADOS");
                                    }
                                    else{
                                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", datos1.vh01VehiculoGetResult);
                                    }
                                }
                                catch (e) {
                                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(e));
                                    respPar = "error";
                                }
                            },
                            error: function (err) {
                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));
                                respPar = "error";
                            }
                        });
                    } catch (error) {
                        alert(error);
                    }
                    TraerInformacionING(dataMenu.chasis,"C");
                    kendo.ui.progress($("#ingresoPDIScreen"), false);
                }, 2000);
                break;
            case arrMenuIMG[1]: 
                alert("En construcción");
                /* localStorage.setItem("dataItem", JSON.stringify(dataMenu));
                kendo.mobile.application.navigate("components/novedades/view.html"); */
            break;
        }
        /* var window = $("#dialogMNIMG");
    if (window.data("kendoDialog")) {
        dialoMNIMG.data("kendoDialog").close();
    } */
        dialoMNIMG = $("#dialogMNIMG").data("kendoDialog");
        dialoMNIMG.close(); 
        
    }catch (error) {
        alert(error);
    }    
}
/* function SetPostear(item) {
    var grid = $("#gridconsultaING").data("kendoGrid");
    var row = $(item).closest("tr");
    var dataItem1 = grid.dataItem(row);
    if (dataItem1.requiere_codigo_IMEI == "SI") {
        scan();
        dataItem1.codigo_IMEI = localStorage.codigoIMEI;
    } else {
        dataItem1.observacion_posteo = "";
        dataItem1.estado_posteo = "ALISTADO";
    }
    var saveinfo = GuardarInformacionAE(dataItem1);
    var estado = saveinfo.substr(0, 1);
    if (estado == "1") {
        TraerInformacionING(dataItem1.chasis, "C");
    } else {
        myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error al guardar la infomaci&oacute;n.");
    }
}

function SetNinguno(item) {
    var grid = $("#gridconsultaING").data("kendoGrid");
    var row = $(item).closest("tr");
    var dataItem1 = grid.dataItem(row);
    dataItem1.observacion_posteo = "";
    dataItem1.estado_posteo = "";
    var saveinfo = GuardarInformacionAE(dataItem1);
    var estado = saveinfo.substr(0, 1);
    if (estado == "1") {
        TraerInformacionING(dataItem1.chasis, "C");
    } else {
        myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error al guardar la infomaci&oacute;n.");
    }
    TraerInformacionING(dataItem1.chasis, "C");
}
function SetNovedad(item) {
    try {
        localStorage.removeItem("chec");
    } catch (error) {
        
    }
    var grid = $("#gridconsultaING").data("kendoGrid");
    var row = $(item).closest("tr");
    var dataItem2 = grid.dataItem(row);
    if (dataItem2.estado_posteo == "NO_ALISTADO") {
        localStorage.setItem("chec",true);
    } else {
        localStorage.setItem("chec",false);
    }
    
    var nombre_item = dataItem2.nombre_item;
    var titulo_novedad = nombre_item + "<br>";
    localStorage.setItem("nombreC",dataItem2.CONTROL_alistamiento);
    document.getElementById('lbl_titulo_novedad').innerHTML = titulo_novedad;
    marcaVheING("");
    document.getElementById('divcbomarcasAEC').focus();
    document.getElementById('details_con_novedad').style.display = "block"; 
    json_dataitem = dataItem2;
} */
/*--------------------------------------------------------------------
Fecha: 18/12/2017
Descripcion: Guardar los datos de con novedad
Parametros:
Creado: Edison Baquero // no se utiliza
--------------------------------------------------------------------*/
/* function GuardarConNovedad(int_cambio) {
    try {
        if (int_cambio != "" && int_cambio != "0,0") {
            var st_dataitem = json_dataitem;
            st_dataitem.estado_posteo = "NO_ALISTADO";
            st_dataitem.observacion_posteo = int_cambio;
            var saveinfo = GuardarInformacionAE(st_dataitem);
            var estado = saveinfo.substr(0, 1);
            if (estado == "1") {
                regresarconnovedad();
                TraerInformacionING(st_dataitem.chasis, "C");
            } else {
                myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> AVISO</center>", "Error al actualizar infroamción");
            }
        } else {
            myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> AVISO </center>", "Debe seleccionar una opción.");
        }
    } catch (f) {
        myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR </center>", f);
    }
} */
/*--------------------------------------------------------------------
Fecha: 18/12/2017
Descripcion: Funcion que permite regresar a la lista de 
Parametros:
Creado: Edison Baquero // no se utiliza
--------------------------------------------------------------------*/
/* function regresarconnovedad() {
    try {
    document.getElementById('details_con_novedad').style.display = "none";
    document.getElementById('divcbomarcasAEC').value = "";
    document.getElementById('marcas2AEC').value = "";
    if (localStorage.getItem("chec")) { 
        document.getElementsByName(localStorage.getItem("nombreC")).value = "1";
    } else {
        document.getElementsByName(localStorage.getItem("nombreC")).value = "2";
    }
    var grid = $("#gridconsultaING").data("kendoGrid");
    grid.refresh();
} catch (error) {
      alert(error);  
}
    
}

function marcaVheING(selMarca) {
    
    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,"+localStorage.getItem("ls_idempresa").toLocaleString()+";VH;CAUSAL_NO_ALISTAMIENTO;;;;;;";
    //"http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;IN;MARCAS;"
    var inforMarca;
    $.ajax({
        url: Url,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                inforMarca = (JSON.parse(data.ComboParametroEmpGetResult));
            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso");
                return;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
            return;
        }
    });
    localStorage.setItem("info",inforMarca[0].CodigoClase);
    if (inforMarca.length > 0 && inforMarca[0].NombreClase !== "0") {
        var cboMarcaHTML = "<p><select id='marcas2AEC' class='w3-input w3-border textos'>";
        cboMarcaHTML += "<option value='0,0'>Seleccione</option>";
        for (var i = 0; i < inforMarca.length; i++) {
            if (selMarca == inforMarca[i].CodigoClase) {
                cboMarcaHTML += "<option  value='" + inforMarca[i].CodigoClase + "' selected>" + inforMarca[i].NombreClase + "</option>";
            }
            else {
                cboMarcaHTML += "<option  value='" + inforMarca[i].CodigoClase + "'>" + inforMarca[i].NombreClase + "</option>";
            }
        }
        cboMarcaHTML += "</select>";
        document.getElementById("divcbomarcasAEC").innerHTML = cboMarcaHTML;
    }
    else {
        document.getElementById("divcbomarcasAEC").innerHTML = cboMarcaHTML;
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Marcas");
    }
}

function GuardarInformacionAE(datag) {
    var valres = "";
    try {
        var errorConex = false;
        var cllave = "2,json;"+localStorage.getItem("ls_idempresa").toLocaleString()+";"+datag.chasis+";"+localStorage.getItem("ls_usulog").toLocaleString()
        var urlGuardar = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh51VehiculoSet";
        var i = 0;
        var griddata = {
            "codigo_empresa": datag.codigo_empresa,
            "codigo_sucursal": datag.codigo_sucursal,
            "codigo_agencia": datag.codigo_agencia,
            "chasis": datag.chasis,
            "secuencia_vh51": datag.secuencia_vh51,
            "codigo_importacion": datag.codigo_importacion,
            "codigo_marca": datag.codigo_marca,
            "codigo_modelo": datag.codigo_modelo,
            "fsc": datag.fsc,
            "prefijo_catalogo": datag.prefijo_catalogo,
            "partno_proveedor": datag.partno_proveedor,
            "cantidad": datag.cantidad,
            "responsable_accesorio": datag.responsable_accesorio,
            "tipo_accesorio": datag.tipo_accesorio,
            "prefijo_catalogo_kit": datag.prefijo_catalogo_kit,
            "partno_proveedor_kit": datag.partno_proveedor_kit,
            "anio_vh52": datag.anio_vh52,
            "numero_entrega_vh52": datag.numero_entrega_vh52,
            "costo_entrega": datag.costo_entrega,
            "fecha_solicitud": datag.fecha_solicitud,
            "hora_solicitud": datag.hora_solicitud,
            "usuario_solicitud": datag.usuario_solicitud,
            "estado": datag.estado,
            "proceso": datag.proceso,
            "bodega_acc_ent": datag.bodega_acc_ent,
            "bodega_acc_x_fac": datag.bodega_acc_x_fac,
            "bodega_venta": datag.bodega_venta,
            "anio_fa08": datag.anio_fa08,
            "numero_secuencia_fa08": datag.numero_secuencia_fa08,
            "numero_transaccion_x_fac": datag.numero_transaccion_x_fac,
            "detalle_transaccion_por_fac": datag.detalle_transaccion_por_fac,
            "tipo_documento": datag.tipo_documento,
            "referencia_factura": datag.referencia_factura,
            "codigo_sucursal_vh26": datag.codigo_sucursal_vh26,
            "codigo_agencia_vh26": datag.codigo_agencia_vh26,
            "anio_vh26": datag.anio_vh26,
            "numero_factura_vh26": datag.numero_factura_vh26,
            "secuencia_detalle_vh03": datag.secuencia_detalle_vh03,
            "tipo_documento_vh26": datag.tipo_documento_vh26,
            "referencia_vh26": datag.referencia_vh26,
            "bodega_acc_costo": datag.bodega_acc_costo,
            "numero_transaccion_acc_costo": datag.numero_transaccion_acc_costo,
            "detalle_transaccion_acc_costo": datag.detalle_transaccion_acc_costo,
            "costo_unitario": datag.costo_unitario,
            "costo_componente": datag.costo_componente,
            "fecha_creacion": datag.fecha_creacion,
            "hora_creacion": datag.hora_creacion,
            "usuario_creacion": datag.usuario_creacion,
            "prog_creacion": datag.prog_creacion,
            "fecha_modificacion": datag.fecha_modificacion,
            "hora_modificacion": datag.hora_modificacion,
            "usuario_modificacion": datag.usuario_modificacion,
            "prog_modificacion": datag.prog_modificacion,
            "tercero_factura_a": datag.tercero_factura_a,
            "tipo_registro": datag.tipo_registro,
            "estado_posteo": datag.estado_posteo,
            "observacion_posteo": datag.observacion_posteo,
            "nombre_color": datag.nombre_color,
            "nombre_marca": datag.nombre_marca,
            "nombre_modelo": datag.nombre_modelo,
            "nombre_item": datag.nombre_item,
            "nombre_kit": datag.nombre_kit,
            "CONTROL_alistamiento": datag.CONTROL_alistamiento+"."+cllave
        };
        var reslutado_final = "";
        var spres = "";
        $.ajax({
            url: urlGuardar,
            type: "POST",
            data: JSON.stringify(griddata),
            async: false,
            dataType: "json",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            success: function(datas) {
                try {
                    var estado = datas.substr(0, 1) == "1"
                    if (estado == "1") {
                        spres = "1";
                        reslutado_final = "1-Se actualiz\u00F3 la infomaci&oacute;n."
                    } else {
                        spres = "5";
                        reslutado_final = datas.substr(0, datas.length - 2);

                    }

                } catch (s) {
                    spres = "2";
                    reslutado_final = "Error al ingresar la infomaci&oacute;n.";
                }
            },
            error: function(err) {
                spres = "4";
                reslutado_final = "Error al ingresar la infomaci&oacute;n.";
            }
        });
        
        valres = reslutado_final
        return valres;

    } catch (f) {
        myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error al ingresar la infomaci&oacute;n.");
        return valres;
    }
} */
