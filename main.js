
//Timer
var stopwatch = new StopWatch(1000,'timetext',"","","");

window.onload = function () {
    var canTop = document.getElementById("canvasTopBg");
    var canBottom = document.getElementById("canvasBottomBg");
    initBackGround(canTop,20,2);
    initBackGround(canBottom,20,2);
    replayGame();
}

//Dotted background
function initBackGround(can,spacing,radius) {
    let width = can.width;
    let height = can.height;
    var ctx = can.getContext("2d");
    for(let i = 0; i < width/spacing+1; i++) {
        for (let j = 0; j < height/spacing+1; j++) {
            ctx.beginPath();//Start to draw
            ctx.arc(i*spacing,j*spacing,radius,0,2*Math.PI);
            ctx.fillStyle="#000";
            ctx.fill();
            ctx.closePath();
        }
    }
}

let width = 400;
let height = 400;


var levelNum = 0;
var shapeAllData = shapeList[levelNum];

var stageTop;
var layerTop;

var stageBottom;
var layerBottom;

var topShapeRelativeOffset = {};//top area
var bottomShapeRelativeOffset = {};//bottom area


//Start
function replayGame() {

    stageTop = new Konva.Stage({
        container : 'stageTop',
        width : width,
        height : height,
    });
    layerTop = new Konva.Layer();
    stageTop.add(layerTop);

    stageBottom = new Konva.Stage({
        container : 'stageBottom',
        width : width,
        height : height,
    });
    layerBottom = new Konva.Layer();
    stageBottom.add(layerBottom);


    newAllShape({
        layer:layerTop,
        shapeAllData:shapeAllData,
        shapeName:'topShape',
        draggable:false
    });
    layerTop.draw();
    calculateOffset(layerTop,'topShape');


    newAllShape({
        layer:layerBottom,
        shapeAllData:shapeAllData,
        shapeName:'bottomShape',
        draggable:true
    });
    layerBottom.draw();


}


//Build all the graph in the layer
function newAllShape(opt) {
    var {layer,shapeAllData,shapeName,draggable} = opt;

    for (var key in shapeAllData){
        var shapeOne = shapeAllData[key];
        var points = shapeOne.points;
        var x = shapeOne[shapeName].x;
        var y = shapeOne[shapeName].y;

        var shape = new Konva.Line({
            id:key,
            name:shapeName,
            points: points,
            x:x,
            y:y,
            closed:true,
            fill:'#000',
            draggable:draggable,
            globalCompositeOperation:'xor'
        });

        layer.add(shape);

    }
    layer.on('dragstart',function (evt) {
        stopwatch.startTime();
    });

    layer.on('dragmove',function (evt) {
    });
    layer.on('dragend',function (evt) {
        console.log("evt",evt.target);
        var shape = evt.target;

        calibrateShape(layer,shape);

        calculateOffset(layer,'bottomShape');
        checkPass();
    });

}


//Adjust the position of graph
function calibrateShape(layer,shape) {
    var currX = shape.x();
    var currY = shape.y();

    var newX = 0;
    var newY = 0;

    if(currX > 0){
        newX = Math.floor(currX/20)*20 + Math.floor((currX%20)/10)*20;
    }else{
        newX = Math.ceil(currX/20)*20 + Math.ceil((currX%20)/10)*20;
    }

    if(currY > 0){
        newY = Math.floor(currY/20)*20 + Math.floor((currY%20)/10)*20;
    }else{
        newY = Math.ceil(currY/20)*20 + Math.ceil((currY%20)/10)*20;
    }

    shape.x(newX);
    shape.y(newY);
    layer.draw();

}



function calculateOffset(layer,name) {
    var firstShape = layer.findOne('.'+name);
    var shapeList = layer.find('.'+name);
    Object.keys(shapeList).forEach(function (key) {
        var shape = shapeList[key];
        if(typeof(shape) == 'object'){

            if(name == 'topShape'){
                topShapeRelativeOffset[key] = {
                    offsetX : shape.x() - firstShape.x(),
                    offsetY : shape.y() - firstShape.y()
                }
            }else{
                bottomShapeRelativeOffset[key] = {
                    offsetX : shape.x() - firstShape.x(),
                    offsetY : shape.y() - firstShape.y()
                }
            }
        }
    });
}

//Verify your answer
function checkPass() {
    var passFlag = true;

    for (var k in topShapeRelativeOffset){
        var singlePassFlagX = topShapeRelativeOffset[k].offsetX == bottomShapeRelativeOffset[k].offsetX;
        var singlePassFlagY = topShapeRelativeOffset[k].offsetY == bottomShapeRelativeOffset[k].offsetY;

        if(!(singlePassFlagX && singlePassFlagY)){
            passFlag = false;
            break;
        }
    }

    if(passFlag){
        var time = stopwatch.stop();
        var shapeList = layerBottom.find('.bottomShape');
        Object.keys(shapeList).forEach(function (key) {
            var shape = shapeList[key];
            if(typeof(shape) == 'object'){
                shape.draggable(false);
            }
        });


        layui.use('layer',function () {
            var layer = layui.layer;
            var content = '<div style="text-align: center; padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">';
            content += '<h2 style="margin: 5px auto">Pass</h2>';
            content += '游戏用时：'+time;
            content += '</div>';

            layer.open({
                type: 1
                ,title: false
                ,closeBtn: false
                ,area: '300px;'
                ,shade: 0.8
                ,id: 'LAY_layuipro'
                ,btn: ['Next', 'Exit']
                ,btnAlign: 'c'
                ,content: content
                ,success: function(layero){
                    var btn = layero.find('.layui-layer-btn');
                    btn.find('.layui-layer-btn0').bind('click',function () {
                        nextLevel();
                    })
                    btn.find('.layui-layer-btn1').bind('click',function () {
                        stopwatch.reset();
                    })
                }
            });
        });
    }
}


//Next Question
function nextLevel(){
    var arr = Object.keys(shapeList);
    if(arr.length-1 > levelNum){
        shapeAllData = shapeList[++levelNum];
        stopwatch.reset();
        replayGame();
    }else{
        stopwatch.reset();
        layer.msg("You answered all the question, Congrulation!");
    }
}