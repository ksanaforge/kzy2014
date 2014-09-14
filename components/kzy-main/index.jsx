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
    return {res:null,db:null,glyphs:[],glyphwiki:null,bigglyph:0};
  },
  onReady:function(usage,quota) {  //handler when kdb is ready
    if (!this.state.glyphwiki) kde.open("glyphwiki",function(db){
        this.setState({glyphwiki:db});  
        this.dosearch();
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
      if (res.length>300) res.length=300;
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
        onInput={this.autosearch} defaultValue="法"></input>
        </div>
        )       
    } else {
      return <span>loading database....</span>
    }
  },
  fileinstallerDialog:function() { //open the file installer dialog
      this.setState({dialog:true});
  },
  showBigGlyph:function(e) {
    var n=e.target;
    while (n && n.nodeName!="BUTTON") n=n.parentNode;
    var code=n.dataset['code'];

    this.setState({bigglyph:code});
  },
  renderBigGlyph:function() { 
    if (this.state.bigglyph) {
      return <div><span className="unicode">{this.state.bigglyph.toString(16)}</span><br/>
      <kageglyph db={this.state.glyphwiki}
      code={this.state.bigglyph} size="512"/></div>
    }
  },

  renderGlyph:function(code) {
    if (!this.state.glyphwiki) return null;
    code=parseInt(code);
    var db=this.state.glyphwiki;
    var unicode=code.toString(16);
    var kagecode="u"+code.toString(16);
    var glyph=function() {
        var rangestart=0x4e00,rangeend=0x20000;
        //var range=0x2A6DF; //extension C start
        if (code>=rangestart && code<rangeend) {
          return chise.api.ucs2string(code);
        } else {
          return <kageglyph db={db} code={"u"+unicode} size="48"/>
        }
    }
    return <button className="candidate" title={unicode} 
     onClick={this.showBigGlyph} data-code={"u"+unicode}>
    {glyph()}
    </button>
  },
  render: function() {  //main render routine
    if (!this.state.quota) { // install required db
        return this.openFileinstaller(true);
    } else { 
      return (
        <div>{this.state.dialog?this.openFileinstaller():null}
          {this.renderinputs()}
          {this.state.glyphs.map(this.renderGlyph)}
          <div>{this.renderBigGlyph()}</div>
        </div>
      );
    }
  },
  focus:function() {
      if (this.refs.tofind) this.refs.tofind.getDOMNode().focus();
  },
  componentDidMount:function() {
    //this.focus();
    kde.open("glyphwiki",function(db){
      this.setState({glyphwiki:db});
    },this);
  },
  componentDidUpdate:function() {
    //this.focus();
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