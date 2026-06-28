window.tailwind = window.tailwind || {};
window.tailwind.config = {
      theme: {
        extend: {
          colors: {
            'mekong-blue': '#1f5fbf',
            'mekong-light-blue': '#edf5ff',
            'mekong-sky': '#6f9fe8',
            'mekong-brown': '#5a4217',
            'mekong-gray': '#58667a',
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
      ctx.strokeStyle = '#e8eef7';
      ctx.lineWidth = 1;
      ctx.font = '10px Inter';
      ctx.fillStyle = '#58667a';
      
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
      ctx.fillStyle = 'rgba(31, 95, 191, 0.08)';
      ctx.fill();

      // Draw Actual Line
      ctx.beginPath();
      ctx.strokeStyle = '#1f5fbf';
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
        ctx.fillStyle = '#1f5fbf';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Highlight last point
        if (i === data.length - 1) {
            ctx.fillStyle = '#1f5fbf';
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
    motionTopic: 'mekongstem/smart-home/motion/status',
    gasTopic: 'mekongstem/smart-home/sensor/gas',
    humidityTopic: 'mekongstem/smart-home/sensor/humidity',
    temperatureTopic: 'mekongstem/smart-home/sensor/temperature',
    lightTopic: 'mekongstem/smart-home/sensor/light',
    lightStateTopic: 'mekongstem/smart-home/light',
    autoLightTopic: 'mekongstem/smart-home/auto-light',
  };
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

  const formatNumber = (value, maximumFractionDigits = 1) => {
    return new Intl.NumberFormat('vi-VN', {
      maximumFractionDigits,
    }).format(value);
  };

  const setStatus = (element, label, color = '#6f9fe8') => {
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
      setStatus(temperatureStatus, 'Nhiệt độ cao', '#5a4217');
      addSensorAlert({
        type: 'temperature',
        title: 'Nhiệt độ cao',
        location: 'Phòng khách',
        icon: 'fa-temperature-high',
        iconClass: 'bg-mekong-brown/10 text-mekong-brown',
      });
    } else if (value <= 18) {
      setStatus(temperatureStatus, 'Nhiệt độ thấp', '#1f5fbf');
    } else {
      setStatus(temperatureStatus, 'Bình thường');
    }
  };

  const updateHumidity = (message) => {
    const value = parseSensorValue(message);
    if (value === null || !humidityValue) return;

    humidityValue.textContent = `${formatNumber(value, 0)}%`;

    if (value >= 80) {
      setStatus(humidityStatus, 'Độ ẩm cao', '#5a4217');
    } else if (value <= 35) {
      setStatus(humidityStatus, 'Độ ẩm thấp', '#5a4217');
    } else {
      setStatus(humidityStatus, 'Bình thường');
    }
  };

  const updateLight = (message) => {
    const value = parseSensorValue(message);
    if (value === null || !lightValue) return;

    lightValue.innerHTML = `${formatNumber(value, 0)} <span class="text-sm font-medium">lux</span>`;

    if (value < 25) {
      setStatus(lightStatus, 'Thiếu sáng', '#5a4217');
    } else if (value > 90) {
      setStatus(lightStatus, 'Rất sáng', '#5a4217');
    } else {
      setStatus(lightStatus, 'Tốt');
    }
  };

  const updateGas = (message) => {
    const value = parseSensorValue(message);
    if (value === null || !gasValue) return;

    gasValue.innerHTML = `${formatNumber(value, 0)} <span class="text-sm font-medium">ppm</span>`;

    if (value >= 300) {
      setStatus(gasStatus, 'Nguy hiểm', '#5a4217');
      addSensorAlert({
        type: 'gas',
        title: 'Phát hiện khí gas',
        location: 'Phòng bếp',
        icon: 'fa-fire-flame-curved',
        iconClass: 'bg-mekong-brown/10 text-mekong-brown',
      });
    } else if (value >= 200) {
      setStatus(gasStatus, 'Cần chú ý', '#5a4217');
    } else {
      setStatus(gasStatus, 'An toàn');
    }
  };

  const updateMotionUi = (isDetected) => {
    if (!motionStatusCard || !motionStatusIcon || !motionStatusValue || !motionStatusText) return;

    if (isDetected) {
      motionStatusValue.textContent = 'Có người';
      motionStatusText.innerHTML = '<span class="inline-block w-1.5 h-1.5 rounded-full mr-1" style="background-color:#5a4217"></span> Đang phát hiện';
      motionStatusValue.style.color = '#5a4217';
      motionStatusIcon.style.backgroundColor = '#5a4217';
      motionStatusCard.classList.add('border-b-4');
      motionStatusCard.style.borderBottomColor = '#5a4217';
    } else {
      motionStatusValue.textContent = 'Không có';
      motionStatusText.innerHTML = '<span class="inline-block w-1.5 h-1.5 rounded-full mr-1" style="background-color:#6f9fe8"></span> Không phát hiện';
      motionStatusValue.style.color = '#0f172a';
      motionStatusIcon.style.backgroundColor = '#1f5fbf';
      motionStatusCard.classList.remove('border-b-4');
      motionStatusCard.style.borderBottomColor = '#e2e8f0';
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

  seedAlertsFromCurrentDashboard();

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
      lightControlStatus.style.color = '#1f5fbf';
      lightControlIcon.style.backgroundColor = '#1f5fbf';
      lightControlCard.style.borderBottomColor = '#1f5fbf';
      lightControlCard.classList.add('border-b-4', 'border-mekong-blue');
    } else {
      lightControlStatus.textContent = 'Tắt';
      lightControlStatus.style.color = '#94a3b8';
      lightControlIcon.style.backgroundColor = '#cbd5e1';
      lightControlCard.style.borderBottomColor = '#e2e8f0';
      lightControlCard.classList.remove('border-b-4', 'border-mekong-blue');
    }
  };

  const updateAutoLightUi = (isOn) => {
    if (!autoLightStatus) return;

    autoLightStatus.textContent = isOn ? 'Auto bật' : 'Auto tắt';
    autoLightStatus.style.color = isOn ? '#1f5fbf' : '#94a3b8';
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
      fanStatus.style.color = '#1f5fbf';
      fanIcon.style.backgroundColor = '#1f5fbf';
      fanCard.style.borderBottomColor = '#1f5fbf';
      fanCard.classList.add('border-b-4', 'border-mekong-blue');
    } else {
      fanStatus.textContent = 'Tắt';
      fanStatus.style.color = '#94a3b8';
      fanIcon.style.backgroundColor = '#cbd5e1';
      fanCard.style.borderBottomColor = '#e2e8f0';
      fanCard.classList.remove('border-b-4', 'border-mekong-blue');
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

  const setRgbColor = (button, shouldPublish = true) => {
    const color = button.dataset.color || '#1f5fbf';
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
      rgbStatus.style.color = '#94a3b8';
      rgbIcon.style.backgroundColor = '#94a3b8';
      rgbCard.style.borderBottomColor = '#e2e8f0';
      sendRgbState(false);
    }
  });

  const initialSelected = document.querySelector('.honeycomb-cell.is-selected');
  if (initialSelected) {
    setRgbColor(initialSelected, false);
  }
});
