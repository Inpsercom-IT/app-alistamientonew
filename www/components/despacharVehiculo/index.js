'use strict';
var tamanoDV = "";
var json_dataitem = "";
var arrestadoDV = ["INICIADO","ALISTADO"];
app.despacharVehiculo = kendo.observable({
    init: function() {},
    onShow: function() { 
        /* Inicialza(); */
        try {
            localStorage.setItem("bandera", "1");
            document.getElementById("FechaInicioDV").style.width = "150" + "px";
            document.getElementById("FechaFinDV").style.width = "150" + "px";
            localStorage.setItem("numAutosAE", "");
            var fecha1 = new Date();
            var fecha = new Date();
            fecha1.setDate(fecha.getDate() - 8);
            var year = fecha.getFullYear();
            var mes = fecha.getMonth();
            var dia = fecha.getDate();
            var year1 = fecha1.getFullYear();
            var mes1 = fecha1.getMonth();
            var dia1 = fecha1.getDate();
            if (document.getElementById("FechaInicioDV").value == "") {
                document.getElementById("FechaInicioDV").value = dia1 + "-" + (mes1 + 1) + "-" + year1;
            }
            document.getElementById("FechaFinDV").value = dia + "-" + (mes + 1) + "-" + year;
            $("#FechaInicioDV").kendoDatePicker({
                ARIATemplate: "Date: #=kendo.toString(data.current, 'G')#",
                min: new Date(1900, 0, 1),
                value: document.getElementById("FechaInicioDV").value,
                format: "dd-MM-yyyy",
                animation: {
                    close: {
                        effects: "fadeOut zoom:out",
                        duration: 300
                    },
                    open: {
                        effects: "fadeIn zoom:in",
                        duration: 300
                    }
                }
            });
            $("#FechaFinDV").kendoDatePicker({
                min: new Date(1900, 0, 1),
                value: new Date(),
                format: "dd-MM-yyyy"
            });
            //mes
            mesVehDV();
            //marcas
            marcaVheDV("KIA");
            //modelo
            if (localStorage.getItem("info").toString() !== "MOTIVO: no existen datos") {
                cboModeloVheDV("KIA", "A4");
            }else{
                var cboModelosHTML = "<p><select id='modelo2DV' class='w3-input w3-border textos'>";
                document.getElementById("divcboModeloDV").innerHTML = cboModelosHTML;
            } 
            cboestadoDV("INICIADO");
            llamarColorTexto(".w3-text-red");
            llamarNuevoestilo("btn_buscar_consultaDV");
            llamarNuevoestiloIconB("icn_buscar_consultaDV");
            llamarColorBotonGeneral(".k-state-selected"); 
        } catch (error) {
            alert(error);
        }
     },
    afterShow: function() {}
});
app.localization.registerView('despacharVehiculo');

function mesVehDV() {
    var cboMesVhHTML = "<p><select id='mes2AE' class='w3-input w3-border textos'>"
    cboMesVhHTML += "<option  value='00' selected>NINGUNO</option>"
    cboMesVhHTML += "<option  value='01'>ENERO</option>"
    cboMesVhHTML += "<option  value='02'>FEBRERO</option>"
    cboMesVhHTML += "<option  value='03'>MARZO</option>"
    cboMesVhHTML += "<option  value='04'>ABRIL</option>"
    cboMesVhHTML += "<option  value='05'>MAYO</option>"
    cboMesVhHTML += "<option  value='06'>JUNIO</option>"
    cboMesVhHTML += "<option  value='07'>JULIO</option>"
    cboMesVhHTML += "<option  value='08'>AGOSTO</option>"
    cboMesVhHTML += "<option  value='09'>SEPTIEMBRE</option>"
    cboMesVhHTML += "<option  value='10'>OCTUBRE</option>"
    cboMesVhHTML += "<option  value='11'>NOVIEMBRE</option>"
    cboMesVhHTML += "<option  value='12'>DICIEMBRE</option>";
        document.getElementById("divcbomesDV").innerHTML = cboMesVhHTML;      
}

function marcaVheDV(selMarca) {
    
    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,"+localStorage.getItem("ls_idempresa").toLocaleString()+";IN;MARCAS;;;;;;";
    var inforMarcaDV;
    $.ajax({
        url: Url,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                inforMarcaDV = (JSON.parse(data.ComboParametroEmpGetResult));
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
    var cboMarcaHTML = "<p><select id='marcas2DV' onchange='cboModeloVheDV(this.value)' class='w3-input w3-border textos'>";
    localStorage.setItem("info",inforMarcaDV[0].CodigoClase);
    if (inforMarcaDV.length > 0 && inforMarcaDV[0].NombreClase !== "0") {
        var cboMarcaHTML = "<p><select id='marcas2DV' onchange='cboModeloVheDV(this.value)' class='w3-input w3-border textos'>";
        for (var i = 0; i < inforMarcaDV.length; i++) {
            if (selMarca == inforMarcaDV[i].CodigoClase) {
                cboMarcaHTML += "<option  value='" + inforMarcaDV[i].CodigoClase + "' selected>" + inforMarcaDV[i].NombreClase + "</option>";
            }
            else {
                cboMarcaHTML += "<option  value='" + inforMarcaDV[i].CodigoClase + "'>" + inforMarcaDV[i].NombreClase + "</option>";
            }
        }
        cboMarcaHTML += "</select>";
        document.getElementById("divcbomarcasDV").innerHTML = cboMarcaHTML;
    }
    else {
        document.getElementById("divcbomarcasDV").innerHTML = cboMarcaHTML;
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Marcas");
    }
}
function cboModeloVheDV(itmMarca, selModelo) {
    try {
      if (itmMarca != "") {
        var UrlCboModelos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/in/Inventarios.svc/in11ModelosGet/1,"+localStorage.getItem("ls_idempresa").toLocaleString() + ";" + itmMarca;
        var inforModelos = "";
        $.ajax({
            url: UrlCboModelos,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    inforModelos = JSON.parse(data.in11ModelosGetResult);
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Modelos");
                    return;
                }
            },
            error: function (err) {
                return;
            }
        });
        if (inforModelos.length > 0) {
            var cboModelosHTML = "<p><select id='modelo2DV' class='w3-input w3-border textos'>";
            cboModelosHTML += "<option  value=TODOS>TODOS(TODOS)</option>";
            var banDescr = 0;
            for (var i = 0; i < inforModelos.length; i++) {
                if (inforModelos[i].CodigoClase != " " || inforModelos[i].CodigoClase != "ninguna") {
                    if (selModelo == inforModelos[i].CodigoClase) {
                        cboModelosHTML += "<option  value='" + inforModelos[i].CodigoClase + "' selected>" + inforModelos[i].CodigoClase + " (" + inforModelos[i].NombreClase + ")" + "</option>";
                        banDescr = 1;
                    }
                    else {
                        cboModelosHTML += "<option  value='" + inforModelos[i].CodigoClase + "'>" + inforModelos[i].CodigoClase + " (" + inforModelos[i].NombreClase + ")" + "</option>";
                    }
                }
            }
            cboModelosHTML += "</select>";
        }
        else {
            cboModelosHTML = "<p><select id='modelo2DV' class='w3-input w3-border textos'>";
            cboModelosHTML += "<option  value=' '>Ninguna</option>";
            cboModelosHTML += "</select>";
        }
    }
    document.getElementById("divcboModeloDV").innerHTML = cboModelosHTML;
} catch (error) {
    alert(error);
}
}
function cboestadoDV(selEstado) {
    
    var cboMarcaHTML = "<p><select id='estado2DV' class='w3-input w3-border textos'>";
    for (var i = 0; i < arrestadoDV.length; i++) {
        if (selEstado == arrestadoDV[i]) {
            cboMarcaHTML += "<option  value='" + arrestadoDV[i] + "' selected>" + arrestadoDV[i] + "</option>";
        }
        else {
            cboMarcaHTML += "<option  value='" + arrestadoDV[i] + "'>" + arrestadoDV[i] + "</option>";
        }
    }
    cboMarcaHTML += "</select>";
    document.getElementById("divcboEstadoDV").innerHTML = cboMarcaHTML;
}
function buscarlistasDV1(txtAnio,orden,FechaInicioAE,FechaFinAE,txtVIN,txtMes,txtMarca,txtModelo,estado) {
    try {
       kendo.ui.progress($("#despacharVehiculoScreen"), true);
           setTimeout(function () {
           if (tamanoDV > 0) {
               $("#datoslistaDV").data("kendoGrid").destroy();
           }
           
           ConultaListaDV(txtAnio,orden,FechaInicioAE,FechaFinAE,txtVIN,txtMes,txtMarca,txtModelo,estado);
           kendo.ui.progress($("#despacharVehiculoScreen"), false);
       }, 2000);
   } catch (error) {
    kendo.ui.progress($("#despacharVehiculoScreen"), false);
      alert(error);  
   }
}

/*--------------------------------------------------------------------
Fecha: 29/11/2017
Descripcion: Carga la informacion de las listas
Parametros:
Creado: Edison Baquero
--------------------------------------------------------------------*/
function ConultaListaDV(txtAnio,orden,FechaInicioAE,FechaFinAE,txtVIN,txtMes,txtMarca,txtModelo,estado) {
    try {
        if (txtModelo == "TODOS") {
            txtModelo="";            
        }
        var str_clave = "1,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";"+txtAnio+";" +txtMes+";" + orden + ";" + FechaInicioAE + ";" + 
        FechaFinAE + ";" + txtMarca + ";" + txtModelo + ";" + txtVIN + ";" + localStorage.getItem("ls_usulog").toLocaleString() + ";"+estado+";";
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh77VehiculoGet/" + str_clave;
        var srtres = "";
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function(data) {
                try {
                    if (data.vh77VehiculoGetResult != null) { srtres = (JSON.parse(data.vh77VehiculoGetResult)).tvh77; } else { srtres = ""; }
                } catch (e) {
                    srtres = "";
                }
            },
            error: function(err) {
                alert(err);
                srtres = "";
            }
        });
        tamanoDV = srtres.length;
        
        if (srtres != "") {
            for (let index = 0; index < srtres.length; index++) {
                
                srtres[index]["estado_rdb"] = "rdbSN"+index;
            }
           
            var tam_panatalla = (screen.width - 100);
        try {
            /* document.getElementById("datoslistaDV").innerHTML = "<div id='datoslistaDV' style='font-size:11px; display:none; margin:auto overflow-x: scroll;'></div>";
            
            $(document).ready(function() { */
                var grid=$("#datoslistaDV").kendoGrid({
                dataSource: {
                    data: srtres,
                    pageSize: 20
                },
                scrollable: false,
                dataBound: onDataBound,
                persistSelection: true,
                pageable: true,
                sortable: true,
                
                width: tam_panatalla + "px",
                columns: [
                    { title: "Sel", width: "2px", template: "# if (estado_instalacion !== 'INICIADO' ) { # <center><input id='ckbDV' class='checkbox' name='ckbDV' type='checkbox' checked/></center> # }else { # <center><input id='ckbDV' class='checkbox' name='ckbDV' type='checkbox'/> </center> #}#" },
                    { field: "chasis", title: "VIN",
                    attributes: {
                        style: "background-color: # if (semaforo === \'ROJO\') { # red # } else { if(semaforo === \'VERDE\'){ # green # }else { # yelow # } }#"
                    } },
                    { field: "fecha_wholesale", title: "Fecha Whole" },
                    { field: "punto_venta", title: "Punto venta" },
                    { field: "fecha_aprobacion", title: "Fecha aprobación alistamiento" },
                    { field: "fecha_alistamiento_exhibicion", title: "Fecha alistamiento exhibición" },
                    { field: "leadtime", title: "Lead Time", 
                    attributes: {
                        style: "background-color: # if (semaforo === \'ROJO\') { # red # } else { if(semaforo === \'VERDE\'){ # green # }else { # yelow # } }#"
                    } },
                    { field: "modelo_comercial", title: "Modelo comercial"},
                    { field: "Motor", title: "Motor"},
                    { field: "FSC", title: "FSC"},
                    { field: "FORMA_pago", title: "Forma Pago"},
                    { field: "nombre_color", title: "COLOR"},
                    { title: "Fotos Videos", width: 11,
                        command: [{ name: "fotosALI", text: "", imageClass: "fa fa-file-text-o",
                            click: function (emo04) {
                                try {
                                    var dataItemCC = this.dataItem($(emo04.currentTarget).closest("tr"));
                                    emo04.preventDefault();
                                    localStorage.setItem("fotosviedeosALI", JSON.stringify(dataItemCC));
                                    kendo.mobile.application.navigate("components/fotosVideos/view.html");
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
            grid.table.on("click", ".checkbox" , selectRow);
            llamarColorBotonGeneral(".k-state-selected");        
        /* }); */
        } catch (error) {
            alert(error);
        }
            document.getElementById("datoslistaDV").style.display = "block";
        } else {
            myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> AVISO</center>", "No existe registros. Para la fecha ingresada.");
            document.getElementById("datoslistaDV").style.display = "none";
        }
        
        return;
    } catch (f) {
        alert(f);
        return;
    }
}
var checkedIds = {};

    //on click of the checkbox:
    function selectRow() {
        var str_clave = "";
        var checked = this.checked,
        row = $(this).closest("tr"),
        grid = $("#datoslistaDV").data("kendoGrid"),
        dataItem = grid.dataItem(row);
        if (checked) {
            //-select the row
            row.addClass("k-state-selected");
            str_clave = "4,json;" + dataItem.codigo_empresa + ";"+dataItem.anio_vh76+";"+dataItem.mes_vh76+";" + dataItem.secuencia_vh76+ ";;;;;" + 
            dataItem.chasis + ";"+localStorage.getItem("ls_usulog").toLocaleString()+";";
            } else {
            //-remove selection
            row.removeClass("k-state-selected");
            str_clave = "5,json;" + dataItem.codigo_empresa + ";"+dataItem.anio_vh76+ ";"+dataItem.mes_vh76+";" + dataItem.secuencia_vh76+ ";;;;;" + 
            dataItem.chasis + ";"+localStorage.getItem("ls_usulog").toLocaleString()+";";
        }
        grabarDV(str_clave)
    }

    //on dataBound event restore previous selected rows:
    function onDataBound(e) {
        var view = this.dataSource.view();
        for(var i = 0; i < view.length;i++){
            if(checkedIds[view[i].id]){
                this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                .addClass("k-state-selected")
                .find(".checkbox")
                .attr("checked","checked");
            }
        }
    }

    function grabarDV(str_clave) {
        try {
        var srtres;    
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh77VehiculoGet/" + str_clave;
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function(data) {
                try {
                    if(data.vh77VehiculoGetResult.toString() == "1,Success"){
                       alert("se actualizo los datos");
                       buscarlistasDV1(document.getElementById('txtAnioDV').value,document.getElementById('ordenDV').value, document.getElementById('FechaInicioDV').value, document.getElementById('FechaFinDV').value, document.getElementById('txtVINDV').value,document.getElementById('divcbomesDV').value,document.getElementById('marcas2DV').value,document.getElementById('modelo2DV').value,document.getElementById('estado2DV').value);
                   }else{
                    myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> AVISO</center>", data.vh77VehiculoGetResult.toString().substring(2,data.vh77VehiculoGetResult.length));
                    buscarlistasDV1(document.getElementById('txtAnioDV').value,document.getElementById('ordenDV').value, document.getElementById('FechaInicioDV').value, document.getElementById('FechaFinDV').value, document.getElementById('txtVINDV').value,document.getElementById('divcbomesDV').value,document.getElementById('marcas2DV').value,document.getElementById('modelo2DV').value,document.getElementById('estado2DV').value);
                   }
                } catch (e) {
                    alert(e);
                    srtres = "";
                }
            },
            error: function(err) { alert(err);
                srtres = "";
            }
        });
    } catch (error) {
         alert(error);   
    }
    
    }