/**
 * Mapeamento dos códigos WMO (World Meteorological Organization) para descrições legíveis.
 * Fonte: https://open-meteo.com/en/docs#wmo_weather_codes
 */
const WMO_CODE_MAP = {
  0: "Céu Limpo",
  1: "Predominantemente Limpo",
  2: "Parcialmente Nublado",
  3: "Nublado",
  45: "Nevoeiro",
  48: "Nevoeiro Rime",
  51: "Garoa Leve",
  53: "Garoa Moderada",
  55: "Garoa Densa",
  56: "Garoa Congelante Leve",
  57: "Garoa Congelante Densa",
  61: "Chuva Leve",
  63: "Chuva Moderada",
  65: "Chuva Forte",
  66: "Chuva Congelante Leve",
  67: "Chuva Congelante Forte",
  71: "Nevasca Leve",
  73: "Nevasca Moderada",
  75: "Nevasca Forte",
  77: "Grãos de Neve",
  80: "Pancadas de Chuva Leves",
  81: "Pancadas de Chuva Moderadas",
  82: "Pancadas de Chuva Violentas",
  85: "Pancadas de Neve Leves",
  86: "Pancadas de Neve Fortes",
  95: "Tempestade com Trovoada Leve/Moderada",
  96: "Tempestade com Trovoada e Granizo Leve",
  99: "Tempestade com Trovoada e Granizo Forte",
};

/**
 * Processa os dados brutos da API de tempo, formatando datas/horas,
 * combinando valores com unidades e adicionando a descrição dos Códigos WMO.
 *
 * @param {object} data - O objeto de dados brutos da API.
 * @returns {object} - Um objeto processado e simplificado.
 */
export function processarClima(data) {

  // --- Funções Utilitárias ---

  /**
   * Função utilitária para formatar um valor com sua unidade.
   */
  const formatValue = (value, unit) => {
    if (!unit || unit.trim() === "") {
      return value;
    }
    return `${value} ${unit}`;
  };
  
  /**
   * Retorna a descrição legível para um Código WMO.
   */
  const getWmoDescription = (code) => {
      return WMO_CODE_MAP[code] || `Código WMO Desconhecido (${code})`;
  };

  /**
   * Formata um valor de data/hora ISO (tratando como UTC)
   */
  const formatDateTime = (isoString, type) => {
    try {
      let dateObj;

      if (type === 'date' && isoString.length === 10) {
        dateObj = new Date(`${isoString}T00:00:00Z`);
      } else {
        dateObj = new Date(`${isoString}Z`);
      }
      
      if (isNaN(dateObj.getTime())) {
        return isoString;
      }

      const options = { timeZone: 'UTC' };

      switch (type) {
        case 'date': // 06/11/2025
          options.day = '2-digit';
          options.month = '2-digit';
          options.year = 'numeric';
          return dateObj.toLocaleDateString('pt-BR', options);
        
        case 'time': // 12:00
          options.hour = '2-digit';
          options.minute = '2-digit';
          options.hour12 = false;
          return dateObj.toLocaleTimeString('pt-BR', options);

        case 'datetime': // 06/11/2025 23:15
          const datePart = dateObj.toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC'
          });
          const timePart = dateObj.toLocaleTimeString('pt-BR', {
            hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC'
          });
          return `${datePart} ${timePart}`;
          
        default:
          return isoString;
      }
    } catch (error) {
      return isoString;
    }
  };

  /**
   * Processa um bloco de dados de série temporal (hourly ou daily).
   */
  const processTimeSeries = (dataBlock, unitBlock, blockType) => {
    const { time, ...metrics } = dataBlock;
    
    if (!time || !Array.isArray(time)) {
      return [];
    }

    const metricKeys = Object.keys(metrics);

    return time.map((timeValue, index) => {
      const timeFormat = (blockType === 'hourly') ? 'time' : 'date';
      const entry = { time: formatDateTime(timeValue, timeFormat) };

      for (const key of metricKeys) {
        const value = metrics[key][index];
        const unit = unitBlock[key];

        if (key === 'weather_code') {
          // Adiciona o código WMO e a descrição
          entry[key] = {
              code: value,
              description: getWmoDescription(value)
          };
        } else if (key === 'sunrise' || key === 'sunset') {
          // Formatação de data/hora especial para nascer/pôr do sol
          entry[key] = formatDateTime(value, 'time');
        } else {
          entry[key] = formatValue(value, unit);
        }
      }
      
      return entry;
    });
  };

  // --- Processamento Principal ---

  // 1. Inicializa o objeto de resultado com metadados
  const processedData = {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    elevation: data.elevation,
  };

  // 2. Processa os dados "current"
  processedData.current = {};
  const currentUnits = data.current_units;
  for (const key in data.current) {
    if (Object.hasOwnProperty.call(data.current, key)) {
      const value = data.current[key];
      
      if (key === 'time') {
        processedData.current[key] = formatDateTime(value, 'datetime');
      } else if (key === 'weather_code') {
        // Adiciona o código WMO e a descrição para 'current'
        processedData.current[key] = {
            code: value,
            description: getWmoDescription(value)
        };
      } else {
        const unit = currentUnits[key];
        processedData.current[key] = formatValue(value, unit);
      }
    }
  }

  // 3. Processa os dados "hourly"
  processedData.hourly = processTimeSeries(data.hourly, data.hourly_units, 'hourly');

  // 4. Processa os dados "daily"
  processedData.daily = processTimeSeries(data.daily, data.daily_units, 'daily');

  return processedData;
}