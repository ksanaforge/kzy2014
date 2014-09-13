/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

var Kde=Require("ksana-document").kde;
var loader=require("./loader");
var kageglyph = React.createClass({
  getInitialState: function() {
    return {db:this.props.db};
  },
  componentDidMount:function() {
    if (!this.state.db) {
      Kde.open("glyphwiki",function(db){
        this.setState({db:db});
        loader.push(this,this.state.db,this.props.code,this.props.size,this);
      },this);
    } else {
      loader.push(this,this.state.db,this.props.code,this.props.size,this);
    }
  },
  shouldComponentUpdate:function(nextProps,nextState) {
    if (nextProps.code!=this.props.code) {
      loader.push(this,this.state.db,nextProps.code,nextProps.size,this);
      return true;
    }
    return  (nextState.svg!=this.state.svg || nextState.db!=this.state.db)
  },
  render: function() {
    return (
      <span dangerouslySetInnerHTML={{__html:this.state.svg}}/>
    );
  }
});
module.exports=kageglyph;