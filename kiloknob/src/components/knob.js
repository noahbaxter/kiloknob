import React, { useState, useRef, useEffect } from 'react';
import knobBase from './Knob Base.svg'
import './knob.css'

import { clipNumber, degToRad, roundNumber } from './utils';

function Knob({ paramName, paramValueChange}) {

    const [dragging, setDragging] = useState(false);
    const [paramValue, setParamValue] = useState(50);
    const [rotation, setRotation] = useState(0);
    
    let startY = 0;
    const dragRangePixels = 400;    // resolution
    const highValue = 100;
    const lowValue = 0;
    const highAngle = 140;
    const lowAngle = -140;

    const handleMouseDown = (e) => {
        startY = e.clientY;
        setDragging(true);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    const handleMouseMove = (e) => {
        let pixelDelta = startY - e.clientY;
        let _paramValue = clipNumber(lowValue, ((pixelDelta / dragRangePixels) * (highValue - lowValue)) + paramValue, highValue);
        changeParamValue(_paramValue);
    }

    const changeParamValue = (_paramValue) => {
        let _rotation = ((_paramValue / (highValue - lowValue)) * (highAngle - lowAngle)) + lowAngle; // deg from up-center

        // rotate knob
        document.getElementById('knobBase').style.transform = `rotate(${_rotation}deg)`;

        setParamValue(_paramValue);
        setRotation(_rotation);
        paramValueChange(_paramValue);
    }

    const handleMouseUp = (e) => {
        setDragging(false);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
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
        let radius = (canvas.width / 2)*.65;
        let startAngle = degToRad(lowAngle);
        let endAngle = degToRad(rotation);
        
        context.beginPath();
        context.lineWidth = 15;
        context.arc(centerX, centerY, radius, startAngle, endAngle);
        context.strokeStyle = "rgb(108, 153, 255)";
        context.stroke();

        // remaining path
        startAngle = degToRad(rotation);
        endAngle = degToRad(highAngle);
        
        context.beginPath();
        context.arc(centerX, centerY, radius, startAngle, endAngle);
        context.strokeStyle = "rgb(85, 85, 85)";
        context.stroke();
    }, [rotation]);

    return (
        <div className="paramContainer">
            <div className="paramName">
                {paramName}
            </div>
            
            <div className="paramKnob" onMouseDown={handleMouseDown}>
                <canvas id="knobPath" ref={canvasRef}/>
                <img id="knobBase" src={knobBase} draggable="false"/>
            </div>

            <div className="paramValueContainer" style={{ "visibility": dragging ? 'visible' : 'hidden' }}>
                <div className="paramValue">{roundNumber(paramValue)}%</div>
            </div>
        </div>
    );
}

export default Knob;