# 现代化个人简介网站

一个基于 **HTML + Tailwind CSS + JavaScript** 的一页式个人简介页面，包含：头像、姓名、职业、简介、技能标签、社交链接和联系按钮。

## 项目结构

```text
.
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
├── index.html
└── README.md
```

## 特性

- 一页式卡片布局，整体居中
- 渐变背景 + 毛玻璃风格
- Tailwind CSS（CDN 方式，无需本地安装）
- 入场动效与轻量交互动效
- 响应式设计，适配手机与桌面端
- Push 到 `main` 后自动部署 GitHub Pages

## 一键部署到 GitHub Pages（永久公网链接）

本项目已经内置 GitHub Actions 工作流：`.github/workflows/deploy-pages.yml`。

### 使用步骤

1. 把项目推送到你的 GitHub 仓库（默认分支建议使用 `main`）。
2. 打开仓库：`Settings` → `Pages`。
3. 在 `Build and deployment` 中将 `Source` 选择为 **GitHub Actions**。
4. 推送代码到 `main` 分支（或手动触发 Actions 的 `workflow_dispatch`）。
5. 等待工作流执行成功后，GitHub 会自动生成永久公网链接：
   - `https://<你的用户名>.github.io/<仓库名>/`

> 如果仓库名是 `username.github.io`，则页面地址通常为：
> `https://username.github.io/`

## 本地预览

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

然后访问：

```text
http://127.0.0.1:4173
```

## 自定义建议

- 替换页面中的姓名、职业与简介文案
- 将头像占位符 `👨‍💻` 替换为 `<img>` 标签
- 将社交链接修改为你的真实账号
- 把 `mailto:hello@example.com` 改成你的邮箱
