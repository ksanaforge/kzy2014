var kde=Require('ksana-document').kde;  // Ksana Database Engine
var kse=Require('ksana-document').kse; // Ksana Search Engine
var bootstrap=Require("bootstrap");  
var fileinstaller=Require("fileinstaller");  // install files to browser sandboxed file system
var kageglyph=Require("kageglyph");
var require_kdb=[  //list of ydb for running this application
  {filename:"glyphwiki.kdb"  , url:"http://ya.ksana.tw/kdb/glyphwiki.kdb" , desc:"Glyphiwiki"}  
 ,{filename:"chise.kdb"  , url:"http://ya.ksana.tw/kdb/chise.kdb" , desc:"Chise"}
];    
var main = React.createClass({
  getInitialState: function() {
    return {res:null,db:null };
  },
  onReady:function(usage,quota) {  //handler when kdb is ready
    if (!this.state.db) kde.open("glyphwiki",function(db){
        this.setState({db:db});  
        this.dosearch();
    },this);      
    this.setState({dialog:false,quota:quota,usage:usage});
  },
  autosearch:function() {
    clearTimeout(this.timer);
    this.timer=setTimeout(this.dosearch.bind(this),500);
  },
  dosearch:function() {   
    console.log("dosearch")
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
    if (this.state.db) {
      return ( 
        <div><input size="10" className="tofind" ref="tofind"  onInput={this.autosearch} defaultValue="甬"></input>
        </div>
        )      
    } else {
      return <span>loading database....</span>
    }
  },
  fileinstallerDialog:function() { //open the file installer dialog
      this.setState({dialog:true});
  },
  render: function() {  //main render routine
    if (!this.state.quota) { // install required db
        return this.openFileinstaller(true);
    } else { 
      return (
        <div>{this.state.dialog?this.openFileinstaller():null}
          {this.renderinputs()}
          <kageglyph code="u2fa19"/>
          <resultlist res={this.state.res}/>
        </div>
      );
    }
  },
  focus:function() {
      if (this.refs.tofind) this.refs.tofind.getDOMNode().focus();
  },
  componentDidMount:function() {
      this.focus();
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