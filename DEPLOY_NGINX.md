# 在 nginx-1.25.4 部署本游戏

## 1) 准备文件
确保项目目录包含：
- `index.html`
- `style.css`
- `script.js`
- `deploy_to_nginx.sh`

## 2) 执行一键部署
```bash
./deploy_to_nginx.sh /你的/nginx-1.25.4/路径 8080
```

例如：
```bash
./deploy_to_nginx.sh /opt/nginx-1.25.4 8080
```

脚本会：
1. 将前端文件复制到 `nginx-1.25.4/html/word-game/`
2. 生成 `nginx-1.25.4/conf/conf.d/word-game.conf`
3. 自动执行 `nginx -t` 校验并 reload（若可执行文件存在）

## 3) 获取访问链接
在部署主机执行：
```bash
hostname -I
```
得到 IP（如 `192.168.1.25`）后，访问：

- `http://192.168.1.25:8080/`

## 4) 防火墙放行（如需）
```bash
sudo ufw allow 8080/tcp
```

