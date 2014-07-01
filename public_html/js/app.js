/*
 * Data generation
 */
var ratings = [];
var transientRating = [0, 0, 0, 0, 0];
var getRandomRating = function() {
    var rating = {
        "PH": Math.floor(Math.random() * 5) + 1,
        "HB": Math.floor(Math.random() * 5) + 1,
        "AR": Math.floor(Math.random() * 5) + 1,
        "BL": Math.floor(Math.random() * 5) + 1,
        "GK": Math.floor(Math.random() * 5) + 1,
    };
    return rating;
};
for (var n = 0; n < 10; n++) {
    var rating = getRandomRating();
    ratings.push(rating);
}
/*
 * Opacity table for overlay
 */
var opacityTable = [1, 0.9558, 0.9079, 0.8569, 0.8036, 0.7487, 0.6928, 0.6367,
    0.5810, 0.5266, 0.474, 0.4239, 0.3772, 0.3344, 0.2962, 0.2634, 0.2367, 0.2168, 0.2043, 0.2];
/*
 * Draw regular polygon for given angle and radius
 */
var drawPolygon = function(context, polyAngle, radius) {
    context.moveTo(radius, 0);
    for (var n = 0; n < 5; n++) {
        context.lineTo(radius * Math.cos(polyAngle * n), radius * Math.sin(polyAngle * n));
    }
    context.closePath();
};
/*
 * Draw ratings on given regular polygon provided with rating array
 */
var drawRatings = function(context, ratingsArr, radius, polyAngle, fillStyle, radIncr, opacityVal) {
    context.globalAlpha = opacityVal;
    context.beginPath();
    for (var n = 0; n < ratingsArr.length; n++) {
        var calculatedRad = radius + (ratingsArr[n] * radIncr);
        context.lineTo(calculatedRad * Math.cos(polyAngle * n), calculatedRad * Math.sin(polyAngle * n));
    }
    context.closePath();
    context.fillStyle = fillStyle;
    context.fill();
};
// Converts from degrees to radians.
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};
// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
};
//interaction polygon
var getMousePos = function(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
};
/*
 * Creating a 5 side regular polygon
 */
var createPoly = function() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    var tempCanvas = document.getElementById('temp-canvas');
    var tempContext = tempCanvas.getContext('2d');
    var polygonSides = 5;
    var polyAngle = (Math.PI * 2) / polygonSides;
    var radius = 10;
    var radiusIncr = 40;
    var colorOverlay = "#2ECC71"; //"#FF8800"
    var colorStroke = "#E8E5DF";

    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(-Math.PI / 2);
    tempContext.translate(canvas.width / 2, canvas.height / 2);
    tempContext.rotate(-Math.PI / 2);

    //concentric polygons
    for (var n = 0; n < 6; n++) {
        drawPolygon(context, polyAngle, radius + (n * radiusIncr));
    }
    context.strokeStyle = colorStroke;
    context.stroke();

    //draw spider lines
    context.beginPath();
    spiderRadius = radius + (polygonSides * radiusIncr);
    for (var n = 0; n < polygonSides; n++) {
        context.moveTo(0, 0);
        context.lineTo(spiderRadius * Math.cos(polyAngle * n),
                spiderRadius * Math.sin(polyAngle * n));
    }
    context.strokeStyle = colorStroke;
    context.stroke();

    //draw summary
    var opacityVal;
    if (ratings.length < 20) {
        opacityVal = opacityTable[ratings.length];
    } else {
        opacityVal = opacityTable[19];
    }
    for (var n = 0; n < ratings.length; n++) {
        var r = ratings[n];
        var ratingsArr = [r.PH, r.HB, r.AR, r.BL, r.GK];
        drawRatings(tempContext, ratingsArr, 10, polyAngle, colorOverlay, radiusIncr, opacityVal);
        // drawRatings(tempContext, ratingsArr, 10, polyAngle, "#33B5E5", radiusIncr);
        tempContext.blendOnto(context, 'multiply');
        tempContext.clearRect(-tempCanvas.width / 2, -tempCanvas.height / 2, tempCanvas.width, tempCanvas.height);
    }
    addCanvasListener(canvas, context, radius, radiusIncr, colorOverlay, colorStroke,
            polyAngle, polygonSides);
    $("input[data-type='range']")
            .on("change", function(event, ui) {
                var transientRating = [
                    $('#slider-ph').val(),
                    $('#slider-hb').val(),
                    $('#slider-ar').val(),
                    $('#slider-bl').val(),
                    $('#slider-gk').val(),
                ];
                reDraw(canvas, context, polygonSides, polyAngle, radius, radiusIncr, colorStroke,
                        transientRating, colorOverlay);
            });
};
isMouseDown = false;
$('body').mousedown(function() {
    isMouseDown = true;
}).mouseup(function() {
    isMouseDown = false;
});
function addCanvasListener(canvas, context, radius, radiusIncr,
        colorOverlay, colorStroke, polyAngle, polygonSides) {
    canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        var posX = mousePos.x - canvas.width / 2;
        var posY = mousePos.y - canvas.height / 2;
        var rad = Math.atan(posY / posX);
        var moveRadius = Math.sqrt(posX * posX + posY * posY);
        var newRatingVal = Math.ceil((moveRadius - radius) / radiusIncr);
        if (newRatingVal > 5 || !isMouseDown) {
            return;
        }
        if (posX > 0 && posY < 0) {
            rad = 0 - rad;
            var moveMentAngle = Math.degrees(rad);
            if (moveMentAngle > 47) {
                transientRating[0] = newRatingVal;
            } else {
                transientRating[1] = newRatingVal;
            }
        } else if (posX < 0 && posY < 0) {
            rad = Math.PI / 2 + (Math.PI / 2 - rad);
            var moveMentAngle = Math.degrees(rad);
            if (moveMentAngle < 124) {
                transientRating[0] = newRatingVal;
            } else {
                transientRating[4] = newRatingVal;
            }
        } else if (posX < 0 && posY > 0) {
            rad = Math.PI - rad;
            var moveMentAngle = Math.degrees(rad);
            if (moveMentAngle < 194) {
                transientRating[4] = newRatingVal;
            } else {
                transientRating[3] = newRatingVal;
            }
        } else if (posX > 0 && posY > 0) {
            rad = 2 * Math.PI - rad;
            var moveMentAngle = Math.degrees(rad);
            if (moveMentAngle < 337) {
                transientRating[2] = newRatingVal;
            } else {
                transientRating[1] = newRatingVal;
            }
        }
        $('#slider-ph').val(transientRating[0]).slider("refresh");
        $('#slider-hb').val(transientRating[1]).slider("refresh");
        $('#slider-ar').val(transientRating[2]).slider("refresh");
        $('#slider-bl').val(transientRating[3]).slider("refresh");
        $('#slider-gk').val(transientRating[4]).slider("refresh");
        reDraw(canvas, context, polygonSides, polyAngle, radius, radiusIncr, colorStroke,
                transientRating, colorOverlay);
    }, false);
}
function reDraw(canvas, context, polygonSides, polyAngle, radius, radiusIncr, colorStroke,
        rating, colorOverlay) {
    context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    for (var n = 0; n < 6; n++) {
        drawPolygon(context, polyAngle, radius + (n * radiusIncr));
    }
    context.strokeStyle = colorStroke;
    context.stroke();

    context.beginPath();
    spiderRadius = radius + (polygonSides * radiusIncr);
    for (var n = 0; n < polygonSides; n++) {
        context.moveTo(0, 0);
        context.lineTo(spiderRadius * Math.cos(polyAngle * n),
                spiderRadius * Math.sin(polyAngle * n));
    }
    context.strokeStyle = colorStroke;
    context.stroke();
    drawRatings(context, rating, 10, polyAngle, colorOverlay,
            radiusIncr, opacityTable[0]);
}
var drawShape = function(canvas, r) {
    var context = canvas.getContext('2d');
    var polygonSides = 5;
    var polyAngle = (Math.PI * 2) / polygonSides;
    var radius = 5;
    var radiusIncr = 10;
    var colorOverlay = "#2ECC71"; //"#FF8800"
    var colorStroke = "#E8E5DF";

    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(-Math.PI / 2);

    drawPolygon(context, polyAngle, radius + (polygonSides * radiusIncr));
    context.strokeStyle = colorStroke;
    context.stroke();

    var ratingsArr = [r.PH, r.HB, r.AR, r.BL, r.GK];
    drawRatings(context, ratingsArr, polygonSides, polyAngle, colorOverlay, radiusIncr);
};
var createIndividualShapes = function() {
    for (var n = 0; n < ratings.length; n++) {
        var canvas = $('<canvas/>');
        canvas.attr({
            id: 'canvas-' + n,
            height: 150,
            width: 150
        });
        $('<li/>', {class: 'indv-r-canvas'}).append(canvas).appendTo('.indv-r-ctnr');
        var canvasElm = document.getElementById('canvas-' + n);
        drawShape(canvasElm, ratings[n]);
    }
};
$(document).ready(function() {
    createPoly();
    $(".list-ctnr").mCustomScrollbar({
        axis: "x",
        theme : "dark",
        advanced: {
            autoExpandHorizontalScroll: true
        }
    });
    createIndividualShapes();
});
console.log("hello");