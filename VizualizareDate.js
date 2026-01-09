
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as tf from '@tensorflow/tfjs';

const VizualizareDate = ({ date, model, epocaCurenta }) => {
    const svgRef = useRef();
    const canvasRef = useRef();
    const [animationFrame, setAnimationFrame] = useState(null);

    useEffect(() => {
        if (!date || !date.length) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 400;
        const height = 400;
        const margin = 20;

        const xScale = d3.scaleLinear()
            .domain([-6, 6])
            .range([margin, width - margin]);

        const yScale = d3.scaleLinear()
            .domain([-6, 6])
            .range([height - margin, margin]);

        
        svg.append('g')
            .attr('transform', `translate(0, ${height / 2})`)
            .call(d3.axisBottom(xScale));

        svg.append('g')
            .attr('transform', `translate(${width / 2}, 0)`)
            .call(d3.axisLeft(yScale));

        
        svg.selectAll('.punct')
            .data(date)
            .enter()
            .append('circle')
            .attr('class', 'punct')
            .attr('cx', d => xScale(d.x))
            .attr('cy', d => yScale(d.y))
            .attr('r', 0) 
            .attr('fill', d => d.label === 1 ? 'blue' : 'red')
            .transition()
            .duration(1000)
            .attr('r', 4);

        if (model) {
            drawDecisionBoundary();
        }

        async function drawDecisionBoundary() {
            if (animationFrame) cancelAnimationFrame(animationFrame);

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const gridSize = 50;
            const grid = [];
            for (let x = -6; x <= 6; x += 12 / gridSize) {
                for (let y = -6; y <= 6; y += 12 / gridSize) {
                    grid.push([x, y]);
                }
            }

            const startTime = Date.now();
            const duration = 1500;

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                tf.tidy(() => {
                    const predictions = model.predict(tf.tensor2d(grid)).dataSync();

                    let index = 0;
                    for (let x = -6; x <= 6; x += 12 / gridSize) {
                        for (let y = -6; y <= 6; y += 12 / gridSize) {
                            const alpha = 0.1 * progress;
                            const prediction = predictions[index++];
                            ctx.fillStyle = prediction > 0.5
                                ? `rgba(0, 0, 255, ${alpha})`
                                : `rgba(255, 0, 0, ${alpha})`;
                            ctx.fillRect(
                                xScale(x) - 6,
                                yScale(y) - 6,
                                12, 12
                            );
                        }
                    }
                });

                if (progress < 1) {
                    setAnimationFrame(requestAnimationFrame(animate));
                }
            };

            animate();
        }

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [date, model, epocaCurenta]);

    return (
        <div className="vizualizare-container">
            <svg ref={svgRef} width="400" height="400"></svg>
            <canvas
                ref={canvasRef}
                width="400"
                height="400"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none'
                }}
            />
        </div>
    );
};

export default VizualizareDate;