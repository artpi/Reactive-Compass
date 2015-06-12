var React = require("react"),
    domReady = require("domready"),
    navigation = require("../../"),
    SortMenu = {};


//Menu Sorting components
SortMenu.List = React.createClass({
    mixins: [navigation.mixin],
    render: function() {
        var children = this.navInit(this.props.children);
        return (
            <div className="menu">
                {children}
            </div>
        );
    }
});
SortMenu.Item = React.createClass({
    mixins: [navigation.mixin],
    navHandleKey: function(key) {
        if(key === "ENTER") {
            this.props.trigger();
        }
    },
    render: function() {
        var className="";
        this.navInit();

        if(this.state.focused === true) {
            className = "focused";
        }

        return (
            <a className={className} onClick={this.props.trigger}>{this.props.title}</a>
        );
    }
});


//Item and List components hold our data
var Item = React.createClass({
    mixins: [navigation.mixin],
    navHandleKey: function(key) {
        if(key === "ENTER") {
            alert("Item " + this.props.name + " selected!");
        }
    },
    render: function() {
        this.navInit();
        var className="item";
        if(this.state.focused === true) {
            className = className + " focused";
        }
        return (
          <div className={className} onClick={this.handleClick}>
            <h2>{this.props.name}</h2>
            <p>ID: #{this.props.itemId}</p>
          </div>
        );
    }
});
var List = React.createClass({
    mixins: [navigation.mixin],
    render: function() {
        var elements = this.navInit(this.props.children);
        return (
            <div className="videos">
                {elements}
            </div>
        );
    }
});


//Grid is a main component that holds everything together.
var Grid = React.createClass({
    //Navigation mixin
    mixins: [navigation.mixin],
    getInitialState: function() {
      return {sortBy: "id", ascending: true};
    },
    sort: function(comp) {
        if(this.state.sortBy === comp) {
            this.setState({ascending: !this.state.ascending});
        } else {
            this.setState({sortBy: comp});
        }
    },
    render: function() {
        var col,
            row,
            cols = 6,
            items,
            comp = this.state.sortBy,
            ascending = this.state.ascending,
            data = this.props.data || [];

        //NavInit registers component as a navigable item
        this.navInit();

        //Sorting videos according to comparator
        data.sort(function(a, b) {
            var order = 0;
            if(a[comp] > b[comp]) {
                order = 1;
            } else if(a[comp] < b[comp]) {
                order = -1;
            }
            //Do we want to reverse order?
            if(!ascending) {
                order = -1 * order;
            }

            return order;
        });

        //transforming data to components
        items = data.map(function (video, i) {
            return(
                <Item name={video.name} key={video.id} itemId={video.id} />
            );
        });

        return (
            <div id="grid">
                <SortMenu.List navParent={this.navSelf} navType="horizontal" navWrap="wrap">
                    <b>Sort By:</b>
                    <SortMenu.Item trigger={this.sort.bind(this,'name')} title="Name"/>
                    <SortMenu.Item trigger={this.sort.bind(this,'id')} title="Id"/>
                </SortMenu.List>
                <List navParent={this.navSelf} navType="grid" navWrap="wrapX" navGridCols="3">
                    {items}
                </List>
            </div>
        );
    }
});

//Sample data
var data = [
    {id: 1, name: "React"},
    {id: 2, name: "Backbone"},
    {id: 3, name: "VanillaJS"},
    {id: 4, name: "Backbone"},
    {id: 5, name: "Ember"},
    {id: 6, name: "Angular"},
    {id: 7, name: "Prototype"},
    {id: 8, name: "jQuery"}
];



//Get everything together
domReady(function() {
    React.render(
        <Grid data={data} />,
        document.getElementById("content"),
        function() {
            navigation.controller.init(document, 0);
        }
    );
});
