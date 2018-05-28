/**
 * Contains a basic CTS URN library for manipulation of the
 * URN's.
 */
//var urn = new CTSUrn("urn:cts:greekLit:tlg0012.tlg001.msA:1.1");
//var urn = new CTSUrn("urn:cts:greekLit:tlg0012:");

/**
 * Creates a new CTSUrn object from the provided String.
 * @param {String} urn the urn string to be parsed
 */
function CTSUrn(urn) {
    /**The original urn string that was loaded */
    this.urn = urn;
    /**This contains all the parts of the urn*/
    let broken = this.urn.split(":");
    //Check if we have the correct amount of parts in the URN
    if (broken.length < 5) {
        console.log("A CTSUrn must consist of 5 parts, separated by colon. The provided string(" + this.urn + ") does not match this format");
        return;
    }
    //Check if the first two parts match their specific demands
    if (broken[0] != "urn" || broken[1] != "cts") {
        console.log("A CTSUrn must start with 'urn:cts:', but the provided string(" + this.urn + ") did not.");
        return;
    }
    /**The protocol of the CTS urn, should ALWAYS be CTS */
    this.protocol = broken[1];
    /**The namespace of the URN */
    this.namespace =  broken[2];
    /**The work component of this urn, can be further divided into parts */
    this.work = getWork(broken[3]);
    /**The passage component of a urn. This is an array of nodes. */
    this.passage = [];
    /**The passage compononent of this urn, can be further divided into parts */
    if(broken[4].indexOf("-") > -1){
        let passageParts = broken[4].split("-");
        this.passage = [getPassage(passageParts[0]), getPassage(passageParts[1])];
    }else{
        this.passage = [getPassage(broken[4])];
    }
    //Define a print function on the passage component
    this.passage.print = function(){
        return this.length == 1 ? this[0].print() : this[0].print() + "-" + this[1].print();
    }
    //Define a range test
    this.passage.isRange = function(){return this.length > 1;}

    
    /**
     * This function will create a printable/string representation of the urn
     */
    this.print = this.toString = function(){
        return "urn:" + this.protocol + ":" + this.namespace + ":" + this.work.print() + ":" + this.passage.print();
    }
    //Normalize the print version to remove any non-parsed data
    this.urn = this.print();

    /**
     * Anonymous worker function that is hidden from the outside world. Used to deconstruct the
     * work component
     * @param {String} value 
     */
    function getWork(value) {
        //Container for the rsult
        let result = {};
        //The parts of the provided value
        let parts = value.split(".");
        if (parts.length >= 1) result.textgroup = parts[0];
        if (parts.length >= 2) result.work = parts[1];
        if (parts.length >= 3) result.version = parts[2];
        if (parts.length >= 4) result.exemplar = parts[3];
        //Generate the string result function
        result.print = function(){
            return this.textgroup + (this.work ? "." + this.work: "")
             + (this.version ? "." + this.version: "") + (this.exemplar ? "." + this.exemplar: "");
        }
        //Now return the constructed object
        return result;
    }

    /**
     * Anonymous worker function that is hidden from the outside world. Used to deconstruct the
     * passage component
     * @param {String} value 
     */
    function getPassage(value) {
        //Create the container object
        let result = {};
        //See if the result has a subsection
        if(value.indexOf("@") > -1){
            //Split on subsection sign and assign first part as node start
            let parts = value.split("@");
            result.node = parts[0];
            //Then analyze the second part
            result.subsection = getSubsection(parts[1]);
        }else{
            result.node = value;
        }
        //Define a print function for the passage component
        result.print = function(){
            return this.node + (this.subsection ? "@" + this.subsection.print() : "");
        }
        //Now return the resulting passage
        return result;
    }

     /**
     * Anonymous worker function that is hidden from the outside world. Used to deconstruct the
     * subsection component
     * @param {String} value 
     */
    function getSubsection(value){
        //Create the container variable
        let result = {};
        //See if a counter variable is included
        if(value.indexOf('[') > -1){
            //Split on that part and break it into pieces. Assign first piece as character
            let parts = value.split("[");
            result.character = parts[0];
            //Now parse the second piece as a number
            result.index = Number(parts[1].replace(']', ''));
            //Test to see if it was a valid number
            if(isNaN(result.index)){
                console.log("Provided index number was not valid for this subsection: " + value);
            }
        }else{
            //Assume this is the first occurence
            result.character = value;
            result.index = 1;
        }
        //Define a print function
        result.print = function(){
            return this.character + (this.index > 1 ?  "[" + this.index + "]" : "");
        }
        //Now return the resulting subsection
        return result;
    }
}