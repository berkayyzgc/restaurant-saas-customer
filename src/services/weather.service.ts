interface GeocodingResult {
  latitude: number
  longitude: number
  name: string
  country?: string
  admin1?: string
}

interface GeocodingResponse {
  results?: GeocodingResult[]
}

interface CurrentWeatherResponse {
  current?: {
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
    is_day: number
  }
}

export interface WeatherDetails {
  city: string
  temperature: number
  apparentTemperature: number
  humidity: number
  precipitation: number
  windSpeed: number
  weatherCode: number
  isDay: boolean
  description: string
  icon: string
}

function getWeatherDescription(
  weatherCode: number,
  isDay: boolean,
) {
  if (weatherCode === 0) {
    return {
      description: 'Açık',
      icon: isDay ? '☀️' : '🌙',
    }
  }

  if ([1, 2].includes(weatherCode)) {
    return {
      description: 'Parçalı bulutlu',
      icon: isDay ? '🌤️' : '🌥️',
    }
  }

  if (weatherCode === 3) {
    return {
      description: 'Bulutlu',
      icon: '☁️',
    }
  }

  if ([45, 48].includes(weatherCode)) {
    return {
      description: 'Sisli',
      icon: '🌫️',
    }
  }

  if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return {
      description: 'Çiseleme',
      icon: '🌦️',
    }
  }

  if (
    [61, 63, 65, 66, 67, 80, 81, 82].includes(
      weatherCode,
    )
  ) {
    return {
      description: 'Yağmurlu',
      icon: '🌧️',
    }
  }

  if (
    [71, 73, 75, 77, 85, 86].includes(weatherCode)
  ) {
    return {
      description: 'Karlı',
      icon: '❄️',
    }
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return {
      description: 'Gök gürültülü',
      icon: '⛈️',
    }
  }

  return {
    description: 'Hava durumu',
    icon: isDay ? '🌤️' : '🌙',
  }
}

export async function getWeatherByCity(
  city: string,
): Promise<WeatherDetails> {
  const normalizedCity = city.trim()

  if (!normalizedCity) {
    throw new Error('Şehir bilgisi bulunamadı.')
  }

  const geocodingUrl =
    'https://geocoding-api.open-meteo.com/v1/search' +
    `?name=${encodeURIComponent(normalizedCity)}` +
    '&count=1&language=tr&format=json'

  const geocodingResponse = await fetch(geocodingUrl)

  if (!geocodingResponse.ok) {
    throw new Error('Şehir konumu alınamadı.')
  }

  const geocodingData =
    (await geocodingResponse.json()) as GeocodingResponse

  const location = geocodingData.results?.[0]

  if (!location) {
    throw new Error('Şehir bulunamadı.')
  }

  const weatherUrl =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${location.latitude}` +
    `&longitude=${location.longitude}` +
    '&current=' +
    [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
  'is_day',
].join(',') +
    '&timezone=auto'

  const weatherResponse = await fetch(weatherUrl)

  if (!weatherResponse.ok) {
    throw new Error('Hava durumu alınamadı.')
  }

  const weatherData =
    (await weatherResponse.json()) as CurrentWeatherResponse

  if (!weatherData.current) {
    throw new Error('Güncel hava durumu bulunamadı.')
  }

  const isDay = weatherData.current.is_day === 1

const weatherAppearance = getWeatherDescription(
  weatherData.current.weather_code,
  isDay,
)

  return {
    city: location.name,
    temperature: weatherData.current.temperature_2m,
    apparentTemperature:
      weatherData.current.apparent_temperature,
    humidity: weatherData.current.relative_humidity_2m,
    precipitation: weatherData.current.precipitation,
    windSpeed: weatherData.current.wind_speed_10m,
    weatherCode: weatherData.current.weather_code,
    isDay,
    description: weatherAppearance.description,
    icon: weatherAppearance.icon,
    
  }
}