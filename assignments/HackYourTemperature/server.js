import express from 'express';
import fetch from 'node-fetch';
import { keys } from './sources/key.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from backend to frontend!');
});

app.post('/weather', async (req, res) => {
    const { cityName } = req.body;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${keys.API_KEY}`;
    const options = {
        method: 'GET', 
        headers: { 'Content-Type': 'application/json' },
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (data.cod === '404') {
            res.json({ weatherText: 'City is not found!' });
        } else {
            const temperature = data.main.temp;
            const temperatureCelsius = temperature - 273.15;
            res.json({ weatherText: `Weather in ${cityName}: ${temperatureCelsius.toFixed(0)}°C` });
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
