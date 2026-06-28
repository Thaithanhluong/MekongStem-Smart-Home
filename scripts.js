window.tailwind = window.tailwind || {};
window.tailwind.config = {
      theme: {
        extend: {
          colors: {
            'mekong-blue': '#004aad',
            'mekong-light-blue': '#f0f7ff',
            'mekong-gray': '#64748b',
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
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      ctx.font = '10px Inter';
      ctx.fillStyle = '#94a3b8';
      
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
      ctx.fillStyle = 'rgba(0, 74, 173, 0.05)';
      ctx.fill();

      // Draw Actual Line
      ctx.beginPath();
      ctx.strokeStyle = '#004aad';
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
        ctx.fillStyle = '#004aad';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Highlight last point
        if (i === data.length - 1) {
            ctx.fillStyle = '#004aad';
            ctx.fillRect(x - 20, y - 30, 40, 18);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Inter';
            ctx.fillText(val + '.6°C', x - 15, y - 17);
        }
      });
    });
