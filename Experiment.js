import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import PanouControl from './PanouControl';
import VizualizareDate from './VizualizareDate';
import VizualizareRetea from './VizualizareRetea';
import { genereazaDateComplexe } from '../utile/generatoareDate';
import './Experiment.css';

const Experiment = () => {
    const [config, setConfig] = useState({
        straturi: [4, 2],
        straturiRaw: '4, 2',
        activare: 'tanh',
        rataInv: 0.03,
        setDate: 'cercuri',
        zgomot: 0.1,
        splitRatio: 0.7,
        epoci: 0,
        loss: 0,
        accuracy: 0,
        testAccuracy: 0
    });

    const [dateAntrenament, setDateAntrenament] = useState([]);
    const [dateTest, setDateTest] = useState([]);
    const [model, setModel] = useState(null);
    const [isTraining, setIsTraining] = useState(false);
    const [activations, setActivations] = useState([]);
    const modelRef = useRef();
    const trainingInProgress = useRef(false);
    const shouldCaptureActivations = useRef(false);
    const isMountedRef = useRef(true);

    const createModel = useCallback((layers, activation, learningRate) => {
        
        if (!layers || layers.length === 0 || layers.some(layer => layer <= 0)) {
            console.log("Layers invalid, folosim default [4, 2]");
            layers = [4, 2];
        }

        
        if (modelRef.current) {
            try {
                if (!modelRef.current.disposed) {
                    modelRef.current.dispose();
                    console.log("Model vechi disposed");
                }
            } catch (error) {
                console.log("Model deja disposed:", error.message);
            }
        }

        const model = tf.sequential();

        
        model.add(tf.layers.dense({
            units: layers[0],
            inputShape: [2],
            activation: activation
        }));

        
        layers.slice(1).forEach(units => {
            model.add(tf.layers.dense({
                units,
                activation: activation
            }));
        });

        
        model.add(tf.layers.dense({
            units: 1,
            activation: 'sigmoid'
        }));

        model.compile({
            optimizer: tf.train.adam(learningRate),
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });

        console.log("Model nou creat cu straturi:", layers);
        return model;
    }, []);

    
    const parseAndValidateStraturi = useCallback((straturiRaw) => {
        if (!straturiRaw.trim()) {
            return [4, 2]; 
        }

        const straturi = straturiRaw
            .split(',')
            .map(num => parseInt(num.trim()))
            .filter(n => !isNaN(n) && n > 0); 

        return straturi.length > 0 ? straturi : [4, 2];
    }, []);

    
    useEffect(() => {
        const toateDatele = genereazaDateComplexe(1000, config.zgomot, config.setDate);
        const splitIndex = Math.floor(toateDatele.length * config.splitRatio);

        setDateAntrenament(toateDatele.slice(0, splitIndex));
        setDateTest(toateDatele.slice(splitIndex));

        console.log("Date regenerate pentru zgomot/split/setDate");
    }, [config.setDate, config.zgomot, config.splitRatio]);

    
    useEffect(() => {
        isMountedRef.current = true;

        const timer = setTimeout(() => {
            
            trainingInProgress.current = false;
            setIsTraining(false);
            shouldCaptureActivations.current = false;

            if (!isMountedRef.current) return;

            
            setActivations([]);

            const straturiValid = parseAndValidateStraturi(config.straturiRaw);
            const newModel = createModel(straturiValid, config.activare, config.rataInv);

            if (isMountedRef.current) {
                modelRef.current = newModel;
                setModel(newModel);

                
                setConfig(prev => ({
                    ...prev,
                    epoci: 0,
                    loss: 0,
                    accuracy: 0,
                    testAccuracy: 0,
                    straturi: straturiValid
                }));
            }
        }, 300); 

        return () => {
            isMountedRef.current = false;
            clearTimeout(timer);
        };
    }, [config.straturiRaw, config.activare, config.rataInv, createModel, parseAndValidateStraturi]);

    const antreneazaModel = async () => {
        if (!modelRef.current || trainingInProgress.current) return;

        
        if (isModelDisposed()) {
            console.log("Model disposed, recreating...");
            const straturiValid = parseAndValidateStraturi(config.straturiRaw);
            const newModel = createModel(straturiValid, config.activare, config.rataInv);
            modelRef.current = newModel;
            setModel(newModel);
        }

        trainingInProgress.current = true;
        setIsTraining(true);

        try {
            const features = dateAntrenament.map(d => [d.x, d.y]);
            const labels = dateAntrenament.map(d => d.label);

            const xs = tf.tensor2d(features);
            const ys = tf.tensor2d(labels, [labels.length, 1]);

            shouldCaptureActivations.current = true;

            const history = await modelRef.current.fit(xs, ys, {
                epochs: 1,
                batchSize: 32,
                callbacks: {
                    onEpochEnd: async (epoch, logs) => {
                        setConfig(prev => ({
                            ...prev,
                            epoci: prev.epoci + 1,
                            loss: logs.loss.toFixed(4),
                            accuracy: logs.acc ? logs.acc.toFixed(4) : 0
                        }));

                        if (shouldCaptureActivations.current) {
                            await captureAndSetActivations();
                        }
                        await calculeazaAcurateteTest();
                    }
                }
            });

            tf.dispose([xs, ys]);
        } catch (error) {
            console.error("Eroare la antrenare:", error);
            if (error.message.includes('disposed')) {
                
                const straturiValid = parseAndValidateStraturi(config.straturiRaw);
                const newModel = createModel(straturiValid, config.activare, config.rataInv);
                modelRef.current = newModel;
                setModel(newModel);
            }
        } finally {
            trainingInProgress.current = false;
            setIsTraining(false);
            shouldCaptureActivations.current = false;
        }
    };

    const isModelDisposed = () => {
        if (!modelRef.current) return true;

        try {
            
            const testTensor = tf.tensor2d([[0, 0]]);
            const testResult = modelRef.current.predict(testTensor);
            testTensor.dispose();
            testResult.dispose();
            return false;
        } catch (error) {
            return true;
        }
    };

    const captureAndSetActivations = async () => {
        if (!modelRef.current || !dateAntrenament || dateAntrenament.length === 0) {
            return;
        }

        
        if (!shouldCaptureActivations.current || isModelDisposed()) {
            console.log("Nu se capturează activări - model disposed sau anulat");
            return;
        }

        try {
            const sampleInput = tf.tensor2d([[dateAntrenament[0].x, dateAntrenament[0].y]]);
            const layerOutputs = [];
            let currentOutput = sampleInput;

            for (const layer of modelRef.current.layers) {
                if (isModelDisposed()) {
                    console.log("Model disposed durante capturarea activărilor");
                    tf.dispose(sampleInput);
                    return;
                }

                currentOutput = layer.apply(currentOutput);
                const data = await currentOutput.data();
                layerOutputs.push({
                    data: Array.from(data),
                    shape: currentOutput.shape
                });
                
            }

            setActivations(layerOutputs);
            tf.dispose(sampleInput);
            
            if (currentOutput !== sampleInput) {
                tf.dispose(currentOutput);
            }
        } catch (error) {
            console.error("Eroare la capturarea activărilor:", error);
            if (error.message.includes('disposed')) {
                shouldCaptureActivations.current = false;
            }
        }
    };

    const calculeazaAcurateteTest = async () => {
        if (!modelRef.current || !dateTest || dateTest.length === 0) return;

        if (isModelDisposed()) {
            console.log("Model disposed, nu se poate calcula acuratețea");
            return;
        }

        try {
            const features = dateTest.map(d => [d.x, d.y]);
            const labels = dateTest.map(d => d.label);

            const xs = tf.tensor2d(features);
            const predictions = modelRef.current.predict(xs);
            const predData = await predictions.data();

            let correct = 0;
            for (let i = 0; i < labels.length; i++) {
                const predictedClass = predData[i] > 0.5 ? 1 : 0;
                if (predictedClass === labels[i]) correct++;
            }

            const accuracy = (correct / labels.length).toFixed(4);
            setConfig(prev => ({ ...prev, testAccuracy: accuracy }));

            tf.dispose([xs, predictions]);
        } catch (error) {
            console.error("Eroare la calculul acurateței test:", error);
        }
    };

    
    const setConfigSafe = useCallback((newConfig) => {
        setConfig(prev => {
            const updatedConfig = typeof newConfig === 'function' ? newConfig(prev) : newConfig;

            
            const straturiSchimbate =
                updatedConfig.straturiRaw !== prev.straturiRaw;

            if (straturiSchimbate) {
                console.log("Straturi schimbate, se va recrea modelul");
                
                trainingInProgress.current = false;
                setIsTraining(false);
                shouldCaptureActivations.current = false;

                
                const straturiValid = parseAndValidateStraturi(updatedConfig.straturiRaw);
                updatedConfig.straturi = straturiValid;

                
                if (updatedConfig.straturiRaw !== straturiValid.join(', ')) {
                    updatedConfig.straturiRaw = straturiValid.join(', ');
                }
            }

            return updatedConfig;
        });
    }, [parseAndValidateStraturi]);

    
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (modelRef.current) {
                try {
                    modelRef.current.dispose();
                } catch (error) {
                    console.log("Eroare la disposal model:", error);
                }
            }
        };
    }, []);

    return (
        <div className="experiment">
            <div className="container-experiment">
                <PanouControl
                    config={config}
                    setConfig={setConfigSafe}
                    antreneazaModel={antreneazaModel}
                    isTraining={isTraining}
                />

                <div className="vizualizari-experiment">
                    <div className="vizualizare-date-container">
                        <VizualizareDate
                            date={dateAntrenament}
                            model={modelRef.current}
                            epocaCurenta={config.epoci}
                        />
                    </div>

                    <div className="vizualizare-retea">
                        <VizualizareRetea
                            config={config}
                            activations={activations}
                        />
                    </div>
                </div>
            </div>

            <div className="statistici-experiment">
                <div className="metrici-container">
                    <h3>Metrici de Performanță</h3>
                    <div className="metrici-grid">
                        <div className="metrica">
                            <span className="metrica-label">Epocă curentă</span>
                            <span className="metrica-valoare">{config.epoci}</span>
                        </div>
                        <div className="metrica">
                            <span className="metrica-label">Eroare (Loss)</span>
                            <span className="metrica-valoare">{config.loss}</span>
                        </div>
                        <div className="metrica">
                            <span className="metrica-label">Acuratețe Antrenament</span>
                            <span className="metrica-valoare">{config.accuracy}</span>
                        </div>
                        <div className="metrica">
                            <span className="metrica-label">Acuratețe Test</span>
                            <span className="metrica-valoare">{config.testAccuracy}</span>
                        </div>
                    </div>
                </div>

                <div className="informatii-set-date">
                    <h3>Informații Set Date</h3>
                    <div className="date-info">
                        <p>Total puncte: <strong>{dateAntrenament.length + dateTest.length}</strong></p>
                        <p>Antrenament: <strong>{dateAntrenament.length}</strong> ({config.splitRatio * 100}%)</p>
                        <p>Test: <strong>{dateTest.length}</strong> ({(1 - config.splitRatio) * 100}%)</p>
                        <p>Tip date: <strong>{config.setDate}</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Experiment;