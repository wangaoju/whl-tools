'use strict';

(function () {
  const lsKeys = {
    city: 'whl.weather.city',
    theme: 'whl.weather.theme', // 'light' | 'dark'
    apiKey: 'whl.weather.owmApiKey',
  };

  const els = {
    cityInput: document.getElementById('cityInput'),
    refreshBtn: document.getElementById('refreshBtn'),
    themeToggle: document.getElementById('themeToggle'),
    settingsBtn: document.getElementById('settingsBtn'),
    alertArea: document.getElementById('alertArea'),
    card: document.getElementById('weatherCard'),
    loading: document.getElementById('loading'),
    content: document.getElementById('weatherContent'),
    retryBtn: document.getElementById('retryBtn'),

    cityName: document.getElementById('cityName'),
    updatedAt: document.getElementById('updatedAt'),
    weatherIcon: document.getElementById('weatherIcon'),
    temp: document.getElementById('temp'),
    desc: document.getElementById('desc'),
    feelsLike: document.getElementById('feelsLike'),
    tempMax: document.getElementById('tempMax'),
    tempMin: document.getElementById('tempMin'),
    humidity: document.getElementById('humidity'),
    wind: document.getElementById('wind'),

    settingsDialog: document.getElementById('settingsDialog'),
    settingsForm: document.getElementById('settingsForm'),
    apiKeyInput: document.getElementById('apiKeyInput'),
    saveApiKeyBtn: document.getElementById('saveApiKeyBtn'),
    closeSettingsBtn: document.getElementById('closeSettingsBtn'),
  };

  function getStoredCity() {
    return localStorage.getItem(lsKeys.city) || '北京';
  }
  function setStoredCity(v) {
    localStorage.setItem(lsKeys.city, v);
  }
  function getStoredTheme() {
    return localStorage.getItem(lsKeys.theme); // may be null
  }
  function setStoredTheme(v) {
    localStorage.setItem(lsKeys.theme, v);
  }
  function getStoredApiKey() {
    return localStorage.getItem(lsKeys.apiKey) || '';
  }
  function setStoredApiKey(v) {
    localStorage.setItem(lsKeys.apiKey, v);
  }

  function applyThemeOnLoad() {
    const saved = getStoredTheme();
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
      return;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setStoredTheme(next);
  }

  function setAlert(msg, type) {
    // type: 'info' | 'error'
    els.alertArea.textContent = msg || '';
    els.alertArea.classList.toggle('hidden', !msg);
    if (msg) {
      els.alertArea.setAttribute('aria-live', 'assertive');
    }
    if (type === 'error') {
      els.alertArea.style.borderColor = 'var(--danger)';
    } else {
      els.alertArea.style.borderColor = 'var(--border)';
    }
  }

  function showLoading(isLoading) {
    els.card.setAttribute('aria-busy', String(!!isLoading));
    els.loading.classList.toggle('hidden', !isLoading);
    els.content.classList.toggle('hidden', !!isLoading);
  }

  function formatTime(tsSec) {
    try {
      const date = new Date(tsSec * 1000);
      const iso = date.toISOString();
      const text = date.toLocaleString('zh-CN', {
        hour12: false,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      });
      els.updatedAt.setAttribute('datetime', iso);
      return `更新于 ${text}`;
    } catch (e) {
      return '';
    }
  }

  async function fetchWeather(city) {
    const apiKey = getStoredApiKey();
    if (!apiKey) {
      const error = new Error('未设置 API Key');
      error.code = 'NO_API_KEY';
      throw error;
    }

    const q = encodeURIComponent(city.trim());
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${apiKey}&units=metric&lang=zh_cn&_ts=${Date.now()}`;
    const res = await fetch(url, { method: 'GET', mode: 'cors' });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = new Error(data && data.message ? data.message : '请求失败');
      err.status = res.status;
      throw err;
    }

    return data;
  }

  function renderWeather(data) {
    const w = (data && data.weather && data.weather[0]) || {};
    const m = data.main || {};
    const wind = data.wind || {};

    const city = data.name || els.cityInput.value.trim() || getStoredCity();
    els.cityName.textContent = city;
    document.title = `天气 · ${city}`;

    const icon = w.icon ? `https://openweathermap.org/img/wn/${w.icon}@2x.png` : '';
    if (icon) {
      els.weatherIcon.src = icon;
      els.weatherIcon.alt = w.description || '天气图标';
    } else {
      els.weatherIcon.removeAttribute('src');
      els.weatherIcon.alt = '';
    }

    els.desc.textContent = w.description || '--';

    function fmt(n) { return (n === 0 || (typeof n === 'number' && !Number.isNaN(n))) ? Math.round(n) : '--'; }

    els.temp.textContent = fmt(m.temp);
    els.feelsLike.textContent = fmt(m.feels_like);
    els.tempMax.textContent = fmt(m.temp_max);
    els.tempMin.textContent = fmt(m.temp_min);
    els.humidity.textContent = (typeof m.humidity === 'number') ? m.humidity : '--';
    els.wind.textContent = (typeof wind.speed === 'number') ? wind.speed : '--';

    els.updatedAt.textContent = formatTime(data.dt || Date.now()/1000);
  }

  async function load(city) {
    const q = (city || '').trim();
    if (!q) {
      setAlert('请输入城市名称后再查询。', 'info');
      return;
    }
    setAlert('');
    showLoading(true);
    els.retryBtn.classList.add('hidden');

    try {
      const data = await fetchWeather(q);
      renderWeather(data);
      setStoredCity(q);
    } catch (e) {
      // Custom messages
      if (e && e.code === 'NO_API_KEY') {
        setAlert('尚未设置 OpenWeatherMap API Key，请点击右上角齿轮按钮进行设置。', 'error');
      } else if (e && e.status === 401) {
        setAlert('API Key 无效或已失效，请在设置中检查。', 'error');
      } else if (e && e.status === 404) {
        setAlert(`未找到该城市，请检查输入是否正确。`, 'error');
      } else if (e && e.status === 429) {
        setAlert('请求过于频繁（限流），请稍后重试。', 'error');
      } else if (e && e.name === 'TypeError') {
        setAlert('网络异常或无法连接服务器，请检查网络后重试。', 'error');
      } else {
        setAlert('请求失败，请稍后重试。', 'error');
      }
      els.retryBtn.classList.remove('hidden');
    } finally {
      showLoading(false);
    }
  }

  function bindEvents() {
    els.themeToggle.addEventListener('click', toggleTheme);

    els.refreshBtn.addEventListener('click', () => {
      const city = (els.cityInput.value || '').trim();
      if (!city) {
        setAlert('请输入城市名称后再查询。', 'info');
        return;
      }
      load(city);
    });

    els.cityInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const city = (els.cityInput.value || '').trim();
        if (!city) {
          setAlert('请输入城市名称后再查询。', 'info');
          return;
        }
        load(city);
      }
    });

    els.retryBtn.addEventListener('click', () => {
      const city = (els.cityInput.value || '').trim() || getStoredCity();
      if (city) load(city);
    });

    // Settings dialog
    els.settingsBtn.addEventListener('click', () => {
      const key = getStoredApiKey();
      els.apiKeyInput.value = key;
      if (typeof els.settingsDialog.showModal === 'function') {
        els.settingsDialog.showModal();
      } else {
        // Fallback: toggle as a section
        els.settingsDialog.setAttribute('open', 'open');
      }
    });

    els.closeSettingsBtn.addEventListener('click', () => {
      if (typeof els.settingsDialog.close === 'function') {
        els.settingsDialog.close();
      } else {
        els.settingsDialog.removeAttribute('open');
      }
    });

    els.settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = (els.apiKeyInput.value || '').trim();
      if (!v) {
        alert('API Key 不能为空');
        return;
      }
      setStoredApiKey(v);
      if (typeof els.settingsDialog.close === 'function') {
        els.settingsDialog.close();
      } else {
        els.settingsDialog.removeAttribute('open');
      }
      // Auto refresh after saving key
      const city = (els.cityInput.value || '').trim() || getStoredCity();
      if (city) load(city);
    });

    // Listen system theme change only when user didn't set preference
    if (!getStoredTheme() && window.matchMedia) {
      try {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        mq.addEventListener ? mq.addEventListener('change', () => applyThemeOnLoad()) : mq.addListener(() => applyThemeOnLoad());
      } catch (_) {}
    }
  }

  function init() {
    applyThemeOnLoad();
    const savedCity = getStoredCity();
    els.cityInput.value = savedCity;

    bindEvents();

    // Initial load
    if (!getStoredApiKey()) {
      setAlert('首次使用请先设置 OpenWeatherMap API Key（右上角齿轮）', 'info');
      els.content.classList.add('hidden');
    } else {
      load(savedCity);
    }
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
