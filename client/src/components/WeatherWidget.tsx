import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudLightning, Wind } from 'lucide-react';

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

export function WeatherWidget({ lat, lng }: { lat: number; lng: number }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch weather");
        return res.json();
      })
      .then(data => {
        setWeather(data.current_weather);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [lat, lng]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex justify-center items-center h-24 mt-6">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="flex-1 space-y-3 py-1">
            <div className="h-2 bg-gray-200 rounded w-24"></div>
            <div className="h-2 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return null; // Fail silently so it doesn't break the UI
  }

  // Interpret WMO Weather code
  let Icon = Sun;
  let status = "Clear sky";
  let iconColor = "text-yellow-500";

  if (weather.weathercode >= 1 && weather.weathercode <= 3) {
    Icon = Cloud;
    status = "Partly cloudy";
    iconColor = "text-gray-400";
  } else if (weather.weathercode >= 45 && weather.weathercode <= 48) {
    Icon = Cloud;
    status = "Foggy";
    iconColor = "text-gray-400";
  } else if (weather.weathercode >= 51 && weather.weathercode <= 67) {
    Icon = CloudRain;
    status = "Rain";
    iconColor = "text-blue-500";
  } else if (weather.weathercode >= 80 && weather.weathercode <= 82) {
    Icon = CloudRain;
    status = "Showers";
    iconColor = "text-blue-600";
  } else if (weather.weathercode >= 95) {
    Icon = CloudLightning;
    status = "Thunderstorm";
    iconColor = "text-yellow-600";
  }

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mt-6">
      <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Current Weather</h4>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Icon className={`w-10 h-10 ${iconColor}`} />
          <div>
            <div className="text-2xl font-bold text-gray-900">{Math.round(weather.temperature)}°C</div>
            <div className="text-sm text-gray-500 font-medium">{status}</div>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="flex items-center text-gray-500 text-sm">
            <Wind className="w-4 h-4 mr-1" />
            {weather.windspeed} km/h
          </div>
        </div>
      </div>
    </div>
  );
}
