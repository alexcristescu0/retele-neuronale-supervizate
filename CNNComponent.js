import * as tf from '@tensorflow/tfjs';

function CNNComponent() {
    const [model, setModel] = useState(null);

    useEffect(() => {
        const cnnModel = tf.sequential();
        cnnModel.add(tf.layers.conv2d({
            inputShape: [28, 28, 1],
            filters: 32,
            kernelSize: 3,
            activation: 'relu'
        }));
        cnnModel.add(tf.layers.maxPooling2d({ poolSize: 2 }));
        cnnModel.add(tf.layers.flatten());
        cnnModel.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

        cnnModel.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy' });
        setModel(cnnModel);
    }, []);

    
}