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

  if (!rgbCard || !rgbIcon || !rgbStatus || !colorButtons.length) return;

  const mqttConfig = {
    url: 'wss://test.mosquitto.org:8081/mqtt',
    topic: 'mekongstem/smart-home/led-rgb/set',
  };
  let mqttClient = null;
  let isMqttConnected = false;
  let pendingRgbPayload = null;

  const hexToRgb = (hex) => {
    const cleanHex = hex.replace('#', '');
    const value = Number.parseInt(cleanHex, 16);

    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
    };
  };

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
      if (pendingRgbPayload) {
        publishRgbPayload(pendingRgbPayload);
        pendingRgbPayload = null;
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
  };

  const publishRgbPayload = (payload) => {
    connectMqtt();

    if (!mqttClient || !isMqttConnected) {
      pendingRgbPayload = payload;
      return;
    }

    mqttClient.publish(mqttConfig.topic, JSON.stringify(payload), {
      qos: 0,
      retain: false,
    });
  };

  const sendRgbCommand = ({ isOn, color = '#000000', name = 'Tắt' }) => {
    const rgb = hexToRgb(color);

    publishRgbPayload({
      device: 'led_rgb',
      state: isOn ? 'ON' : 'OFF',
      color,
      name,
      ...rgb,
      updatedAt: new Date().toISOString(),
    });
  };

  connectMqtt();

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
        sendRgbCommand({ isOn: true, color, name });
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
      sendRgbCommand({ isOn: false });
    }
  });

  const initialSelected = document.querySelector('.honeycomb-cell.is-selected');
  if (initialSelected) {
    setRgbColor(initialSelected, false);
  }
});
