function ComparatieComponent({ snapshots }) {
    return (
        <div className="comparatie">
            {snapshots.map((snap, i) => (
                <div key={i}>
                    <h3>Snapshot #{i + 1}</h3>
                    <p>Config: {JSON.stringify(snap.config)}</p>
                    <p>Eroare finală: {snap.lossHistory.slice(-1)[0]}</p>
                </div>
            ))}
        </div>
    );
}