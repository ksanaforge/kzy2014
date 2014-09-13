var queue=[];
var timer=null;
var Kage=Require("kage").Kage; 
var Polygons=Require("kage").Polygons; 
var glyphwiki=Require("glyphwiki").api;
var state={fetching:false};
var push=function(context,db,code,size){
	if (state.fetching) {
		queue=[];
		state.fetching=false;
	}
	if (!timer) timer=setInterval(check,10);
	queue.unshift({context:context,db:db,code:code,size:size});
}
var fetch=function(opts) {
  glyphwiki.getBuhins(opts.db,opts.code,function(buhins){
      var kage = new Kage();
      kage.kUseCurve = true;
      var polygons = new Polygons(); 
      
      for (var buhin in buhins) {
        kage.kBuhin.push(buhin,buhins[buhin]);
      }
      kage.makeGlyph(polygons, opts.code);
      var svg=polygons.generateSVG(true);

      //viewBox="0 0 200 200" width="200" height="200"
      opts.size=opts.size||128;
      svg=svg.replace('viewBox="0 0 200 200" width="200" height="200"',
        'background-color="transparent" viewBox="0 0 200 200" width="'+opts.size+'" height="'+opts.size+'"');

      opts.context.setState({svg:svg});
      state.fetching=false;      
  },opts.context);
}

var check=function() {
	if (queue.length==0) {
		clearInterval(timer);
		timer=null;
		state.fetching=false;
		return;
	}
	if (state.fetching) return;
	state.fetching=true;
	fetch(queue.pop());
}
module.exports={push:push};