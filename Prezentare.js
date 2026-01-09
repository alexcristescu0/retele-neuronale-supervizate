import React from 'react';
import { Link } from 'react-router-dom';
import './Prezentare.css';

const Prezentare = () => {
    return (
        <div className="pagina-prezentare">
            <header className="header-prezentare">
                <h1>Aplicație WEB privind aplicațiile cu modele neuronale supervizate</h1>
            </header>

            <section className="introducere">
                <h2>Despre aplicație</h2>
                <p>
                    Această aplicație este o platformă web interactivă ce permite utilizatorului să exploreze conceptele fundamentale ale rețelelor neuronale supervizate într-un mod intuitiv.
                </p>
            </section>

            <section className="functionalitati">
                <h2>Funcționalități Principale</h2>
                <div className="grid-functionalitati">
                    <div className="card-functionalitate">
                        <h3>Vizualizarea datelor</h3>
                        <p>Generare și vizualizare pentru multiple seturi de date (cercuri, XOR, spirale, grid)</p>
                    </div>
                    <div className="card-functionalitate">
                        <h3>Rețele neuronale configurabile</h3>
                        <p>Arhitecturi configurabile cu multiple straturi ascunse</p>
                    </div>
                    <div className="card-functionalitate">
                        <h3>Metrici de Performanță</h3>
                        <p>Evaluarea acurateței pe seturi de antrenament și test</p>
                    </div>
                    <div className="card-functionalitate">
                        <h3>Antrenament în Timp Real</h3>
                        <p>Vizualizarea procesului de învățare în timp real </p>
                    </div>
                </div>
            </section>

            <section className="tehnologii">
                <h2>Tehnologii Utilizate</h2>
                <div className="tehnologii-list">
                    <span className="tech-tag">React.js</span>
                    <span className="tech-tag">TensorFlow.js</span>
                    <span className="tech-tag">D3.js</span>
                    <span className="tech-tag">CSS3</span>
                    <span className="tech-tag">HTML5</span>
                </div>
            </section>

            <section className="acces-aplicatie">
                
                <Link to="/experiment" className="buton-primar">
                    Accesează Aplicația
                </Link>
            </section>

            <footer className="footer-prezentare">
                <p>Proiect realizat pentru demonstrarea algoritmilor de învățare automată supervizată</p>
                
            </footer>
        </div>
    );
};

export default Prezentare;