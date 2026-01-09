import React, { useState, useEffect } from 'react';
import Slider from 'react-slider';

const PanouControl = ({ config, setConfig, antreneazaModel, isTraining }) => {
    const [localRataInv, setLocalRataInv] = useState(config.rataInv);
    const [localStraturiRaw, setLocalStraturiRaw] = useState(config.straturiRaw);
    const functiiActivare = ['tanh', 'sigmoid', 'relu', 'linear'];
    const seturiDate = ['cercuri', 'xor', 'regresie', '3-cercuri', 'spirale', 'grid'];

    
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localRataInv !== config.rataInv) {
                setConfig({ ...config, rataInv: localRataInv });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [localRataInv, config, setConfig]);

    
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localStraturiRaw !== config.straturiRaw) {
                setConfig({ ...config, straturiRaw: localStraturiRaw });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localStraturiRaw, config, setConfig]);

    const getNumeSetDate = (tip) => {
        const nume = {
            'cercuri': 'Cercuri Concentrice',
            'xor': 'XOR',
            'regresie': 'Regresie Liniară',
            '3-cercuri': '3 Cercuri Concentrice',
            'spirale': 'Spirale',
            'grid': 'Grid'
        };
        return nume[tip] || tip;
    };

    const handleStraturiChange = (e) => {
        const value = e.target.value;
        setLocalStraturiRaw(value);
    };

    const handleStraturiBlur = (e) => {
        const value = e.target.value;
        
        if (!value.trim()) {
            setLocalStraturiRaw('4, 2');
            setConfig({ ...config, straturiRaw: '4, 2' });
        }
    };

    return (
        <div className="panou-control">
            <h2>Configurare Rețea</h2>

            <div className="control">
                <label>Funcție de activare:</label>
                <select
                    value={config.activare}
                    onChange={(e) => setConfig({ ...config, activare: e.target.value })}
                >
                    {functiiActivare.map(f => (
                        <option key={f} value={f}>{f}</option>
                    ))}
                </select>
            </div>

            <div className="control">
                <label>Rata de învățare: {localRataInv.toFixed(3)}</label>
                <Slider
                    min={0.001}
                    max={0.1}
                    step={0.001}
                    value={localRataInv}
                    onChange={(value) => setLocalRataInv(value)}
                />
            </div>

            <div className="control">
                <label>Straturi ascunse</label>
                <input
                    type="text"
                    value={localStraturiRaw}
                    onChange={handleStraturiChange}
                    onBlur={handleStraturiBlur}
                    placeholder="ex: 4,2"
                />
                <small>Introdu numere pozitive separate prin virgulă</small>
            </div>

            <div className="control">
                <label>Set de date:</label>
                <select
                    value={config.setDate}
                    onChange={(e) => setConfig({ ...config, setDate: e.target.value })}
                >
                    {seturiDate.map(d => (
                        <option key={d} value={d}>{getNumeSetDate(d)}</option>
                    ))}
                </select>
            </div>

            <div className="control">
                <label>Zgomot: {config.zgomot.toFixed(2)}</label>
                <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={config.zgomot}
                    onChange={(value) => setConfig({ ...config, zgomot: value })}
                />
            </div>

            <div className="control">
                <label>Split Antrenament/Test: {config.splitRatio * 100}% antrenament</label>
                <Slider
                    min={0.5}
                    max={0.9}
                    step={0.05}
                    value={config.splitRatio}
                    onChange={(value) => setConfig({ ...config, splitRatio: value })}
                />
            </div>

            <button
                onClick={antreneazaModel}
                disabled={isTraining}
                className={isTraining ? 'buton-disabled' : 'buton-antrenare'}
            >
                {isTraining ? 'Se antrenează...' : 'Antrenează (Epoca)'}
            </button>
        </div>
    );
};

export default PanouControl;