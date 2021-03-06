
var instance = null;

var connectorPaintStyle = {
    strokeWidth: 2,
    stroke: "#61B7CF",
    joinstyle: "round",
    outlineStroke: "white",
    outlineWidth: 2
  },
  // .. and this is the hover style.
  connectorHoverStyle = {
    strokeWidth: 3,
    stroke: "#216477",
    outlineWidth: 5,
    outlineStroke: "white"
  },
  endpointHoverStyle = {
    fill: "#216477",
    stroke: "#216477"
  },
// the definition of source endpoints (the small blue ones)
  sourceEndpoint = {
    endpoint: "Dot",
    paintStyle: {
      stroke: "#7AB02C",
      fill: "transparent",
      radius: 7,
      strokeWidth: 1
    },
    isSource: true,
    connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
    connectorStyle: connectorPaintStyle,
    hoverPaintStyle: endpointHoverStyle,
    connectorHoverStyle: connectorHoverStyle,
    dragOptions: {},
    overlays: [
      [ "Label", {
        location: [0.5, 1.5],
        label: "Drag",
        cssClass: "endpointSourceLabel",
        visible:false
      } ]
    ]
  },
  // the definition of target endpoints (will appear when the user drags a connection)
  targetEndpoint = {
    endpoint: "Dot",
    paintStyle: { fill: "#7AB02C", radius: 7 },
    hoverPaintStyle: endpointHoverStyle,
    maxConnections: -1,
    dropOptions: { hoverClass: "hover", activeClass: "active" },
    isTarget: true,
    overlays: [
      [ "Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible:false } ]
    ]
  };

jsPlumb.ready(function () {

    instance = window.jsp = jsPlumb.getInstance({
        // default drag options
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
        // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                visible:true,
                width:11,
                length:11,
                id:"ARROW",
                events:{
                    click:function() { alert("you clicked on the arrow overlay")}
                }
            } ],
            [ "Label", {
                location: 0.1,
                id: "label",
                cssClass: "aLabel",
                events:{
                    tap:function() { alert("hey"); }
                }
            }]
        ],
        Container: "canvas"
    });

    var basicType = {
        connector: "StateMachine",
        paintStyle: { stroke: "red", strokeWidth: 4 },
        hoverPaintStyle: { stroke: "blue" },
        overlays: [
            "Arrow"
        ]
    };
    instance.registerConnectionType("basic", basicType);

    // this is the paint style for the connecting lines..

    var init = function (connection) {
        connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
    };


    // suspend drawing and initialise.
    instance.batch(function () {

        _addEndpoints("Window4", ["RightMiddle"], ["TopCenter","LeftMiddle"]);
        _addEndpoints("Window2", [], ["LeftMiddle"]);
        _addEndpoints("Window3", ["RightMiddle"], []);
        _addEndpoints("Window1", ["RightMiddle"], []);

        // listen for new connections; initialise them the same way we initialise the connections at startup.
        instance.bind("connection", function (connInfo, originalEvent) {
            init(connInfo.connection);
        });

        // make all the window divs draggable
        instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
        // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
        // method, or document.querySelectorAll:
        //jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });

        // connect a few up
        instance.connect({uuids: ["Window3RightMiddle", "Window2RightMiddle"], editable: true});
        instance.connect({uuids: ["Window4BottomCenter", "Window1TopCenter"], editable: true});
        instance.connect({uuids: ["Window1RightMiddle", "Window2TopCenter"], editable: true});
        instance.connect({uuids: ["Window3BottomCenter", "Window1BottomCenter"], editable: true});
        //

        //
        // listen for clicks on connections, and offer to delete connections on click.
        //
        instance.bind("click", function (conn, originalEvent) {
           // if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
             //   instance.detach(conn);
            //conn.toggleType("basic");
        });

        instance.bind("connectionDrag", function (connection) {
            console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
        });

        instance.bind("connectionDragStop", function (connection) {
            console.log("connection " + connection.id + " was dragged");
        });

        instance.bind("connectionMoved", function (params) {
            console.log("connection " + params.connection.id + " was moved");
        });
    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);

});


function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("id", ev.target.id);
}

var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
  for (var i = 0; i < sourceAnchors.length; i++) {
    var sourceUUID = toId + sourceAnchors[i];
    instance.addEndpoint("flowchart" + toId, sourceEndpoint, {
      anchor: sourceAnchors[i], uuid: sourceUUID
    });
  }
  for (var j = 0; j < targetAnchors.length; j++) {
    var targetUUID = toId + targetAnchors[j];
    instance.addEndpoint("flowchart" + toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
  }
};

let componentId = 0;

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("id");
  const node = document.getElementById(data);

  //const containerId = node.parentNode.parentNode.parentNode.parentNode.parentNode.id;

  var nodeCopy = node.cloneNode(true);

  const nodeId = node.id + componentId;
  componentId++;
  nodeCopy.id = "flowchart"+nodeId; /* We cannot use the same ID */
  nodeCopy.removeAttribute('draggable');
  nodeCopy.classList.add("window");
  nodeCopy.classList.add("bigwindow");
  nodeCopy.classList.add("jtk-node");
  nodeCopy.classList.remove("smallwindow");

  const { classList } = node;

  ev.target.appendChild(nodeCopy);
  instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
  if (classList.contains("input")){
    _addEndpoints(nodeId, ["RightMiddle"], []);
  } else if (classList.contains("intermediate")){
    _addEndpoints(nodeId, ["RightMiddle"], ["LeftMiddle"]);
  } else if (classList.contains("output")){
    _addEndpoints(nodeId, [], ["LeftMiddle"]);
  }


  console.log("ev ", ev)
}