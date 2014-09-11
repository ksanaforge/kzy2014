/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

var Kage=Require("kage").Kage; 
var Polygons=Require("kage").Polygons; 
var glyphwiki=Require("glyphwiki").api;
var Kde=Require("ksana-document").kde;
var kageglyph = React.createClass({
  getInitialState: function() {
    return {db:this.props.db};
  },
  componentDidMount:function() {
    if (!this.state.db) {
      Kde.open("glyphwiki",function(db){
        this.setState({db:db});
        this.fetchGlyph(this.props.code,this.props.size);
      },this);
    } else {
      var random=Math.floor(Math.random()*10);
      var that=this;
      setTimeout(function(){
        that.fetchGlyph(that.props.code,that.props.size);  
      },random);
    }
  },
  shouldComponentUpdate:function(nextProps,nextState) {
    if (nextProps.code!=this.props.code) {
      this.fetchGlyph(nextProps.code,nextProps.size);
      return true;
    }
    return  (nextState.svg!=this.state.svg || nextState.db!=this.state.db)
  },
  fetchGlyph:function(code,size) {
    if (!this.state || !this.state.db) return; //db not ready
    glyphwiki.getBuhins(this.state.db,code,function(buhins){
      var kage = new Kage();
      kage.kUseCurve = true;
      var polygons = new Polygons(); 
      
      for (var buhin in buhins) {
        kage.kBuhin.push(buhin,buhins[buhin]);
      }
      kage.makeGlyph(polygons, code);
      var svg=polygons.generateSVG(true);

      //viewBox="0 0 200 200" width="200" height="200"
      size=size||128;
      svg=svg.replace('viewBox="0 0 200 200" width="200" height="200"',
        'viewBox="0 0 200 200" width="'+size+'" height="'+size+'"');

      var that=this;
      setTimeout(function(){
        that.setState({svg:svg});  
      },10);
      
    },this);
  },
  render: function() {
    return (
      <span dangerouslySetInnerHTML={{__html:this.state.svg}}/>
    );
  }
});
module.exports=kageglyph;