///////////////////////////////////////////////////////////////////////////////////////
//  CWP JS HÜ 2
//  Andreas Pilgerstorfer
//
// This file model.js loads the data and throws various events by using observers.
// This class utilizes the subject.js file.
//
/////////////////////////////////////////////////////////////////////////////////////////

import Subject from "./subject.js";
import Liste from "./Liste.js";
import Artikel from "./Artikel.js";
import User from "./User.js";

let toDoModel;

class ToDoModel extends Subject {

    #ListList;
    #userList;
    #ownId;
    #usersId;
    #rolle = "nicht gesetzt";
    #username;

    constructor() {
        super();
        this.#ListList = new Map();
        this.#userList = new Map();
    }

    // Listlist getter Methode
    get ToDoList (){
        return this.#ListList;
    }

    // Liste hinzufügen
    addList(dataList){

        dataList.id = ToDoModel.id;
        ++ToDoModel.id;

        // Namen setzen
        this.#username = $("#user").children("option:selected").val();
        dataList.name = this.#username;

        let newList =  new Liste (dataList) ;

        // hinzufügen zur Map
        this.#ListList.set(newList.id, newList);

        super.notify("addList", newList, this.#rolle);
    }


    //Liste löschen
    remove(listId){
        let list = this.#ListList.get(Number(listId));

        if (confirm('Möchtest du die Liste wirklich löschen')) {
            this.#ListList.delete(Number(listId));
            super.notify("removeList", list);
        }

    }

    // Liste bearbeiten
    edit(listId){
        let list = this.#ListList.get(Number(listId));
        super.notify("showListEdit", list);
    }


    //Liste bearbeiten
    changeList(listId, check, input){
        let list = this.#ListList.get(Number(listId));


        if (!check){
            super.notify("showErrorListEdit", list);
        }
        else{
            list.name = input;
            let data = [this.#ListList];
            super.notify("printListList", data );
        }
    }


    //neue Liste Fenster anzeigen
    showAddList(){
        super.notify("showAddList");
    }


    // Detailview anzeigen
    showDetail(listId){
        let list = this.#ListList.get(Number(listId));
        console.log(list);

        super.notify("showDetailView", list);

    }

    //detailview Back Button
    detailBack(){
        super.notify("hideViews");
        let data = [this.#ListList, this.#username, this.#rolle];
        super.notify("printListList", data);

    }

    // Alert nachrichten verstecken/ ausblenden
    hideAlerts(){
        super.notify("hideAlerts");
    }

    // Artikel hinzufügen Pop Up Verstecken
    showAddArtikel(){
        super.notify("showAddArtikel");
    }


    // Artikel in Liste  hinzufügen
    addArtikel(listId, data){
        let liste = this.#ListList.get(Number(listId));

        data.id = ToDoModel.ArtikelId;
        ToDoModel.ArtikelId++;

        //artikel anlegen
        let newArtikel = new Artikel(data[0], data[1], data[2], data[3]);

        //Artikel in Array geben
        liste.articles.push(newArtikel);

        //update Artikelanzahl
        let oldAmount = liste.amount;
        liste.amount = Number(oldAmount)+ Number(1);
        super.notify("hideAlerts");

        super.notify("showDetailView", liste);

    }

    //löscht eine Liste in der Detailansicht
    deleteListDetail(listId){
        let liste = this.#ListList.get(Number(listId));

        if (confirm('Möchtest du die Liste wirklich löschen')) {
            this.#ListList.delete(Number(listId));

            super.notify("removeList", liste);

            this.detailBack();
        }

    }


    //löscht einen Liste in der Detailansicht
    deleteArtikelDetail(listId,currArtikelId ){

        if (confirm('Möchtest du diesen Artikel wirklich löschen ?')) {
            let liste = this.#ListList.get(Number(listId));

            let index = 0;
            for (let curr of liste.articles){
                if (curr.id == currArtikelId ){
                    //löschen
                    liste.articles.splice(index, 1);

                    // Artikelanzahl updaten
                    let oldAmount = liste.amount;
                    liste.amount = oldAmount-1;

                    super.notify("removeArtikel", curr);
                    super.notify("showDetailView", liste);


                }
                else{
                    index++;
                }
            }
        }

    }


    // zeigt das Liste bearbeiten Fenster im Detailview an
    showDetailEdit(){
        super.notify("showDetailEdit");
    }

    // veröndert eine Liste im DetailView
    changeListDetail(data, listId){
        let list = this.#ListList.get(Number(listId));
        list.name = data[0];
        list.beschreibung = data[1];
        list.erfuellDatum = data[2];

        super.notify("showDetailView", list);

    }

    // Liste übernehmen
    takeDetail(listId){
        let liste = this.#ListList.get(Number(listId));
        liste.status = "übernommen" ;

        super.notify("showDetailView", liste);
        super.notify("changeViewAfterTaking");

    }

    //Liste absenden
    sendList(listId, check, preis){
        let liste = this.#ListList.get(Number(listId));
        super.notify("hideAlerts");

        if( liste.status != "übernommen" ){

            super.notify("showAlertErrorStat");
            return;
        }

        if (check){
            liste.status = "abgeschlossen";

            // update Total
            liste.total = preis;

            // Confirm Message
            super.notify("showDetailView", liste);
            super.notify("showAlertSucc");

        }
        else{
            super.notify("showAlertError");
        }


    }


    //show Name Error Liste erstellen
    showNameError(){
        super.notify("showNameError");
    }

    // show Beschreibung Error Liste erstellen
    showBeschrError(){
        super.notify("showBeschrError");
    }

    // show Datum Error List erstellen
    showDatError(){
        super.notify("showDatError");
    }

    // show Datum in der Vergangenheit Error Liste erstellen
    showDatErrorPast(){
        super.notify("showDatErrorPast");
    }

    // alle Fehler beim Artikel hinzufügen verstekcen
    hideArtAddErrors(){
        super.notify("hideArtAddErrors");
    }

    // show Fehler bei Artikelname
    showArtNameAddError(){
        super.notify("showArtNameAddError");
    }

    //show Fehler bei Artikel Preis
    showArtPreisAddError(){
        super.notify("showArtPreisAddError");
    }

    //show Fehler bei Artikel ANzahl
    showArtAnzahlAddError(){
        super.notify("showArtAnzahlAddError");
    }

    // Hilfesuchend Clickhandler zeift den View dementsprechend
    // an
    Hilfesuchend(){
        // get rolle
        this.#rolle = "seeker";

        // change Button Color
        super.notify("changeViewButtonColorHilfeSuchend");


        // get username
        this.#username = $("#user").children("option:selected").val();

        console.log(this.#rolle);

        let data = [this.#ListList, this.#username, this.#rolle];

        //update view
        super.notify("printListList", data );
    }

    // Hilfeleistender Clickhandler zeigt den
    // View dementsprechend an
    Hilfeleistend(){
        this.#rolle = "helper";

        // change Button Color
        super.notify("changeViewButtonColorHilfeLeistend");

        // get username
        this.#username = $("#user").children("option:selected").val();

        let data = [this.#ListList, this.#username, this.#rolle];

        //update view
        super.notify("printListList", data );


    }

    //Liste hinzufügen DatumsFehler
    showAddListErrorDate(){
        super.notify("showAddListErrorDate");
    }

    //Liste hinzufügen DatumsFehler in der Vergangenheit
    showAddListErrorDatePast(){
        super.notify("showAddListErrorDatePast");
    }

    //Liste hinzufügen Beschreibungfehler
    showAddListErrorBeschreibung(){
        super.notify("showAddListErrorBeschreibung");
    }

    //Artikel Bearbeiten POP UP anzeigen
    showEditArtikelPopUp(){
        super.notify("showEditArtikelPopUp");
    }


    // Artikel bearbeiten
    editArtikelDetail(listId, currArtikelId, data){
        let list = this.#ListList.get(Number(listId));

        console.log(currArtikelId);


        let artikel = "Nicht da";

        let index = 0;
        for (let curr of list.articles){
            if (curr.id == currArtikelId ){

                artikel = curr;
                break;

            }
            else{
                index++;
            }
        }

        // Artikelwerte updaten
        if (artikel != "Nicht da"){
            console.log(artikel);

            artikel.name = data[0];
            artikel.preis = data[1];
            artikel.anzahl = data[2];
        }

        super.notify("showDetailView", list);

    }

    // Fehler bei Artikel bearbeiten -- Name
    showEditArtikelErrorName(){
        super.notify("showEditArtikelErrorName");

    }

    // Fehler bei Artikel bearbeiten -- Preis
    showEditArtikelErrorPreis(){
        super.notify("showEditArtikelErrorPreis");
    }

    // Fehler bei Artikel bearbeiten -- Anzahl
    showEditArtikelErrorAnzahl(){
        super.notify("showEditArtikelErrorAnzahl");

    }

    // Liste hinzufügen -- Datum zu weit in der Zukunft
    showAddListErrorDateFuture(){
        super.notify("showAddListErrorDateFuture");

    }

    // Detail Liste bearbeiten Datum zu weit in der Zukunft
    showEditListDetailDateFuture(){
        super.notify("showEditListDetailDateFuture");
    }


    // load JSON files List and Users
    load(){

        // Listen aus JSON FILE laden
        $.getJSON("Json/lists.json").then( (data) => {
            console.log(data);
            this.#ownId = data.personalId;
            for (let list of data.lists){
                let newEntry = new Liste(list);
                this.#ListList.set(newEntry.id, newEntry);

                // Benachrichtigung
                super.notify("addList", newEntry);

            }
        });


        // User aus JSON laden
        $.getJSON("Json/users.json").then( (data) => {
            console.log(data);
            this.#usersId = data.usersId;
            for (let user of data.users){
                let newEntry = new User (user);

                this.#userList.set(newEntry.id, newEntry);

                super.notify("addUser", newEntry);
            }
        });

    }

}



// statische Variable für id
ToDoModel.id = 7;
ToDoModel.ArtikelId = 50;



//Singleton Pattern
export function getInstance() {

    //gibts schon eine Instanz
    if (!toDoModel){
        toDoModel = new ToDoModel();
    }
    return toDoModel;

}

