# 微信小程序模板

这是一个可直接在微信开发者工具中导入运行的原生小程序模板（WXML/WXSS/JS/JSON）。

## 如何运行
1. 安装并打开微信开发者工具。
2. 选择“导入项目”，项目目录选择本仓库根目录。
3. AppID 可选择“无 AppID（仅限调试）”或使用自己的 AppID。
4. 导入后点击“编译/预览”即可运行。

## 目录结构
```
.
├─ project.config.json        # 微信开发者工具项目配置
├─ miniprogram/               # 小程序源码根目录
│  ├─ app.js                  # 全局逻辑
│  ├─ app.json                # 全局配置（页面、窗口等）
│  ├─ app.wxss                # 全局样式
│  ├─ sitemap.json            # 索引规则
│  └─ pages/
│     ├─ index/               # 首页
│     │  ├─ index.wxml
│     │  ├─ index.wxss
│     │  ├─ index.js
│     │  └─ index.json
│     └─ about/               # 关于页
│        ├─ about.wxml
│        ├─ about.wxss
│        ├─ about.js
│        └─ about.json
└─ .gitignore
```

## 开发说明
- 页面开发：在 `miniprogram/pages/` 下新增目录，每个页面包括 `.wxml/.wxss/.js/.json` 四个文件。
- 路由注册：新增页面后，在 `miniprogram/app.json` 的 `pages` 数组中添加页面路径（不带扩展名）。
- 样式复用：通用样式可写在 `app.wxss`，页面私有样式写在对应的页面 `.wxss` 中。

## 常见问题
- 导入报“找不到 app.json”：请确保在微信开发者工具里选择了仓库的根目录，并且项目根下存在 `project.config.json` 且 `miniprogram/` 中包含 `app.json`。
- 无法预览：使用“无 AppID（仅限调试）”时部分能力受限，正式预览/上传需使用有效 AppID。

祝开发顺利！
