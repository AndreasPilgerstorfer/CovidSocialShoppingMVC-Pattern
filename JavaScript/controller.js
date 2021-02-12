///////////////////////////////////////////////////////////////////////////////////////
//  CWP JS HÜ 2
//  Andreas Pilgerstorfer
//
//  This file contains the class controller.js which controls the entire logic and
//  creates clickhandlers. It also subscribes events to the View
//
/////////////////////////////////////////////////////////////////////////////////////////


import {getInstance as View} from "./view.js";
import {getInstance as Model} from "./model.js";


let toDoController;
let init = Symbol();
let json = Symbol();

let GlobListId;
let GlobArtId;

class ToDoController {

    //constructor
    constructor() {

        // Aufruf von init
        this[init]();


        //View für diverse Events anmelden
        Model().subscribe("addList", View(), View().addList);
        Model().subscribe("removeList", View(), View().removeList);
        Model().subscribe("showListEdit", View(), View().showListEdit);
        Model().subscribe("showErrorListEdit", View(), View().showErrorListEdit);
        Model().subscribe("printListList", View(), View().printListList);
        Model().subscribe("showAddList", View(), View().showAddList);
        Model().subscribe("showDetailView", View(), View().showDetailView);
        Model().subscribe("hideAlerts", View(), View().hideAlerts);
        Model().subscribe("showAddArtikel", View(), View().showAddArtikel);
        Model().subscribe("removeArtikel", View(), View().removeArtikel);
        Model().subscribe("showDetailEdit", View(), View().showDetailEdit);
        Model().subscribe("changeViewAfterTaking", View(), View().changeViewAfterTaking);
        Model().subscribe("showAlertErrorStat", View(), View().showAlertErrorStat);
        Model().subscribe("showAlertSucc", View(), View().showAlertSucc);
        Model().subscribe("showAlertError", View(), View().showAlertError);
        Model().subscribe("showNameError", View(), View().showNameError);
        Model().subscribe("showBeschrError", View(), View().showBeschrError);
        Model().subscribe("showDatError", View(), View().showDatError);
        Model().subscribe("showDatErrorPast", View(), View().showDatErrorPast);
        Model().subscribe("hideArtAddErrors", View(), View().hideArtAddErrors);
        Model().subscribe("showArtNameAddError", View(), View().showArtNameAddError);
        Model().subscribe("showArtPreisAddError", View(), View().showArtPreisAddError);
        Model().subscribe("showArtAnzahlAddError", View(), View().showArtAnzahlAddError);
        Model().subscribe("hideViews", View(), View().hideViews);
        Model().subscribe("addUser", View(), View().addUser);
        Model().subscribe("changeViewButtonColorHilfeSuchend", View(), View().changeViewButtonColorHilfeSuchend);
        Model().subscribe("changeViewButtonColorHilfeLeistend", View(), View().changeViewButtonColorHilfeLeistend);
        Model().subscribe("showAddListErrorDate", View(), View().showAddListErrorDate);
        Model().subscribe("showAddListErrorDatePast", View(), View().showAddListErrorDatePast);
        Model().subscribe("showAddListErrorBeschreibung", View(), View().showAddListErrorBeschreibung);
        Model().subscribe("editArtikelDetail", View(), View().editArtikelDetail);
        Model().subscribe("showEditArtikelPopUp", View(), View().showEditArtikelPopUp);
        Model().subscribe("showEditArtikelErrorName", View(), View().showEditArtikelErrorName);
        Model().subscribe("showEditArtikelErrorPreis", View(), View().showEditArtikelErrorPreis);
        Model().subscribe("showEditArtikelErrorAnzahl", View(), View().showEditArtikelErrorAnzahl);
        Model().subscribe("showAddListErrorDateFuture", View(), View().showAddListErrorDateFuture);
        Model().subscribe("showEditListDetailDateFuture", View(), View().showEditListDetailDateFuture);

    }

    //private Methode für die ganzen Clickhandler
    [init](){

        // registrieren der EventHandler

        // JSON Liste laden
        this[json]();

        //Liste löschen
        View().DOM.list.on( "click", ".hoverRed", (e)=>{
            let id = $(e.currentTarget).parent().attr('id');
            Model().remove(id);
        });

        //Liste bearbeiten Pop UP
        View().DOM.list.on( "click", ".edit", (e)=>{
            let id = $(e.currentTarget).parent().attr('id');
            GlobListId = id;
            Model().edit(id);

        });

        //Liste bearbeiten Veränderung
        View().DOM.alertEdit.on( "click", ".confirm", (e)=>{

            let input =  $("#changeName").val();


            if (!isNaN(input) || input=="" || input.length <3){
                input = undefined;
                Model().changeList(GlobListId, false, input);
            }
            else{
                Model().changeList(GlobListId, true, input);
            }
        });

        //Liste hinzufügen Pop UP
        View().DOM.addListSurrounding.on( "click", ".addList", (e)=>{
            Model().showAddList();
        });

        //Liste hinzufügen Veränderung
        View().DOM.alertAddList.on( "click", ".adder", (e)=>{

            let beschreibung = $("#beschr").val();
            if ((!isNaN(beschreibung) || beschreibung=="" || beschreibung.length <3)){
                Model().showAddListErrorBeschreibung();
                return;
            }

            //current date
            let curDat = new Date();
            let Tag = curDat.getDate() ;
            let Monat = curDat.getMonth() +1;
            let Jahr = curDat.getFullYear();
            let erstellDatum = Tag + "." + Monat +"." + Jahr ;
            console.log(Tag);

            // validate Date
            // Date-Picker
            let date = new Date ($('#dat').val());
            let datetime = date.getTime();
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            if(Number(year) > 2022){
                Model().showAddListErrorDateFuture();
                return;
            }

            let time = curDat.getTime();

            if (datetime <= time){
                Model().showAddListErrorDatePast();
                return;
            }

            if ( isNaN(day) || isNaN(month)|| isNaN(year)){
                Model().showAddListErrorDate();
                return;
            }


            let erfuellDatum = day + "." + month +"." + year ;
            let status = "offen";
            let articles = "none";

            let id = "noch nicht gesetzt";
            let name = "Noch nicht vorhanden";
            let amount = 0;

            let data = {id,name,amount, beschreibung, erstellDatum, erfuellDatum, status, articles};

            Model().addList(data);


        });

        //Liste Detailview ClickHandler Anzeigen
        View().DOM.list.on( "click", ".detail", (e)=>{
            let id = $(e.currentTarget).parent().attr('id');
            GlobListId = id;

            Model().showDetail(id);
        });

        // Detailview Back Clickhandler
        View().DOM.detailViewBack.on( "click", ".customButton", (e)=>{
            Model().detailBack();
        });

        // hide alert messages by click on the x
        View().DOM.document.on( "click", ".closebtn", (e)=>{
            Model().hideAlerts();
        });

        //Detail --> Artikel hinzufügen -- Pop UP
        View().DOM.document.on( "click", ".detailAdd", (e)=>{
            Model().showAddArtikel();
        });

        //Detail --> Artikel hinzufügen -- Veränderung
        View().DOM.document.on( "click", ".ArtikelHinzufügen", (e)=>{

            Model().hideArtAddErrors();

            //read forms
            let name = $("#artName").val();
            let preis = $("#preis").val();
            let artikelAnzahl = $("#anzahl").val();


            // validate forms
            // name
            if ((!isNaN(name) || name=="" || name.length <2)){
                Model().showArtNameAddError();
            }
            // preis
            else if ( preis=="" || preis.length <2){
                Model().showArtPreisAddError();
            }
            // artikel
            else if ( artikelAnzahl=="" || artikelAnzahl.length <1) {
                Model().showArtAnzahlAddError();
            }
            else{
                // create Artikel
                let id = "undefined";
                let data = [id, name, preis, artikelAnzahl ];
                Model().addArtikel(GlobListId, data);

            }



        });

        //Detail --> Liste löschen
        View().DOM.document.on( "click", ".detailDelete", (e)=>{
            Model().deleteListDetail(GlobListId);
        });


        //  Detail --> Artikel löschen
        View().DOM.artikelBereich.on( "click", ".articleDeleteButton", (e)=>{
            let currArtikelId = $(e.currentTarget).parent().parent().attr('id');

            Model().deleteArtikelDetail(GlobListId, currArtikelId);
        });

        // Detail --> Liste bearbeiten Pop UP
        View().DOM.document.on( "click", ".detailEdit", (e)=>{
            Model().showDetailEdit();
        });

        // Detail --> Liste bearbeiten -- Veränderung
        View().DOM.document.on( "click", ".confirmer", (e)=>{

            // read formElements
            let name = $("#changeNameDetail").val();
            let beschreibung = $("#changeBeschreibungDetail").val();
            let date = new Date ($('#changeErfüllDatum').val());


            // Date-Picker
            let datetime = date.getTime();
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            let curDat = new Date();
            let time = curDat.getTime();

            //validate name
            if (!isNaN(name) || name=="" || name.length <3){
                Model().showNameError();
            }
            //validate Beschreibung
            else if ((!isNaN(beschreibung) || beschreibung=="" || beschreibung.length <3)){

                Model().showBeschrError();

            }
            // validate Date 1
            else if (isNaN(day) || isNaN(month)|| isNaN(year)){

                Model().showDatError();

            }
            else if(Number(year) > 2022){
                Model().showEditListDetailDateFuture();
            }
            // validate Date 2
            else if (datetime <= time){
                Model().showDatErrorPast();
            }
            // submit changes
            else{
                let datFormat = day + "." + month +"." + year ;
                let data = [name, beschreibung, datFormat] ;
                Model().changeListDetail(data, GlobListId);
            }





        });

        // Detail --> Liste übernehmen
        View().DOM.document.on( "click", ".takeover", (e)=>{

           Model().takeDetail(GlobListId);
        });

        // Detail --> Liste absenden
        View().DOM.document.on( "click", ".sendIt", (e)=>{
            let preis = $("#total").val();


            // validate form
            let check = true;
            for (let curr of preis){
                if (isNaN(curr)){
                    if (curr != ","){
                        check = false;
                    }
                }
            }

            // Leerer String
            if (preis == ""){
                check = false;
            }

            // Eingabe passt
            if (check){

                Model().sendList(GlobListId, check, preis);

            }
            // Eingabe ist nicht ok
            else{
                Model().sendList(GlobListId, check, preis);

            }



        });

        // Hilfesuchender Clickhandler
        View().DOM.document.on( "click", ".Hilfesuchend", (e)=>{
            Model().Hilfesuchend();
        });

        // Hilfesuchender Clickhandler
        View().DOM.document.on( "click", ".Hilfeleistend", (e)=>{
            Model().Hilfeleistend();
        });

        // Artikel bearbeiten Fenster bearbeiten anzeigen
        View().DOM.document.on( "click", ".articleEditButton", (e)=>{
            Model().showEditArtikelPopUp();
            GlobArtId = $(e.currentTarget).parent().parent().attr('id');
        });

        // Artikel bearbeiten Clickhandler -- Veränderung
        View().DOM.document.on( "click", ".artikeledit", (e) =>{


            //read forms
            let name = $("#NameEdit").val();
            let preis = $("#preisEdit").val();
            let artikelAnzahl = $("#anzahlEdit").val();


            // validate forms
            // name
            if ((!isNaN(name) || name=="" || name.length <2)){
                Model().showEditArtikelErrorName();
            }

            // preis
            else if ( preis=="" || preis.length <2){
                Model().showEditArtikelErrorPreis();
            }

            // artikel
            else if ( artikelAnzahl=="" || artikelAnzahl.length <1 ) {
                Model().showEditArtikelErrorAnzahl();
            }

            else{
                // create Data
                let data = [name, preis, artikelAnzahl];
                Model().hideAlerts();
                Model().editArtikelDetail(GlobListId, GlobArtId, data);

            }


        });


    }



    // JSON Datei laden
    [json](){

        $(document).ready(function () {

            Model().load();

        })

    }



}





//Singleton Pattern
export function getInstance() {

    //gibts schon eine Instanz
    if (!toDoController){
        toDoController = new ToDoController();
    }
    return toDoController;

}

