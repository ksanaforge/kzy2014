console.log("processing glyphwiki");
var path="./components/kzy-glyphwiki";
process.chdir(path);
require(path).gen();
process.chdir("../..");

console.log("processing unihan");
path="./components/kzy-unihan";
process.chdir(path);
require(path).gen();
process.chdir("../..");

console.log("processing chise");
path="./components/kzy-chise";
process.chdir(path);
require(path).gen();
process.chdir("../..");
