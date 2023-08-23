import React, { useState, useRef, useEffect } from 'react';
import knobBase from './Knob Base.svg'
import './knob.css'

import { clipNumber, roundNumber } from './utils';

function Knob(props) {

    const [dragging, setDragging] = useState(false);
    const [paramValue, setParamValue] = useState(50);
    const [rotation, setRotation] = useState(0);
    
    let startY = 0;
    const rangePixels = 400;
    const highValue = 100;
    const lowValue = 0;
    const highAngle = 140;
    const lowAngle = -140;

    // normalized min/current/max values
    const normLow = 20;
    const normHigh = 80;
    let normValue = 50;

    // nice to have
    // double click
    // timeout before value disapears

    const handleMouseDown = (e) => {
        startY = e.clientY;
        setDragging(true);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    const handleMouseMove = (e) => {
        let pixelDelta = startY - e.clientY;
        let _paramValue = clipNumber(lowValue, ((pixelDelta / rangePixels) * (highValue - lowValue)) + paramValue, highValue);
        changeParamValue(_paramValue);
    }

    const changeParamValue = (_paramValue) => {
        let _rotation = ((_paramValue / (highValue - lowValue)) * (highAngle - lowAngle)) + lowAngle; // deg from up-center

        // rotate encoder
        const imageElement = document.getElementById('knobBase');
        imageElement.style.transform = `rotate(${_rotation}deg)`;

        setParamValue(_paramValue);
        setRotation(_rotation);
    }

    const handleMouseUp = (e) => {
        setDragging(false);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }

    function defToRad(degree){
        return ((degree - 90) / 360) * 2 * Math.PI;
    }

    const canvasRef = useRef(null);
    useEffect(() => {
        // force proper resolution
        const canvas = canvasRef.current;
        const clientRect = canvas.getBoundingClientRect();
        canvas.width = clientRect.width;
        canvas.height = clientRect.height;

        const context = canvas.getContext("2d");

        // active path

        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;
        let radius = (canvas.width / 2)*.75;
        let startAngle = defToRad(lowAngle);
        let endAngle = defToRad(rotation);
        
        context.beginPath();
        context.lineWidth = 15;
        context.arc(centerX, centerY, radius, startAngle, endAngle);
        context.strokeStyle = "rgb(108, 153, 255)";
        context.stroke();

        // remainding path

        startAngle = defToRad(rotation);
        endAngle = defToRad(highAngle);
        
        context.beginPath();
        context.arc(centerX, centerY, radius, startAngle, endAngle);
        context.strokeStyle = "rgb(85, 85, 85)";
        context.stroke();
        
    }, [rotation]);


    return (
        <div className="paramContainer" style={{ "--normLow": `${normLow}%`, "--normValue": `${normValue}%`, "--normHigh": `${normHigh}%` }}>
            <div className="paramName">
                {props.paramName}
            </div>
            
            <div className="paramKnob" onMouseDown={handleMouseDown}>
                <canvas ref={canvasRef}/>
                <img id="knobBase" src={knobBase} draggable="false"/>
            </div>

            <div className="paramValueContainer" style={{ "visibility": dragging ? 'visible' : 'hidden' }}>
                <div className="paramValue">{roundNumber(paramValue)}%</div>
            </div>
        </div>
    );
}

export default Knob;