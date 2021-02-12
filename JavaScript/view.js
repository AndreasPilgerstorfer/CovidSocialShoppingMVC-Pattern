///////////////////////////////////////////////////////////////////////////////////////
//  CWP JS HÜ 2
//  Andreas Pilgerstorfer
//
// This file view.js is responsible for the visual representationof the data model and
// shows the DOM output.
//
/////////////////////////////////////////////////////////////////////////////////////////

let toDoView;

let getList = Symbol();
let getArticles = Symbol();
let printSingleArticle = Symbol();
let getUser = Symbol();

class ToDoView {

    #dom;
    #rolle;
    #username;


    // objekt selektieren aus DOM
    constructor() {
        this.#dom = {
            list: $('.grid'),

            alertEdit: $('.alertEdit'),
            addListSurrounding: $('.addListSurrounding'),
            alertAddList: $('.alertAddList'),
            artikelBereich: $('.articles'),
            detailViewBack: $('.detailview .centerBorder'),
            document: $(document),
            user: $("#user"),
        }
    }


    get DOM(){
        return this.#dom;
    }

    //Liste hnzufügen
    addList(list){

        // anzeigen
        let html = this[getList](list);

        //zeichnen
        this.#dom.list.append(html);

        $(".alertAddList").addClass("hide");
    }


    // Liste löschen
    removeList (list){
        $("#"+list.id).remove();
    }

    // Anzeigen von Liste bearbeiten
    showListEdit(list){
        $(".alertErrorEditList").addClass("hide");
        $(".alertEdit").removeClass("hide");
        $(".editname").text(list.name);
    }

    //Fehlermeldungen bei Liste bearbeiten
    showErrorListEdit(list){
        $(".alertErrorEditList").removeClass("hide");
    }


    // die gesamte Liste an Listen ausdrucken
    printListList(data){
        this.#rolle = data[2];
        this.#username = data[1];

        $(".grid").empty();
        $(".alertEdit").addClass("hide");
        $(".toggleView").removeClass("hide");


        for (let list of data[0].values()){
            this.addList(list);
        }

        console.log(this.#rolle);

        // change appearance depending on the current role
        //change seeker
        if(this.#rolle == "seeker"){
            for (let list of data[0].values()){
                if (list.name != this.#username) {
                    let identifier = list.id;
                    $('#' +identifier).addClass("hide");
                }
            }
            $(".addList").show();
        }
        // change helper
        if(this.#rolle == "helper"){
            for (let list of data[0].values()){
                let identifier = list.id;
                $('#' +identifier).find(".edit").addClass("hide");
                $('#' +identifier).find(".hoverRed").addClass("hide");
            }
            $(".addList").hide();

        }


    }

    // Liste hinzufügen Popup Anzeigen
    showAddList(){
        $(".alertEdit").addClass("hide");
        $(".alertAddList").removeClass("hide");
        $(".beschrAddError").addClass("hide");
        $(".datAddError").addClass("hide");
        $(".datErrorpastList").addClass("hide");
        $(".datErrorFuture").addClass("hide");
        $(".datErrorFuture").addClass("hide");

    }


    // zeigt die Detailansicht für eine bestimmte Liste an
    showDetailView(liste){

        $(".normal").addClass("hide");
        $(".detailview").removeClass("hide");
        $(".toggleView").addClass("hide");
        $(".alertErrorStat").addClass("hide");
        $(".alertSucc").addClass("hide");
        $(".alertError").addClass("hide");
        $(".alertSuccTaken").addClass("hide");
        $(".alertDetailEdit").addClass("hide");

        console.log(liste);

        // einblenden ausblenden und initialiseren durch persönlich werte
        $(".beschreibung").text(liste.beschreibung);
        $(".status").text(liste.status);
        $(".amount").text(liste.amount);
        $(".erstDat").text(liste.erstellDatum);
        $(".erfullDat").text(liste.erfuellDatum);
        $(".nametag").text(liste.name);

        if(liste.status == "übernommen"){
            $(".takeover").hide();
            $(".detailEdit").hide();
            $(".detailDelete").hide();
            $(".detailAdd").hide();
        }
        else if(liste.status == "abgeschlossen"){
            $(".takeover").hide();
            $(".detailEdit").hide();
            $(".detailDelete").hide();
            $(".detailAdd").hide();
            $("#total").hide();
            $(".sendIt").hide();
            $(".end .bold").text("Gesamtpreis: " +liste.total +" Euro");
        }
        else{
            $(".takeover").show();
            $(".detailEdit").show();
            $(".detailDelete").show();
            $(".detailAdd").show();
            $("#total").show();
            $(".sendIt").show();
            $(".end .bold").text("Gesamtpreis: * ");
            $(".alertError").addClass("hide");
            $(".alertErrorStat").addClass("hide");
            $(".alertSucc").addClass("hide");
            $(".alertSuccTaken").addClass("hide");
            $(".alertDetailEdit").addClass("hide");
        }
        // changing appearance depending on the role
        //change seeker

        if(this.#rolle == "seeker"){
            $(".takeover").hide();
            $(".sendIt").hide();
            $("#total").hide();
            $(".end .bold").hide();
            $(".toggleView").addClass("hide");
            if (liste.status == "abgeschlossen") {
                let p = $(` <h3> Gesamtpreis: ${liste.total} Euro</h3>`);
                $('#' + liste.id + ".space").append(p);


            }

            }
        // change helper
        if(this.#rolle == "helper"){
            $(".detailEdit").hide();
            $(".detailDelete").hide();
            $(".detailAdd").hide();
            $(".takeover").show();
            if (liste.status == "übernommen"){   $(".takeover").hide();  }
            $(".sendIt").show();
            $("#total").show();
            if (liste.status == "abgeschlossen") {
                $(".sendIt").hide();
                $("#total").hide();
                $(".takeover").hide();

                $(".end .bold").text("Gesamtpreis: " +liste.total +" Euro");

            }
        }




        //zeichnen der Artikel Liste

        this[getArticles](liste);



    }

    // hide alert messages
    hideAlerts(){
        $(".alertErrorStat").addClass("hide");
        $(".alertSucc").addClass("hide");
        $(".alertError").addClass("hide");
        $(".alertSuccTaken").addClass("hide");
        $(".alertEdit").addClass("hide");
        $(".alertDetailEdit").addClass("hide");
        $(".nameError").addClass("hide");
        $(".beschrError").addClass("hide");
        $(".datError").addClass("hide");
        $(".alertAddEdit").addClass("hide");
        $(".alertAddArtikel").addClass("hide");
        $(".alertEditArtikel").addClass("hide");
        $(".datErrorFuture").addClass("hide");

    }


    // Artikel hinzufügen Pop Up Fenster anzeigen
    showAddArtikel(){

        //show popup window
        $(".alertAddArtikel").removeClass("hide");

        //delete former Errors
        $(".artNameAddError").addClass("hide");
        $(".artPreisAddError").addClass("hide");
        $(".artAnzahlAddError").addClass("hide");
        $(".alertDetailEdit").addClass("hide");

    }

    // Artikel löschen
    removeArtikel(artikel){
        $("#"+artikel.id).remove();

    }

    // zeigt Liste bearbeiten Pop UP im DetailView an
    showDetailEdit(){
        //hide former Errors
        $(".nameError").addClass("hide");
        $(".beschrError").addClass("hide");
        $(".datError").addClass("hide");
        $(".datErrorpast").addClass("hide");
        $(".alertAddArtikel").addClass("hide");
        $(".datErrorFuture").addClass("hide");


        // show popup Fenster
        $(".alertDetailEdit").removeClass("hide");
    }


    // ändert die Anzeige nach dem eine Liste übernommen wurde
    changeViewAfterTaking(){
        $(".alertSuccTaken").removeClass("hide");
        $(".alertErrorStat").addClass("hide");
        $(".alertSucc").addClass("hide");
        $(".alertError").addClass("hide");
        $(".alertDetailEdit").addClass("hide");
    }

    // Stats Alert Error bei Liste absenden
    showAlertErrorStat(){
        $(".alertErrorStat").removeClass("hide");
        $(".alertSucc").addClass("hide");
        $(".alertError").addClass("hide");
        $(".alertSuccTaken").addClass("hide");
        $(".alertDetailEdit").addClass("hide");
    }

    // Liste erfolgreich abgesendet Message
    showAlertSucc(){
        $(".alertSucc").removeClass("hide");
        $(".alertError").addClass("hide");
        $(".alertErrorStat").addClass("hide");
        $(".alertSuccTaken").addClass("hide");
        $(".alertEdit").addClass("hide");
        $(".alertDetailEdit").addClass("hide");
    }

    // Zeigt Fehlermeldung bei Liste absenden an
    showAlertError(){
        $(".alertError").removeClass("hide");
        $(".alertErrorStat").addClass("hide");
        $(".alertSucc").addClass("hide");
        $(".alertSuccTaken").addClass("hide");
        $(".alertDetailEdit").addClass("hide");
    }

    // show neue Liste hinzufügen Error --> Name falsch
    showNameError(){
        $(".nameError").removeClass("hide");
        $(".beschrError").addClass("hide");
        $(".datError").addClass("hide");
        $(".datErrorpast").addClass("hide");
        $(".datErrorFuture").addClass("hide");

    }

    // show neue Liste hinzufügen Error --> Beschreibung falsch
    showBeschrError(){
        $(".nameError").addClass("hide");
        $(".beschrError").removeClass("hide");
        $(".datError").addClass("hide");
        $(".datErrorpast").addClass("hide");
        $(".datErrorFuture").addClass("hide");

    }

    // show neue Liste hinzufügen Error --> Datum falsch
    showDatError(){
        $(".nameError").addClass("hide");
        $(".beschrError").addClass("hide");
        $(".datErrorpast").addClass("hide");
        $(".datError").removeClass("hide");
        $(".datErrorFuture").addClass("hide");

    }

    // show neue Liste hinzufügen Error --> Datum falsch weil in der Vergangenheit
    showDatErrorPast(){
        $(".nameError").addClass("hide");
        $(".beschrError").addClass("hide");
        $(".datErrorpast").removeClass("hide");
        $(".datError").addClass("hide");
        $(".datErrorFuture").addClass("hide");

    }

    // Artikel hinzufügen --> alle Fehlermeldungen verstecken
    hideArtAddErrors(){
        $(".artNameAddError").addClass("hide");
        $(".artPreisAddError").addClass("hide");
        $(".artAnzahlAddError").addClass("hide");
    }

    // Artikel hinzufügen --> Fehler bei Artikelname
    showArtNameAddError(){
        $(".artNameAddError").removeClass("hide");
        $(".artPreisAddError").addClass("hide");
        $(".artAnzahlAddError").addClass("hide");
    }

    // Artikel hinzufügen --> Fehler bei Preis
    showArtPreisAddError(){
        $(".artNameAddError").addClass("hide");
        $(".artPreisAddError").removeClass("hide");
        $(".artAnzahlAddError").addClass("hide");
    }

    // Artikel hinzufügen --> Fehler bei Artikelanzahl
    showArtAnzahlAddError(){
        $(".artNameAddError").addClass("hide");
        $(".artPreisAddError").addClass("hide");
        $(".artAnzahlAddError").removeClass("hide");
    }

    // wechselt die Ansicht von Detailview zurück zu Normal
    hideViews(){
        $(".normal").removeClass("hide");
        $(".detailview").addClass("hide");
    }

    // fügt User in das Select hinzu
    addUser(user){
        let html = this[getUser](user);

        this.#dom.user.append(html);

    }

    // ändert die Button Farbe des Hilfesuchenden nach Klick
    changeViewButtonColorHilfeSuchend(){
        $(".Hilfesuchend").css( "background-color", "honeydew");
        $(".Hilfeleistend").css( "background-color", "white");
    }

    // ändert die Button Farbe des Hilfeleistenden nach Klick
    changeViewButtonColorHilfeLeistend(){
        $(".Hilfesuchend").css( "background-color", "white");
        $(".Hilfeleistend").css( "background-color", "honeydew");
    }

    //Liste hinzufügen DatumsFehler
    showAddListErrorDate(){
        $(".beschrAddError").addClass("hide");
        $(".datAddError").removeClass("hide");
        $(".datErrorpastList").addClass("hide");
        $(".datErrorFuture").addClass("hide");
    }

    //Liste hinzufügen DatumsFehler Vergangenheit
    showAddListErrorDatePast(){
        $(".beschrAddError").addClass("hide");
        $(".datAddError").addClass("hide");
        $(".datErrorpastList").removeClass("hide");
        $(".datErrorFuture").addClass("hide");
    }

    //Liste hinzufügen Fehler bei Beschreibung
    showAddListErrorBeschreibung(){
        $(".beschrAddError").removeClass("hide");
        $(".datAddError").addClass("hide");
        $(".datErrorpastList").addClass("hide");
        $(".datErrorFuture").addClass("hide");
    }

    // Fehler bei Liste hinzufügen -- Datum zu weit in der Zukunft
    showAddListErrorDateFuture(){
        $(".beschrAddError").addClass("hide");
        $(".datAddError").addClass("hide");
        $(".datErrorpastList").addClass("hide");
        $(".datErrorFuture").removeClass("hide");
    }

    // Anzeigen des PopUp Fenster für Artikel bearbeiten
    showEditArtikelPopUp(){
        this.hideAlerts();
        $(".alertEditArtikel").removeClass("hide");

        //hide former Errors
        $(".artNameEdit").addClass("hide");
        $(".artPreisEdit").addClass("hide");
        $(".artAnzahlEdit").addClass("hide");
    }

    // Fehler bei Artikel bearbeiten -- Name
    showEditArtikelErrorName(){
        $(".artNameEdit").removeClass("hide");
        $(".artPreisEdit").addClass("hide");
        $(".artAnzahlEdit").addClass("hide");
    }

    // Fehler bei Artikel bearbeiten -- Preis
    showEditArtikelErrorPreis(){
        $(".artNameEdit").addClass("hide");
        $(".artPreisEdit").removeClass("hide");
        $(".artAnzahlEdit").addClass("hide");
    }

    // Fehler bei Artikel bearbeiten -- Anzahl
    showEditArtikelErrorAnzahl(){
        $(".artNameEdit").addClass("hide");
        $(".artPreisEdit").addClass("hide");
        $(".artAnzahlEdit").removeClass("hide");
    }

    // Fehler bei Liste bearbeiten wenn Datum zu weit in der Zukunft
    showEditListDetailDateFuture(){
        $(".datErrorFuture").removeClass("hide");
        $(".datErrorpast").addClass("hide");
        $(".datError").addClass("hide");
        $(".beschrError").addClass("hide");
        $(".nameError").addClass("hide");





    }















    //==========private methods ===================

    //generiert HTML für eine Liste
    [getList](list){

        let statVisual;
        let statvisualNoneEdit;
        let statvisualNoneDelete;
        if (list.status == "übernommen"){
            statVisual = "übernommen";
            statvisualNoneEdit = "hide";
            statvisualNoneDelete = "hide";
        }
        else if (list.status == "abgeschlossen"){
            statVisual = "abgeschlossen";
            statvisualNoneEdit = "hide";
            statvisualNoneDelete = "sichtbar";
        }
        else{
            statVisual = "offen";
            statvisualNoneEdit = "sichtbar";
            statvisualNoneDelete = "sichtbar";
        }

        let currList = $(`

             <div id="${list.id}" class="${statVisual}">
                <h2 class="ListenName">${list.name}</h2>
                <p>${list.amount} Artikel</p>
                
                <button class="customButton detail ">Detailansicht</button>
                <button class="customButton edit  ${statvisualNoneEdit} ">Bearbeiten <i class="fa fa-edit"></i></button>
                <button class="customButton hoverRed ${statvisualNoneDelete} ">Löschen <i class="fa fa-trash-o"></i></button>
            </div>
                           
        `);

        return currList;
    }

    // generiert HTML Code für einen User
    [getUser](user){
        let html = $(`
             <option value="${user.name}">${user.name}</option>
        `);

        return html;
    }


    // generiert HTML für einen Artikel
    [getArticles](liste){

        $(".articles").empty();


        for (let article of liste.articles){
            let htmlArt = this[printSingleArticle](article);
            this.#dom.artikelBereich.append(htmlArt);

        }

        if(this.#rolle == "helper") {
            $(".articleDeleteButton").addClass("hide");
            $(".articleEditButton").addClass("hide");
        }
        if (this.#rolle == "seeker"){
            $(".articleDeleteButton").removeClass("hide");
            $(".articleEditButton").removeClass("hide");

        }



    }

    //einfachen Artikel in HTML drucken
    [printSingleArticle](artikel){

        let article = $(`
                 <div class="list-item" id="${artikel.id}">
                        <p> <span class="boldText"> Name: </span> ${artikel.name} <span class="boldText"> Preis: </span>  ${artikel.preis} <span class="boldText"> Anzahl: </span> ${artikel.anzahl} </p>
                         <span>
                            <button class="articleEditButton" >Bearbeiten </button>
                        </span>
                        <span>
                            <button class="articleDeleteButton" > Artikel löschen  <i class="fa fa-trash-o"></i></button>
                        </span>
                 </div>               
        `);

        return article;
    }


}


//Singleton
export function getInstance() {

    //gibts schon eine Instanz
    if (!toDoView){
        toDoView = new ToDoView();
    }
    return toDoView;

}

