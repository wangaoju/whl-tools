# 响应式 HTML 天气卡片（OpenWeatherMap 实时数据，中文，浅/深色主题）

这是一个无需任何构建工具的原生 HTML/CSS/JS 示例，直接双击 `index.html` 即可在本地运行。它会从 OpenWeatherMap 获取当前天气，并以中文展示，同时支持城市输入、本地记忆、刷新、浅/深色主题切换、加载与错误处理，以及 API Key 设置面板。

## 功能特性
- 数据源：OpenWeatherMap 当前天气接口 `https://api.openweathermap.org/data/2.5/weather`
  - 请求参数：`q=<城市名>&appid=<API_KEY>&units=metric&lang=zh_cn`
  - 天气图标：`https://openweathermap.org/img/wn/{icon}@2x.png`
- 展示字段：城市名、天气图标+描述、当前温度(°C)、体感温度、最高/最低、湿度(%)、风速(m/s)、最后更新时间
- 交互：
  - 城市选择：顶部输入框输入城市名，回车或点击按钮刷新；把最近城市保存在 localStorage
  - 刷新按钮：重新拉取当前城市的天气
  - 主题开关：浅色/深色切换，持久化到 localStorage，默认跟随系统 `prefers-color-scheme`
  - API Key 设置：右上角小齿轮打开设置对话框，保存后写入 localStorage；首次无 Key 会提示先设置
- 状态与容错：
  - 加载中：显示 Spinner
  - 错误：城市不存在(404)、网络错误、限流(429)、Key 无效(401) 等，均有中文提示并可重试
  - 输入校验：空城市不发请求
- 无依赖：不引入框架与打包；直接打开 `index.html` 即可运行

## 目录结构
```
examples/owm-weather-card/
├─ index.html   # 页面主体
├─ styles.css   # 样式与主题变量
├─ script.js    # 逻辑实现（localStorage、fetch、渲染、事件、状态）
└─ README.md    # 本说明
```

## 如何获取 OpenWeatherMap API Key
1. 访问 https://home.openweathermap.org/users/sign_up 注册或登录。
2. 打开 https://home.openweathermap.org/api_keys 创建 API Key。
3. 复制该 Key。

## 如何本地运行
1. 用文件管理器进入 `examples/owm-weather-card/` 目录。
2. 直接双击打开 `index.html`（或右键使用浏览器打开）。
3. 首次打开会提示设置 API Key：点击右上角齿轮，粘贴 Key 并保存。
4. 默认城市为“北京”，可在顶部输入其他城市名称（如：上海、深圳、广州），回车或点击刷新按钮进行查询。

## 其他说明
- 单位为摄氏度（`units=metric`），语言为中文（`lang=zh_cn`）。
- 城市、主题、API Key 都会持久化到浏览器的本地存储中：
  - `whl.weather.city`
  - `whl.weather.theme`（`light`/`dark`，若未设置则默认跟随系统）
  - `whl.weather.owmApiKey`
- 如果遇到以下情况：
  - 无效城市：会显示“未找到该城市，请检查输入是否正确。”
  - 无网络/跨域阻止：会显示“网络异常或无法连接服务器，请检查网络后重试。”
  - 限流：会显示“请求过于频繁（限流），请稍后重试。”
  - 未设置或错误的 API Key：会显示相应提示并引导前往设置

## 测试建议
- 首次无 API Key -> 打开设置 -> 保存 -> 查询成功“北京”
- 输入无效城市 -> 看到错误提示 -> 切回有效城市恢复
- 切换主题 -> 刷新页面 -> 主题保持
- 断网/离线 -> 看到错误提示 -> 恢复网络后点击重试

祝使用愉快！
