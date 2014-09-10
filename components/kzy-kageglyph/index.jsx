/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

var Kage=Require("kage").Kage; 
var Polygons=Require("kage").Polygons; 
var glyphwiki=Require("glyphwiki").api;
var Kde=Require("ksana-document").kde;
var kageglyph = React.createClass({
  getInitialState: function() {
    Kde.open("glyphwiki",function(db){
      this.setState({db:db});
      this.fetchGlyph(this.props.code);
    },this);
    return {};
  },
  shouldComponentUpdate:function(nextProps,nextState) {
    if (nextProps.code!=this.props.code) {
      this.fetchGlyph(nextProp.code);
      return true;
    }
    return  (nextState.svg!=this.state.svg || nextState.db!=this.state.db)
  },
  fetchGlyph:function(code) {
    if (!this.state.db) return; //db not ready
    glyphwiki.getBuhins(this.state.db,code,function(buhins){
      var kage = new Kage();
      kage.kUseCurve = true;
      var polygons = new Polygons(); 
      
      for (var buhin in buhins) {
        kage.kBuhin.push(buhin,buhins[buhin]);
      }
      kage.makeGlyph(polygons, code);
      var svg=polygons.generateSVG(true);
      this.setState({svg:svg});

    },this);

    //kage.kBuhin.push("u6f22", "99:150:0:9:12:73:200:u6c35-07:0:-10:50$99:0:0:54:10:190:199:u26c29-07");
    //kage.kBuhin.push("u6c35-07", "2:7:8:42:12:99:23:124:35$2:7:8:20:62:75:71:97:85$2:7:8:12:123:90:151:81:188$2:2:7:63:144:109:118:188:51");
    //kage.kBuhin.push("u26c29-07", "1:0:0:18:29:187:29$1:0:0:73:10:73:48$1:0:0:132:10:132:48$1:12:13:44:59:44:87$1:2:2:44:59:163:59$1:22:23:163:59:163:87$1:2:2:44:87:163:87$1:0:0:32:116:176:116$1:0:0:21:137:190:137$7:32:7:102:59:102:123:102:176:10:190$2:7:0:105:137:126:169:181:182");

  },
  render: function() {
    return (
      <div dangerouslySetInnerHTML={{__html:this.state.svg}}/>
    );
  }
});
module.exports=kageglyph;