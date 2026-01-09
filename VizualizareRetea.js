import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const VizualizareRetea = ({ config, activations }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!config?.straturi) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 400;
        const height = 300;
        const neuronRadius = 12;

        
        const layers = [2, ...config.straturi, 1];
        const layerSpacing = width / (layers.length + 1);

        
        layers.forEach((currentNeurons, layerIndex) => {
            if (layerIndex === 0) return;

            const prevNeurons = layers[layerIndex - 1];
            const x1 = layerIndex * layerSpacing;
            const x2 = (layerIndex + 1) * layerSpacing;

            for (let i = 0; i < prevNeurons; i++) {
                for (let j = 0; j < currentNeurons; j++) {
                    const y1 = (height / (prevNeurons + 1)) * (i + 1);
                    const y2 = (height / (currentNeurons + 1)) * (j + 1);

                    svg.append('line')
                        .attr('x1', x1)
                        .attr('y1', y1)
                        .attr('x2', x2)
                        .attr('y2', y2)
                        .attr('stroke', '#e0e0e0')
                        .attr('stroke-width', 1);
                }
            }
        });

        
        layers.forEach((neurons, layerIndex) => {
            const x = (layerIndex + 1) * layerSpacing;

            for (let i = 0; i < neurons; i++) {
                const y = (height / (neurons + 1)) * (i + 1);

                const activationValue = activations[layerIndex]?.data[i] || 0;
                const intensity = 0.3 + activationValue * 0.7;
                const color = `rgba(76, 175, 80, ${Math.min(0.9, intensity)})`;

                svg.append('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', neuronRadius)
                    .attr('fill', color)
                    .attr('stroke', '#2E7D32')
                    .attr('stroke-width', 2)
                    .attr('class', 'neuron');
            }
        });

    }, [config, activations]);

    return (
        <div className="vizualizare-retea-content">
            <h3>Arhitectura Rețelei Neuronale</h3>
            <svg
                ref={svgRef}
                width="400"
                height="300"
                style={{
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    display: 'block',
                    margin: '0 auto'
                }}
            ></svg>
        </div>
    );
};

export default VizualizareRetea;