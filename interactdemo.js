/*
 * Copyright (c) 2012 Taye Adeyemi
 * Open source under the MIT License.
 * https://raw.github.com/biographer/interact.js/master/LICENSE
 */

/**
 * @namespace interact.js module
 * @name interact
 */
window.interactDemo = (function(interact) {
    'use strict';

    var interactDemo = {},
        svg,
        svgTags = {
            g: 'g',
            rect: 'rect',
            circle: 'circle',
            ellipse: 'ellipse',
            text: 'text',
            path: 'path',
            line: 'line',
            image: 'image'
        },
        margin = 20,
        minSize = 30,
        prevX = 0,
        prevY = 0,
        realtime = true;

        interact = interact || window.interact;
        if (!interact) {
            return;
        }

    function parseStyleLength(element, string) {
        var lastChar = string[string.length - 1];

        if (lastChar === 'x') {
            return Number(string.substring(string.length - 2, 0));
        } else if (lastChar === '%') {
            return parseStyleLength(element.parentNode) * Number(string.substring(string.length - 1, 0)) / 100;
        } else if (lastChar === 'm') {
            // Not Ready ***
            return Number(string.substring(string.length - 2, 0)) * parseStyleLength(element, window.getComputedStyle(element).fontSize);
        }
        return string;
    }
    function getSize(element) {
        var width,
            height;

        if (element.nodeName in svgTags) {
            width = Number(element.getAttributeNS(null, 'width'));
            height = Number(element.getAttributeNS(null, 'height'));
        } else {
            width = element.style.width;
            height = element.style.height;

            if(width !== '') {
                width = parseStyleLength(element, width);
                height  = parseStyleLength(element, height);
            } else {
                width = parseStyleLength(element, window.getComputedStyle(element).width);
                height = parseStyleLength(element, window.getComputedStyle(element).height);
            }
        }
        return {x: width,y: height};
    }

    function divActionChecker(event) {
        var target = (event.currentTarget === document)? event.target: event.currentTarget,
            clientRect = target.getClientRects()[0],
            right = ((event.pageX - window.scrollX - clientRect.left) > (clientRect.width - margin)),
            bottom = ((event.pageY - window.scrollY - clientRect.top) > (clientRect.height - margin)),
            axes = (right?'x': '') + (bottom?'y': ''),
            action = (axes)?
                'resize' + axes:
                'drag';

        return action;
    }

    function graphicActionChecker(event) {
        var target = (event.currentTarget === document)? event.target: event.currentTarget,
/*            clientRect = target.parentNode.getBoundingClientRect(),
            right = ((event.pageX - window.scrollX - clientRect.left) > (clientRect.width - margin)),
            bottom = ((event.pageY - window.scrollY - clientRect.top) > (clientRect.height - margin)),
*/            clientRect = target.getBoundingClientRect(),
            right = ((event.pageX - window.scrollX - clientRect.left) > (clientRect.width - margin)),
            bottom = ((event.pageY - window.scrollY - clientRect.top) > (clientRect.height - margin)),
            axes = (right?'x': '') + (bottom?'y': ''),
            action = (axes)?
                'resize' + axes:
                'drag';

        return action;
    }

    /**
     * @function
     * @description Introduce random draggable, resizeable graphic nodes to the document (for testing)
     * @param {number} [n] The number of nodes to be added (default: 5)
     */
    function randomGraphics(n) {
        var svgNS = 'http://www.w3.org/2000/svg',
            newGraphic,
            rect,
            parent,
            text,
            title,
            width = window.innerWidth,
            height = window.innerHeight,
            x,
            y,
            translate,
            i,
            buttunFunction = function (e) {
                e.target.innerHTML = e.type;
            };

        if (!svg) {
            svg = document.createElementNS(svgNS, 'svg');
            svg.setAttributeNS (null, 'viewBox', '0 0 ' + width + ' ' + height);
            svg.setAttributeNS (null, 'width', width);
            svg.setAttributeNS (null, 'height', height);
 //           svg.style.setProperty('margin', 0);

            document.body.appendChild(svg);
        }

        if (n < 0 || typeof n !== 'number') {
            n = 5;
        }

        parent = svg;

        for (i = 0; i < n; i++) {
            newGraphic = svg.appendChild(document.createElementNS(svgNS, 'g'));
//            newGraphic.style.setProperty('class', 'interact-demo-node');
            newGraphic.id = 'graphic' + i;
            newGraphic.setAttributeNS (null, 'fill', '#ee0');
            newGraphic.setAttributeNS (null, 'stroke', '#000');
            newGraphic.setAttributeNS (null, 'stroke-width', '2px');

            x = Math.random()*(width - 200);
            y = Math.random()*(width - 200);

            translate = ['translate(', x, ', ', y, ')'].join('');
            newGraphic.setAttributeNS (null, 'transform', translate );

            rect = document.createElementNS(svgNS, 'rect');
            rect.interactDemo = true;
            rect.setAttributeNS (null, 'width', 150);
            rect.setAttributeNS (null, 'height', 150);
            newGraphic.appendChild(rect);

            text = newGraphic.appendChild(document.createElementNS( svgNS, 'text'));
            text.setAttributeNS (null, 'fill', '#000');
            text.setAttributeNS (null, 'stroke', '#000');
            text.setAttributeNS (null, 'stroke-width', '0px');
            rect.text = text;

            title = newGraphic.appendChild(document.createElementNS(svgNS, 'text'));
            title.textContent = newGraphic.id;
            title.setAttributeNS (null, 'fill', '#000');
            title.setAttributeNS (null, 'stroke', '#000');
            title.setAttributeNS (null, 'stroke-width', '0px');
            title.setAttributeNS (null, 'x', 50);
            title.setAttributeNS (null, 'y', 20);

            interact.set(rect, {
                drag: true,
                resize: true,
                actionChecker: graphicActionChecker
            });
            window['g' + i] = newGraphic;
        }
    }
    /**
     * @function
     * @description Introduce random draggable, resizeable nodes to the document (for testing)
     * @param {number} [n] The number of nodes to be added (default: 5)
     * @param {object} [parent] An object with boolean properties (default: document.body)
     */
    function randomDivs(n, parent) {
        var newDiv,
            text,
            button,
            i,
            buttunFunction = function (e) {
                e.target.innerHTML = e.type;
            };

        if (n < 0 || typeof n !== 'number') {
            n = 5;
        }

        parent = parent || document.body;

        for (i = 0; i < n; i++) {
            newDiv = parent.appendChild(document.createElement('div'));
            newDiv.className = 'interact-demo-node';
            newDiv.id = 'node' + i;
            newDiv.interactDemo = true;

            text = newDiv.appendChild(document.createElement('p'));
            newDiv.text = text;
            newDiv.appendChild(document.createElement('br'));
            newDiv.style.left = Math.random()*(window.innerWidth - 200) + 'px';
            newDiv.style.top = Math.random()*(window.innerHeight - 200) + 'px';

            button = newDiv.appendChild(document.createElement('button'));
            button.innerHTML = 'button gets event?';
            button.addEventListener('click', buttunFunction);
            button.addEventListener('mousedown', buttunFunction);
            button.addEventListener('mouseenter', buttunFunction);
            button.addEventListener('mouseleave', buttunFunction);
            button.addEventListener('touchstart', buttunFunction);
            button.addEventListener('touchmove', buttunFunction);
            button.addEventListener('mouseup', buttunFunction);

            interact.set(newDiv, {
                drag: true,
                resize: true,
                actionChecker: divActionChecker
            });
            window['d' + i] = newDiv;
        }
    }

    function setSize(element, x, y) {
        if (element.nodeName in svgTags) {
            if (typeof x === 'number') {
                element.setAttributeNS(null, 'width', x);
            }
            if (typeof y === 'number') {
                element.setAttributeNS(null, 'height', y);
            }
        } else {
            if (typeof x === 'number') {
                x += 'px';
            }
            if (typeof y === 'number') {
                y += 'px';
            }

            if (typeof x === 'string') {
                element.style.setProperty('width', x);
            }
            if (typeof y === 'string') {
                element.style.setProperty('height', y);
            }
        }
    }

    function getPosition(element){
        var clientRect = element.getBoundingClientRect(),
            compStyle = window.getComputedStyle(element),
            left = clientRect.left + window.scrollX - parseStyleLength(element, compStyle.marginLeft),
            top = clientRect.top + window.scrollY - parseStyleLength(element, compStyle.marginTop);

        if (element.nodeName in svgTags) {
            var svgElement = element.ownerSVGElement,
                svgParent = svgElement.parentNode,
                svgParentPosition = getPosition(svgParent),
                svgParentStyle = window.getComputedStyle(svgParent);

            left -= (svgParentPosition.x +
                parseStyleLength(svgParent, svgParentStyle.marginLeft) +
                parseStyleLength(svgParent, svgParentStyle.paddingLeft) +
                parseStyleLength(svgParent, svgParentStyle.borderLeftWidth));
            top -= (svgParentPosition.y +
                parseStyleLength(svgParent, svgParentStyle.marginTop) +
                parseStyleLength(svgParent, svgParentStyle.paddingTop) +
                parseStyleLength(svgParent, svgParentStyle.borderTopWidth));
        }
        return {x: left, y: top};
    }

    function setPosition(element, x, y) {
        var translate;

        if (element.nodeName in svgTags) {
            if (typeof x === 'number' && typeof y === 'number') {
                translate = 'translate(' + x + ', ' + y + ')';
                element.parentNode.setAttributeNS(null, 'transform', translate);
            }
        } else if (typeof x === 'number' && typeof y === 'number') {
            element.style.setProperty('left', x + 'px', '');
            element.style.setProperty('top', y + 'px', '');
        }
    }
    
    // /translate[\s]*[(][\s]*([0-9]+)[,\s]+([0-9]+)\s*[)]/
    function getTransform(element, property) {
        var transform = element.getAttribute('transform'),
            transformations = {
                translate: 2,
                scale: 2,
                rotate: 3,
                skewX: 1,
                skewY: 1,
                matrix: 6
            },
            regExp = new RegExp(property + '\\s*\\(\\s*[^)]*\\)', 'i'),
            numbers,
            i,
            r;
        
        if (property in transformations && (transform = transform.match(regExp))) {
            
            if (transform) {
                transform = transform[0];
            }
            
            // Get the numbers out
            regExp = /([\d\.]+)/g;
            numbers = transform.match(regExp);
            r = numbers;
        } else {
            r = transform;
        }
        return r;
    }

    // Display event properties for debugging
    function nodeEventDebug(e) {
        var textProp,
            nl;

        if (e.target.nodeName in svgTags) {
            textProp = 'textContent';
            nl = '\n';
        } else {
            textProp = 'innerHTML';
            nl = '<br> ';
        }

        if ( e.target.interactDemo && e.type in interact.eventDict()) {
            e.target.text[textProp] = nl + interact.eventDict(e.type) + ' x0, y0    :    (' + e.detail.x0 + ', ' + e.detail.y0 + ')';
            e.target.text[textProp] += nl + ' dx, dy        :    (' + e.detail.dx + ', ' + e.detail.dy + ')';
            e.target.text[textProp] += nl + ' pageX, pageY    :    (' + e.detail.pageX + ', ' + e.detail.pageY + ')';
        }
    }

    function eventProps(e) {
        var debug = '',
            prop;
        if (typeof e.detail === 'object') {
            debug += 'event.detail: ';
            for (prop in e.detail) {
                if (e.detail.hasOwnProperty(prop)) {
                    debug += '\n    ' + prop + ' : ' + e.detail[prop];
                }
            }
        }
        if (event.touches && event.touches.length) {
            debug += 'touches[0]: ';
            for (prop in e.touches[0]) {
                if (e.touches[0].hasOwnProperty(prop)) {
                    debug += '\n    ' + prop + ' : ' + e.touches[0][prop];
                }
            }
        }
        for (prop in e) {
            if (e.hasOwnProperty(prop)) {
                debug += '\n' + prop + ' : ' + e[prop];
            }
        }

        return debug;
    }

    function realtimeMove(e) {
        var position = getPosition(e.target),
            left = position.x + (e.detail.pageX - prevX),
            top = position.y + (e.detail.pageY - prevY);

        setPosition(e.target, left, top);
    }

    function staticMove(e) {
        var position = getPosition(e.target),
            left = position.x + e.detail.dx,
            top = position.y + e.detail.dy,
            debug = '';

        setPosition(e.target, left, top);
    }

    function staticResize(e) {
        var target = e.target,
            size = getSize(target),
            newWidth = Math.max((size.x + e.detail.dx), minSize),
            newHeight = Math.max((size.y + e.detail.dy), minSize);

        // Square resizing when Shift key is held
        if (e.detail.shiftKey) {
            if (newWidth > newHeight) {
                newHeight = newWidth;
            } else {
                newWidth = newHeight;
            }
        }

        setSize(target, newWidth, newHeight);
    }

    function ResizeMove(e) {
        var target = e.target,
            position = getPosition(target),
            size,
            newWidth,
            newHeight;

        if (e.detail.pageX < (position.x + minSize + margin)) {
            newWidth = null;
        } else {
            size = getSize(target);
            newWidth = (e.detail.axes === 'x' || e.detail.axes === 'xy' )?
                Math.max(size.x + (e.detail.pageX - prevX), minSize):
                null;
        }
        if (e.detail.pageY < (position.y + minSize + margin)) {
            newHeight = null;
        } else {
            size = size || getSize(target);
            newHeight = (e.detail.axes === 'y' || e.detail.axes === 'xy' )?
                Math.max(size.y + (e.detail.pageY - prevY), minSize):
                null;
        }

        // Square resizing when Shift key is held
        if (e.detail.shiftKey) {
            if (newWidth > newHeight) {
                newHeight = newWidth;
            } else {
                newWidth = newHeight;
            }
        }

        setSize(target, newWidth, newHeight);
    }

    function realtimeUpdate(newValue) {
        if (newValue !== undefined) {
            return realtime = Boolean(newValue);
        } else {
            return realtime;
        }
    }

    document.addEventListener('interactresizeend', function (e) {
        if (!realtime) {
            staticResize(e);
        }
    });

    document.addEventListener('interactresizemove', function (e) {
        if (realtime) {
            ResizeMove(e);
        }
    });

    document.addEventListener('interactdragmove', function (e) {
        if (realtime) {
            realtimeMove(e);
        }
    });

    document.addEventListener('interactdragend', function (e) {
        if (!realtime) {
            staticMove(e);
        }
    });

    // Display event properties for debugging
    document.addEventListener('interactresizestart', nodeEventDebug);
    document.addEventListener('interactresizemove', nodeEventDebug);
    document.addEventListener('interactresizeend', nodeEventDebug);
    document.addEventListener('interactdragstart', nodeEventDebug);
    document.addEventListener('interactdragmove', nodeEventDebug);
    document.addEventListener('interactdragend', nodeEventDebug);

    // These events must happen after the others so preVx !== e.detail.pageX for other event listeners
    document.addEventListener('interactdragstart', function(e) {
        prevX = e.detail.pageX;
        prevY = e.detail.pageY;
    });
    document.addEventListener('interactdragmove', function(e) {
        prevX = e.detail.pageX;
        prevY = e.detail.pageY;
    });
    document.addEventListener('interactresizestart', function(e) {
        prevX = e.detail.pageX;
        prevY = e.detail.pageY;
    });
    document.addEventListener('interactresizemove', function(e) {
        prevX = e.detail.pageX;
        prevY = e.detail.pageY;
    });

    interactDemo.randomDivs = randomDivs;
    interactDemo.randomGraphics = randomGraphics;
    interactDemo.setSize = setSize;
    interactDemo.setPosition = setPosition;
    interactDemo.nodeEventDebug = nodeEventDebug;
    interactDemo.eventProps = eventProps;
    interactDemo.staticMove = staticMove;
    interactDemo.realtimeMove = realtimeMove;
    interactDemo.graphicActionChecker = graphicActionChecker;
    interactDemo.divActionChecker = divActionChecker;
    interactDemo.getSize = getSize;
    interactDemo.getPosition = getPosition;
    interactDemo.realtimeUpdate = realtimeUpdate;
    interactDemo.getTransform = getTransform;

    if (!('$' in window)) {
        window.$ = function (id) {
            return document.getElementById(id);
        };
    }
    return interactDemo;
}(window.interact));

window.setTimeout(function () {
    window.s = document.querySelector('svg');
    window.g = document.getElementById('graphic0');
    window.r = document.querySelector('#graphic0 rect');
    p = s.createSVGPoint();
}, 2000);



window.getTransform = interactDemo.getTransform;
    
    
