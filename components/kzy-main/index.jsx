var kde=Require('ksana-document').kde;  // Ksana Database Engine
var kse=Require('ksana-document').kse; // Ksana Search Engine
var bootstrap=Require("bootstrap");  
var fileinstaller=Require("fileinstaller");  // install files to browser sandboxed file system
var kageglyph=Require("kageglyph");
var glypheme=Require("glypheme");
var chise=Require("chise");
var require_kdb=[  //list of ydb for running this application
  {filename:"glyphwiki.kdb"  , url:"http://ya.ksana.tw/kdb/glyphwiki.kdb" , desc:"Glyphiwiki"}  
 ,{filename:"chise.kdb"  , url:"http://ya.ksana.tw/kdb/chise.kdb" , desc:"Chise"}
];    
var main = React.createClass({
  getInitialState: function() {
    return {res:null,db:null,glyphs:[],glyphwiki:null};
  },
  onReady:function(usage,quota) {  //handler when kdb is ready
    if (!this.state.glyphwiki) kde.open("glyphwiki",function(db){
        this.setState({glyphwiki:db});  
        var that=this;
        //var k=<kageglyph db={this.state.glyphwiki} code="u4e03" size="64"/>
        db.get([["extra","glyphwiki","$$"],
        ["extra","glyphwiki","$"]],function(){}); //workaround to prefetch

        setTimeout(
          function(){
            that.dosearch()
          },10);
      
      //  this.dosearch();
    },this);      
    this.setState({dialog:false,quota:quota,usage:usage});
  },
  autosearch:function() {
    clearTimeout(this.timer);
    this.timer=setTimeout(this.dosearch,500);
  },
  dosearch:function() {   
    var tofind=this.refs.tofind.getDOMNode().value;
    chise.load(tofind,function(partindex){
      var res=glypheme.search(partindex,tofind);
      if (res.length>100) res.length=100;
      this.setState({glyphs:res});
    },this);
  }, 
  openFileinstaller:function(autoclose) { // open file dialog, autoclose==true for initalizing application
    if (window.location.origin.indexOf("http://127.0.0.1")==0) {
      for (var i=0;i<require_kdb.length;i++) {
        require_kdb[i].url=window.location.origin+"/"+require_kdb[i].filename;  
      }
    } 
    return <fileinstaller quota="512M" autoclose={autoclose} needed={require_kdb} 
                     onReady={this.onReady}/>
  },   
  renderinputs:function() {  // input interface for search
    if (this.state.glyphwiki) {
      return ( 
        <div><input size="10" className="tofind" ref="tofind" 
        onInput={this.autosearch} defaultValue="奇4"></input>
        </div>
        )       
    } else {
      return <span>loading database....</span>
    }
  },
  fileinstallerDialog:function() { //open the file installer dialog
      this.setState({dialog:true});
  },
  renderGlyph:function(code) {
    if (!this.state.glyphwiki) return null;
    return <kageglyph db={this.state.glyphwiki} 
      code={"u"+code.toString(16)} size="64"/>
  },
  render: function() {  //main render routine
    if (!this.state.quota) { // install required db
        return this.openFileinstaller(true);
    } else { 
      return (
        <div>{this.state.dialog?this.openFileinstaller():null}
          {this.renderinputs()}
          {this.state.glyphs.map(this.renderGlyph)}
          
        </div>
      );
    }
  },
  focus:function() {
      if (this.refs.tofind) this.refs.tofind.getDOMNode().focus();
  },
  componentDidMount:function() {
    this.focus();
    kde.open("glyphwiki",function(db){
      this.setState({glyphwiki:db});
    },this);
  },
  componentDidUpdate:function() {
    this.focus();
  } 
});
var resultlist=React.createClass({  //should search result
  show:function() {
    return this.props.res.excerpt.map(function(r,i){ // excerpt is an array 
      return <div>
      <div className="pagename">{r.pagename}</div>
        <div className="resultitem" dangerouslySetInnerHTML={{__html:r.text}}></div>
      </div>
    }); 
  }, 
  render:function() {
    if (this.props.res) {
      if (this.props.res.excerpt&&this.props.res.excerpt.length) {
          return <div>{this.show()}</div>
      } else {
        return <div>Not found</div>
      }
    }
    else {
      return <div>type keyword to search</div>
    } 
  }
});

module.exports=main;