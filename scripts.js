window.tailwind = window.tailwind || {};
window.tailwind.config = {
      theme: {
        extend: {
          colors: {
            'mekong-blue': '#2a5ea9',
            'mekong-light-blue': '#eaf2fb',
            'mekong-sky': '#7ca8ea',
            'mekong-brown': '#6a4b17',
            'mekong-gray': '#5d6775',
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
        }
      }
    };

// Simple line chart implementation on canvas
    document.addEventListener('DOMContentLoaded', function() {
      const canvas = document.getElementById('tempChart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;

      const data = [25, 23, 27, 28, 32, 30, 27, 30]; // Sample temperature points
      const labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
      
      const padding = 40;
      const chartWidth = width - (padding * 2);
      const chartHeight = height - (padding * 2);

      // Draw Grid Lines (Horizontal)
      ctx.strokeStyle = '#dfe9f7';
      ctx.lineWidth = 1;
      ctx.font = '10px Inter';
      ctx.fillStyle = '#5d6775';
      
      for(let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        const val = 40 - (i * 10);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        ctx.fillText(val + '°C', 10, y + 3);
      }

      // Draw X Labels
      labels.forEach((label, i) => {
        const x = padding + (chartWidth / (labels.length - 1)) * i;
        ctx.fillText(label, x - 15, height - 10);
      });

      // Draw Line Area
      ctx.beginPath();
      ctx.moveTo(padding, height - padding);
      data.forEach((val, i) => {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = padding + chartHeight - ((val / 40) * chartHeight);
        ctx.lineTo(x, y);
      });
      ctx.lineTo(width - padding, height - padding);
      ctx.fillStyle = 'rgba(42, 94, 169, 0.1)';
      ctx.fill();

      // Draw Actual Line
      ctx.beginPath();
      ctx.strokeStyle = '#2a5ea9';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      data.forEach((val, i) => {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = padding + chartHeight - ((val / 40) * chartHeight);
        if(i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw Points
      data.forEach((val, i) => {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = padding + chartHeight - ((val / 40) * chartHeight);
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#2a5ea9';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Highlight last point
        if (i === data.length - 1) {
            ctx.fillStyle = '#2a5ea9';
            ctx.fillRect(x - 20, y - 30, 40, 18);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Inter';
            ctx.fillText(val + '.6°C', x - 15, y - 17);
        }
      });
    });

document.addEventListener('DOMContentLoaded', function() {
  const rgbCard = document.getElementById('rgbLedCard');
  const rgbIcon = document.getElementById('rgbLedIcon');
  const rgbStatus = document.getElementById('rgbLedStatus');
  const colorButtons = document.querySelectorAll('.honeycomb-cell');
  const rgbToggle = rgbCard?.querySelector('.toggle-checkbox');
  const fanCard = document.getElementById('fanCard');
  const fanIcon = document.getElementById('fanIcon');
  const fanStatus = document.getElementById('fanStatus');
  const fanToggle = document.getElementById('fanToggle');
  const fanSpeedSlider = document.getElementById('fanSpeedSlider');
  const fanSpeedValue = document.getElementById('fanSpeedValue');
  const buzzerCard = document.getElementById('buzzerCard');
  const buzzerIcon = document.getElementById('buzzerIcon');
  const buzzerStatus = document.getElementById('buzzerStatus');
  const buzzerToggle = document.getElementById('buzzerToggle');
  const buzzerDetectToggle = document.getElementById('buzzerDetectToggle');
  const mainDoorCard = document.getElementById('mainDoorCard');
  const mainDoorIcon = document.getElementById('mainDoorIcon');
  const mainDoorStatus = document.getElementById('mainDoorStatus');
  const mainDoorToggle = document.getElementById('mainDoorToggle');
  const autoDoorCard = document.getElementById('autoDoorCard');
  const autoDoorIcon = document.getElementById('autoDoorIcon');
  const autoDoorStatus = document.getElementById('autoDoorStatus');
  const autoDoorToggle = document.getElementById('autoDoorToggle');
  const lightControlCard = document.getElementById('lightControlCard');
  const lightControlIcon = document.getElementById('lightControlIcon');
  const lightControlStatus = document.getElementById('lightControlStatus');
  const lightToggle = document.getElementById('lightToggle');
  const favoriteLightToggle = document.getElementById('favoriteLightToggle');
  const autoLightToggle = document.getElementById('autoLightToggle');
  const autoLightStatus = document.getElementById('autoLightStatus');
  const motionStatusCard = document.getElementById('motionStatusCard');
  const motionStatusIcon = document.getElementById('motionStatusIcon');
  const motionStatusValue = document.getElementById('motionStatusValue');
  const motionStatusText = document.getElementById('motionStatusText');
  const alertsList = document.getElementById('alertsList');
  const alertCount = document.getElementById('alertCount');
  const temperatureValue = document.getElementById('temperatureValue');
  const temperatureStatus = document.getElementById('temperatureStatus');
  const humidityValue = document.getElementById('humidityValue');
  const humidityStatus = document.getElementById('humidityStatus');
  const lightValue = document.getElementById('lightValue');
  const lightStatus = document.getElementById('lightStatus');
  const gasValue = document.getElementById('gasValue');
  const gasStatus = document.getElementById('gasStatus');

  if (!rgbCard || !rgbIcon || !rgbStatus || !colorButtons.length) return;

  const mqttConfig = {
    url: 'wss://test.mosquitto.org:8081/mqtt',
    rgbStateTopic: 'mekongstem/smart-home/led-rgb/state/set',
    rgbColorTopic: 'mekongstem/smart-home/led-rgb/color/set',
    fanStateTopic: 'mekongstem/smart-home/fan/state/set',
    fanSpeedTopic: 'mekongstem/smart-home/fan/speed/set',
    buzzerStateTopic: 'mekongstem/smart-home/buzzer',
    buzzerDetectStateTopic: 'mekongstem/smart-home/buzzer-when-detect',
    mainDoorStateTopic: 'mekongstem/smart-home/door/main/state/set',
    autoDoorStateTopic: 'mekongstem/smart-home/door/auto/state/set',
    motionTopic: 'mekongstem/smart-home/motion/status',
    gasTopic: 'mekongstem/smart-home/sensor/gas',
    humidityTopic: 'mekongstem/smart-home/sensor/humidity',
    temperatureTopic: 'mekongstem/smart-home/sensor/temperature',
    lightTopic: 'mekongstem/smart-home/sensor/light',
    lightStateTopic: 'mekongstem/smart-home/light',
    autoLightTopic: 'mekongstem/smart-home/auto-light',
  };
  const dashboardStateUrl = window.__DASHBOARD_STATE_URL__ || '/api/dashboard/state';
  let mqttClient = null;
  let isMqttConnected = false;
  let pendingMqttMessages = [];
  let motionResetTimer = null;
  let lastMotionAlertTime = 0;
  let lastGasAlertTime = 0;
  let lastTemperatureAlertTime = 0;
  const alerts = [];

  const connectMqtt = () => {
    if (mqttClient || typeof mqtt === 'undefined') return;

    mqttClient = mqtt.connect(mqttConfig.url, {
      clientId: `mekongstem_web_${Math.random().toString(16).slice(2, 10)}`,
      clean: true,
      connectTimeout: 5000,
      reconnectPeriod: 2000,
    });

    mqttClient.on('connect', () => {
      isMqttConnected = true;
      mqttClient.subscribe([
        mqttConfig.motionTopic,
        mqttConfig.gasTopic,
        mqttConfig.humidityTopic,
        mqttConfig.temperatureTopic,
        mqttConfig.lightTopic,
      ], { qos: 0 });
      if (pendingMqttMessages.length) {
        const messages = [...pendingMqttMessages];
        pendingMqttMessages = [];
        messages.forEach(({ topic, message }) => publishMqttMessage(topic, message));
      }
    });

    mqttClient.on('reconnect', () => {
      isMqttConnected = false;
    });

    mqttClient.on('close', () => {
      isMqttConnected = false;
    });

    mqttClient.on('error', (error) => {
      console.warn('MQTT RGB LED error:', error.message);
    });

    mqttClient.on('message', (topic, payload) => {
      const message = payload.toString().trim();

      if (topic === mqttConfig.motionTopic) {
        handleMotionMessage(message);
      } else if (topic === mqttConfig.gasTopic) {
        updateGas(message);
      } else if (topic === mqttConfig.humidityTopic) {
        updateHumidity(message);
      } else if (topic === mqttConfig.temperatureTopic) {
        updateTemperature(message);
      } else if (topic === mqttConfig.lightTopic) {
        updateLight(message);
      }
    });
  };

  const publishMqttMessage = (topic, message) => {
    connectMqtt();

    if (!mqttClient || !isMqttConnected) {
      pendingMqttMessages.push({ topic, message });
      return;
    }

    mqttClient.publish(topic, message, {
      qos: 0,
      retain: false,
    });
  };

  const sendRgbState = (isOn) => {
    publishMqttMessage(mqttConfig.rgbStateTopic, isOn ? 'ON' : 'OFF');
  };

  const sendRgbColor = (color) => {
    publishMqttMessage(mqttConfig.rgbColorTopic, color);
  };

  const sendFanState = (isOn) => {
    publishMqttMessage(mqttConfig.fanStateTopic, isOn ? 'ON' : 'OFF');
  };

  const sendFanSpeed = (speed) => {
    publishMqttMessage(mqttConfig.fanSpeedTopic, String(speed));
  };

  const sendBuzzerState = (isOn) => {
    publishMqttMessage(mqttConfig.buzzerStateTopic, isOn ? 'ON' : 'OFF');
  };

  const sendBuzzerDetectState = (isOn) => {
    publishMqttMessage(mqttConfig.buzzerDetectStateTopic, isOn ? 'ON' : 'OFF');
  };

  const sendMainDoorState = (isOn) => {
    publishMqttMessage(mqttConfig.mainDoorStateTopic, isOn ? 'ON' : 'OFF');
  };

  const sendAutoDoorState = (isOn) => {
    publishMqttMessage(mqttConfig.autoDoorStateTopic, isOn ? 'ON' : 'OFF');
  };

  const sendLightState = (isOn) => {
    publishMqttMessage(mqttConfig.lightStateTopic, isOn ? 'ON' : 'OFF');
  };

  const sendAutoLightState = (isOn) => {
    publishMqttMessage(mqttConfig.autoLightTopic, isOn ? 'ON' : 'OFF');
  };

  connectMqtt();

  const formatCurrentTime = () => {
    return new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const parseSensorValue = (message) => {
    const value = Number.parseFloat(String(message).replace(',', '.').replace(/[^\d.-]/g, ''));
    return Number.isFinite(value) ? value : null;
  };

  const normalizeBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') {
      return ['1', 'true', 'on', 'yes', 'open', 'detected'].includes(value.trim().toLowerCase());
    }
    return null;
  };

  const formatNumber = (value, maximumFractionDigits = 1) => {
    return new Intl.NumberFormat('vi-VN', {
      maximumFractionDigits,
    }).format(value);
  };

  const setStatus = (element, label, color = '#7ca8ea') => {
    if (!element) return;

    element.style.color = color;
    element.innerHTML = `<span class="inline-block w-1.5 h-1.5 rounded-full mr-1" style="background-color:${color}"></span> ${label}`;
  };

  const renderAlerts = () => {
    if (!alertsList) return;

    if (alertCount) {
      alertCount.textContent = String(Math.min(alerts.length, 99));
      alertCount.classList.toggle('hidden', alerts.length === 0);
    }

    if (!alerts.length) {
      alertsList.innerHTML = `
        <div class="h-full min-h-40 flex flex-col items-center justify-center text-center text-slate-400">
          <i class="fa-regular fa-bell-slash text-2xl mb-2"></i>
          <p class="text-sm font-semibold text-slate-500">Chưa có cảnh báo</p>
          <p class="text-xs">Hệ thống sẽ tự tạo cảnh báo khi dữ liệu vượt ngưỡng.</p>
        </div>
      `;
      return;
    }

    alertsList.innerHTML = alerts.slice(0, 5).map((alert) => `
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 ${alert.iconClass} rounded-lg flex items-center justify-center">
          <i class="fa-solid ${alert.icon}"></i>
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold">${alert.title}</p>
          <p class="text-xs text-slate-500">${alert.location}</p>
        </div>
        <span class="text-xs ${alert.timeClass} font-medium">${alert.time}</span>
      </div>
    `).join('');
  };

  const setRgbColorByValue = (color, shouldPublish = true) => {
    const targetColor = String(color || '').trim().toLowerCase();
    const button = Array.from(colorButtons).find((item) => String(item.dataset.color || '').trim().toLowerCase() === targetColor);

    if (button) {
      setRgbColor(button, shouldPublish);
    }
  };

  const addMotionAlert = () => {
    const now = Date.now();
    if (now - lastMotionAlertTime < 5000) return;

    lastMotionAlertTime = now;
    alerts.unshift({
      title: 'Phát hiện chuyển động',
      location: 'Cửa chính',
      time: formatCurrentTime(),
      icon: 'fa-person-running',
      iconClass: 'bg-mekong-light-blue text-mekong-blue',
      timeClass: 'text-mekong-brown',
    });
    renderAlerts();
  };

  const addSensorAlert = ({ type, title, location, icon, iconClass }) => {
    const now = Date.now();
    const alertWindowMs = 10000;

    if (type === 'gas') {
      if (now - lastGasAlertTime < alertWindowMs) return;
      lastGasAlertTime = now;
    }

    if (type === 'temperature') {
      if (now - lastTemperatureAlertTime < alertWindowMs) return;
      lastTemperatureAlertTime = now;
    }

    alerts.unshift({
      title,
      location,
      time: formatCurrentTime(),
      icon,
      iconClass,
      timeClass: 'text-mekong-brown',
    });
    renderAlerts();
  };

  const updateTemperature = (message) => {
    const value = parseSensorValue(message);
    if (value === null || !temperatureValue) return;

    temperatureValue.textContent = `${formatNumber(value)}°C`;

    if (value >= 35) {
      setStatus(temperatureStatus, 'Nhiệt độ cao', '#6a4b17');
      addSensorAlert({
        type: 'temperature',
        title: 'Nhiệt độ cao',
        location: 'Phòng khách',
        icon: 'fa-temperature-high',
        iconClass: 'bg-mekong-brown/10 text-mekong-brown',
      });
    } else if (value <= 18) {
      setStatus(temperatureStatus, 'Nhiệt độ thấp', '#2a5ea9');
    } else {
      setStatus(temperatureStatus, 'Bình thường');
    }
  };

  const updateHumidity = (message) => {
    const value = parseSensorValue(message);
    if (value === null || !humidityValue) return;

    humidityValue.textContent = `${formatNumber(value, 0)}%`;

    if (value >= 80) {
      setStatus(humidityStatus, 'Độ ẩm cao', '#6a4b17');
    } else if (value <= 35) {
      setStatus(humidityStatus, 'Độ ẩm thấp', '#6a4b17');
    } else {
      setStatus(humidityStatus, 'Bình thường');
    }
  };

  const updateLight = (message) => {
    const value = parseSensorValue(message);
    if (value === null || !lightValue) return;

    lightValue.innerHTML = `${formatNumber(value, 0)} <span class="text-sm font-medium">lux</span>`;

    if (value < 25) {
      setStatus(lightStatus, 'Thiếu sáng', '#6a4b17');
    } else if (value > 90) {
      setStatus(lightStatus, 'Rất sáng', '#6a4b17');
    } else {
      setStatus(lightStatus, 'Tốt');
    }
  };

  const updateGas = (message) => {
    const value = parseSensorValue(message);
    if (value === null || !gasValue) return;

    gasValue.innerHTML = `${formatNumber(value, 0)} <span class="text-sm font-medium">ppm</span>`;

    if (value >= 300) {
      setStatus(gasStatus, 'Nguy hiểm', '#6a4b17');
      addSensorAlert({
        type: 'gas',
        title: 'Phát hiện khí gas',
        location: 'Phòng bếp',
        icon: 'fa-fire-flame-curved',
        iconClass: 'bg-mekong-brown/10 text-mekong-brown',
      });
    } else if (value >= 200) {
      setStatus(gasStatus, 'Cần chú ý', '#6a4b17');
    } else {
      setStatus(gasStatus, 'An toàn');
    }
  };

  const updateMotionUi = (isDetected) => {
    if (!motionStatusCard || !motionStatusIcon || !motionStatusValue || !motionStatusText) return;

    if (isDetected) {
      motionStatusValue.textContent = 'Có người';
      motionStatusText.innerHTML = '<span class="inline-block w-1.5 h-1.5 rounded-full mr-1" style="background-color:#6a4b17"></span> Đang phát hiện';
      motionStatusValue.style.color = '#6a4b17';
      motionStatusIcon.style.backgroundColor = '#6a4b17';
      motionStatusCard.classList.add('border-b-4');
      motionStatusCard.style.borderBottomColor = '#6a4b17';
    } else {
      motionStatusValue.textContent = 'Không có';
      motionStatusText.innerHTML = '<span class="inline-block w-1.5 h-1.5 rounded-full mr-1" style="background-color:#7ca8ea"></span> Không phát hiện';
      motionStatusValue.style.color = '#0f172a';
      motionStatusIcon.style.backgroundColor = '#2a5ea9';
      motionStatusCard.classList.remove('border-b-4');
      motionStatusCard.style.borderBottomColor = '#dbe6f5';
    }
  };

  const handleMotionMessage = (message) => {
    const normalized = message.toUpperCase();
    const isClearMessage = ['0', 'OFF', 'NO', 'NONE', 'FALSE', 'CLEAR'].includes(normalized);
    const isDetected = !isClearMessage;

    updateMotionUi(isDetected);

    if (isDetected) {
      addMotionAlert();
      window.clearTimeout(motionResetTimer);
      motionResetTimer = window.setTimeout(() => updateMotionUi(false), 10000);
    } else {
      window.clearTimeout(motionResetTimer);
    }
  };

  const seedAlertsFromCurrentDashboard = () => {
    updateTemperature(temperatureValue?.textContent || '');
    updateHumidity(humidityValue?.textContent || '');
    updateLight(lightValue?.textContent || '');
    updateGas(gasValue?.textContent || '');

    const currentMotionText = `${motionStatusValue?.textContent || ''} ${motionStatusText?.textContent || ''}`.toLowerCase();
    if (currentMotionText.includes('có người') || currentMotionText.includes('đang phát hiện')) {
      addMotionAlert();
    }

    renderAlerts();
  };

  const applyDashboardSnapshot = (snapshot) => {
    if (!snapshot || typeof snapshot !== 'object') return;

    const sensors = snapshot.sensors && typeof snapshot.sensors === 'object' ? snapshot.sensors : snapshot;
    const controls = snapshot.controls && typeof snapshot.controls === 'object' ? snapshot.controls : snapshot;

    const temperature = sensors.temperature ?? sensors.temp ?? snapshot.temperature ?? snapshot.temp;
    if (temperature != null) {
      updateTemperature(temperature);
    }

    const humidity = sensors.humidity ?? snapshot.humidity;
    if (humidity != null) {
      updateHumidity(humidity);
    }

    const light = sensors.light ?? snapshot.light;
    if (light != null) {
      updateLight(light);
    }

    const gas = sensors.gas ?? snapshot.gas;
    if (gas != null) {
      updateGas(gas);
    }

    const lightOn = normalizeBoolean(controls.lightOn ?? snapshot.lightOn ?? controls.light ?? snapshot.light);
    if (lightOn !== null) {
      updateLightControlUi(lightOn);
    }

    const autoLightOn = normalizeBoolean(controls.autoLightOn ?? snapshot.autoLightOn ?? controls.autoLight ?? snapshot.autoLight);
    if (autoLightOn !== null) {
      updateAutoLightUi(autoLightOn);
      if (autoLightToggle && autoLightToggle.checked !== autoLightOn) {
        autoLightToggle.checked = autoLightOn;
      }
    }

    const fanOn = normalizeBoolean(controls.fanOn ?? snapshot.fanOn);
    if (fanOn !== null) {
      if (fanToggle && fanToggle.checked !== fanOn) {
        fanToggle.checked = fanOn;
      }
      if (fanSpeedSlider && controls.fanSpeed !== undefined) {
        fanSpeedSlider.value = String(controls.fanSpeed);
        if (fanSpeedValue) {
          fanSpeedValue.textContent = `${fanSpeedSlider.value}%`;
        }
      }
      updateFanUi(fanOn);
    }

    const buzzerOn = normalizeBoolean(controls.buzzerOn ?? snapshot.buzzerOn);
    if (buzzerOn !== null) {
      updateBuzzerUi(buzzerOn);
    }

    const buzzerDetectOn = normalizeBoolean(controls.buzzerDetectOn ?? snapshot.buzzerDetectOn);
    if (buzzerDetectOn !== null) {
      updateBuzzerDetectUi(buzzerDetectOn);
    }

    const mainDoorOpen = normalizeBoolean(controls.mainDoorOpen ?? snapshot.mainDoorOpen ?? controls.doorOpen ?? snapshot.doorOpen);
    if (mainDoorOpen !== null) {
      updateMainDoorUi(mainDoorOpen);
    }

    const autoDoorOn = normalizeBoolean(controls.autoDoorOn ?? snapshot.autoDoorOn ?? controls.autoDoor ?? snapshot.autoDoor);
    if (autoDoorOn !== null) {
      updateAutoDoorUi(autoDoorOn);
    }

    const rgbOn = normalizeBoolean(controls.rgbOn ?? snapshot.rgbOn);
    if (rgbOn !== null && rgbToggle && rgbToggle.checked !== rgbOn) {
      rgbToggle.checked = rgbOn;
    }

    if (controls.rgbColor ?? snapshot.rgbColor) {
      setRgbColorByValue(controls.rgbColor ?? snapshot.rgbColor, false);
    } else if (controls.rgbColorName ?? snapshot.rgbColorName) {
      const targetName = String(controls.rgbColorName ?? snapshot.rgbColorName).trim().toLowerCase();
      const button = Array.from(colorButtons).find((item) => String(item.dataset.name || '').trim().toLowerCase() === targetName);
      if (button) {
        setRgbColor(button, false);
      }
    }

    const alertItems = Array.isArray(snapshot.alerts) ? snapshot.alerts : Array.isArray(snapshot.recentAlerts) ? snapshot.recentAlerts : null;
    if (alertItems) {
      alerts.length = 0;
      alertItems.slice(0, 5).forEach((item) => {
        alerts.push({
          title: item.title || item.name || 'Cảnh báo',
          location: item.location || item.room || '',
          time: item.time || item.createdAt || formatCurrentTime(),
          icon: item.icon || 'fa-bell',
          iconClass: item.iconClass || 'bg-mekong-light-blue text-mekong-blue',
          timeClass: item.timeClass || 'text-mekong-brown',
        });
      });
      renderAlerts();
    }
  };

  const loadDashboardStateFromServer = async () => {
    try {
      const response = await fetch(`${dashboardStateUrl}${dashboardStateUrl.includes('?') ? '&' : '?'}ts=${Date.now()}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const snapshot = await response.json();
      applyDashboardSnapshot(snapshot);
    } catch (error) {
      console.warn('Không tải được trạng thái từ server:', error.message);
      seedAlertsFromCurrentDashboard();
    }
  };

  loadDashboardStateFromServer();

  const updateLightControlUi = (isOn) => {
    if (!lightControlCard || !lightControlIcon || !lightControlStatus) return;

    if (lightToggle && lightToggle.checked !== isOn) {
      lightToggle.checked = isOn;
    }

    if (favoriteLightToggle && favoriteLightToggle.checked !== isOn) {
      favoriteLightToggle.checked = isOn;
    }

    if (isOn) {
      lightControlStatus.textContent = 'Bật';
      lightControlStatus.style.color = '#2a5ea9';
      lightControlIcon.style.backgroundColor = '#2a5ea9';
      lightControlCard.style.borderBottomColor = '#2a5ea9';
      lightControlCard.classList.add('border-b-4', 'border-mekong-blue');
    } else {
      lightControlStatus.textContent = 'Tắt';
      lightControlStatus.style.color = '#5d6775';
      lightControlIcon.style.backgroundColor = '#dbe6f5';
      lightControlCard.style.borderBottomColor = '#dbe6f5';
      lightControlCard.classList.remove('border-b-4', 'border-mekong-blue');
    }
  };

  const updateAutoLightUi = (isOn) => {
    if (!autoLightStatus) return;

    autoLightStatus.textContent = isOn ? 'Auto bật' : 'Auto tắt';
    autoLightStatus.style.color = isOn ? '#2a5ea9' : '#5d6775';
  };

  const handleLightToggleChange = (isOn) => {
    updateLightControlUi(isOn);
    sendLightState(isOn);
  };

  if (lightToggle) {
    updateLightControlUi(lightToggle.checked);
    lightToggle.addEventListener('change', () => handleLightToggleChange(lightToggle.checked));
  }

  if (favoriteLightToggle) {
    favoriteLightToggle.checked = lightToggle?.checked ?? favoriteLightToggle.checked;
    favoriteLightToggle.addEventListener('change', () => handleLightToggleChange(favoriteLightToggle.checked));
  }

  if (autoLightToggle) {
    updateAutoLightUi(autoLightToggle.checked);
    autoLightToggle.addEventListener('change', () => {
      updateAutoLightUi(autoLightToggle.checked);
      sendAutoLightState(autoLightToggle.checked);
    });
  }

  const updateFanUi = (isOn) => {
    const speed = fanSpeedSlider?.value || '0';

    if (!fanCard || !fanIcon || !fanStatus) return;

    if (isOn) {
      fanStatus.textContent = `${speed}%`;
      fanStatus.style.color = '#2a5ea9';
      fanIcon.style.backgroundColor = '#2a5ea9';
      fanCard.style.borderBottomColor = '#2a5ea9';
      fanCard.classList.add('border-b-4', 'border-mekong-blue');
    } else {
      fanStatus.textContent = 'Tắt';
      fanStatus.style.color = '#5d6775';
      fanIcon.style.backgroundColor = '#dbe6f5';
      fanCard.style.borderBottomColor = '#dbe6f5';
      fanCard.classList.remove('border-b-4', 'border-mekong-blue');
    }
  };

  const updateBuzzerUi = (isOn) => {
    if (!buzzerCard || !buzzerIcon || !buzzerStatus) return;

    if (buzzerToggle && buzzerToggle.checked !== isOn) {
      buzzerToggle.checked = isOn;
    }

    if (isOn) {
      buzzerStatus.textContent = 'Bật';
      buzzerStatus.style.color = '#2a5ea9';
      buzzerIcon.style.backgroundColor = '#2a5ea9';
      buzzerCard.style.borderBottomColor = '#2a5ea9';
      buzzerCard.classList.add('border-b-4', 'border-mekong-blue');
    } else {
      buzzerStatus.textContent = 'Tắt';
      buzzerStatus.style.color = '#5d6775';
      buzzerIcon.style.backgroundColor = '#dbe6f5';
      buzzerCard.style.borderBottomColor = '#dbe6f5';
      buzzerCard.classList.remove('border-b-4', 'border-mekong-blue');
    }
  };

  const updateBuzzerDetectUi = (isOn) => {
    if (buzzerDetectToggle && buzzerDetectToggle.checked !== isOn) {
      buzzerDetectToggle.checked = isOn;
    }
  };

  const updateMainDoorUi = (isOpen) => {
    if (!mainDoorCard || !mainDoorIcon || !mainDoorStatus || !mainDoorToggle) return;

    mainDoorToggle.setAttribute('aria-pressed', String(isOpen));
    mainDoorToggle.className = isOpen ? 'door-action-button is-open' : 'door-action-button';
    mainDoorToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-lock-open"></i>'
      : '<i class="fa-solid fa-lock"></i>';

    if (isOpen) {
      mainDoorStatus.textContent = 'Mở';
      mainDoorStatus.style.color = '#2a5ea9';
      mainDoorIcon.innerHTML = '<i class="fa-solid fa-lock-open"></i>';
      mainDoorIcon.style.backgroundColor = '#2a5ea9';
      mainDoorCard.style.borderBottomColor = '#2a5ea9';
    } else {
      mainDoorStatus.textContent = 'Đóng';
      mainDoorStatus.style.color = '#5d6775';
      mainDoorIcon.innerHTML = '<i class="fa-solid fa-lock"></i>';
      mainDoorIcon.style.backgroundColor = '#dbe6f5';
      mainDoorCard.style.borderBottomColor = '#dbe6f5';
    }
  };

  const updateAutoDoorUi = (isOn) => {
    if (!autoDoorCard || !autoDoorIcon || !autoDoorStatus || !autoDoorToggle) return;

    if (autoDoorToggle.checked !== isOn) {
      autoDoorToggle.checked = isOn;
    }

    if (isOn) {
      autoDoorStatus.textContent = 'Bật';
      autoDoorStatus.style.color = '#2a5ea9';
      autoDoorIcon.style.backgroundColor = '#2a5ea9';
      autoDoorCard.style.borderBottomColor = '#2a5ea9';
    } else {
      autoDoorStatus.textContent = 'Tắt';
      autoDoorStatus.style.color = '#5d6775';
      autoDoorIcon.style.backgroundColor = '#dbe6f5';
      autoDoorCard.style.borderBottomColor = '#dbe6f5';
    }
  };

  if (fanToggle && fanSpeedSlider && fanSpeedValue) {
    fanSpeedValue.textContent = `${fanSpeedSlider.value}%`;
    updateFanUi(fanToggle.checked);

    fanToggle.addEventListener('change', () => {
      if (fanToggle.checked) {
        sendFanSpeed(fanSpeedSlider.value);
        sendFanState(true);
      } else {
        sendFanState(false);
      }

      updateFanUi(fanToggle.checked);
    });

    fanSpeedSlider.addEventListener('input', () => {
      fanSpeedValue.textContent = `${fanSpeedSlider.value}%`;
      updateFanUi(fanToggle.checked);
    });

    fanSpeedSlider.addEventListener('change', () => {
      sendFanSpeed(fanSpeedSlider.value);
      if (fanToggle.checked) {
        sendFanState(true);
      }
    });
  }

  if (buzzerToggle) {
    updateBuzzerUi(buzzerToggle.checked);
    buzzerToggle.addEventListener('change', () => {
      updateBuzzerUi(buzzerToggle.checked);
      sendBuzzerState(buzzerToggle.checked);
    });
  }

  if (buzzerDetectToggle) {
    updateBuzzerDetectUi(buzzerDetectToggle.checked);
    buzzerDetectToggle.addEventListener('change', () => {
      updateBuzzerDetectUi(buzzerDetectToggle.checked);
      sendBuzzerDetectState(buzzerDetectToggle.checked);
    });
  }

  if (mainDoorToggle) {
    updateMainDoorUi(false);
    mainDoorToggle.addEventListener('click', () => {
      const nextState = mainDoorToggle.getAttribute('aria-pressed') !== 'true';
      updateMainDoorUi(nextState);
      sendMainDoorState(nextState);
    });
  }

  if (autoDoorToggle) {
    updateAutoDoorUi(autoDoorToggle.checked);
    autoDoorToggle.addEventListener('change', () => {
      updateAutoDoorUi(autoDoorToggle.checked);
      sendAutoDoorState(autoDoorToggle.checked);
    });
  }

  const setRgbColor = (button, shouldPublish = true) => {
    const color = button.dataset.color || '#2a5ea9';
    const name = button.dataset.name || 'Tùy chọn';

    colorButtons.forEach((item) => {
      item.classList.remove('is-selected');
      item.setAttribute('aria-checked', 'false');
      item.setAttribute('role', 'radio');
    });

    button.classList.add('is-selected');
    button.setAttribute('aria-checked', 'true');
    rgbIcon.style.backgroundColor = color;
    rgbCard.style.borderBottomColor = color;

    if (!rgbToggle || rgbToggle.checked) {
      rgbStatus.textContent = name;
      rgbStatus.style.color = color;
      if (shouldPublish) {
        sendRgbColor(color);
        sendRgbState(true);
      }
    }
  };

  colorButtons.forEach((button) => {
    button.setAttribute('role', 'radio');
    button.setAttribute('aria-checked', button.classList.contains('is-selected') ? 'true' : 'false');
    button.addEventListener('click', () => setRgbColor(button));
  });

  rgbToggle?.addEventListener('change', () => {
    const selected = document.querySelector('.honeycomb-cell.is-selected');
    if (rgbToggle.checked && selected) {
      setRgbColor(selected);
    } else {
      rgbStatus.textContent = 'Tắt';
      rgbStatus.style.color = '#5d6775';
      rgbIcon.style.backgroundColor = '#dbe6f5';
      rgbCard.style.borderBottomColor = '#dbe6f5';
      sendRgbState(false);
    }
  });

  const initialSelected = document.querySelector('.honeycomb-cell.is-selected');
  if (initialSelected) {
    setRgbColor(initialSelected, false);
  }
});
