//var othercomponent=Require("other"); 
//new module filename must be added to scripts section of ./component.js and export here
var unihan = {
  api: require("./api"),
  load:require("./load"),
  gen:require("./gen")
}

module.exports=unihan;