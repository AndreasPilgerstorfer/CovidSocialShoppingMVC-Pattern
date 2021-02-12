///////////////////////////////////////////////////////////////////////////////////////
//  CWP JS HÜ 2
//  Andreas Pilgerstorfer
//
//  This file contains the a class User which creates a User object. A User Object consists
//  of an id, a name and a city
//
/////////////////////////////////////////////////////////////////////////////////////////

export default class User {

    #id;
    #name;
    #wohnort;

    //constructor
    constructor( {id, name, wohnort} ) {
        this.#id = id;
        this.#name = name;
        this.#wohnort= wohnort;
    }

    //getter methods for all of the private class variables
    get name(){
        return this.#name;
    }
    get id(){
        return this.#id;
    }
    get wohnort(){
        return this.#wohnort;
    }


    //setter methods for all of the private class variables
    // parameter: they need a replacement value which replaces
    //            the former value
    set name (newName){
        this.#name = newName;
    }
    set wohnort (newWohnort){
        this.#wohnort = newWohnort;
    }
    set id (newId){
        this.#id = newId;
    }


}