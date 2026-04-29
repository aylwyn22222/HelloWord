#!/usr/bin/env bash
set -euo pipefail

# 用法:
#   ./deploy_to_nginx.sh /path/to/nginx-1.25.4 8080
# 示例:
#   ./deploy_to_nginx.sh /opt/nginx-1.25.4 8080

NGINX_HOME=${1:-}
PORT=${2:-8080}

if [[ -z "$NGINX_HOME" ]]; then
  echo "[错误] 请传入 nginx-1.25.4 安装目录。"
  echo "例如: ./deploy_to_nginx.sh /opt/nginx-1.25.4 8080"
  exit 1
fi

if [[ ! -d "$NGINX_HOME" ]]; then
  echo "[错误] 目录不存在: $NGINX_HOME"
  exit 1
fi

HTML_DIR="$NGINX_HOME/html/word-game"
CONF_FILE="$NGINX_HOME/conf/conf.d/word-game.conf"

mkdir -p "$HTML_DIR"
mkdir -p "$(dirname "$CONF_FILE")"

cp index.html style.css script.js "$HTML_DIR"/

cat > "$CONF_FILE" <<CONF
server {
    listen ${PORT};
    server_name _;

    root ${HTML_DIR};
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
        expires 7d;
        add_header Cache-Control "public";
    }
}
CONF

if [[ -x "$NGINX_HOME/sbin/nginx" ]]; then
  "$NGINX_HOME/sbin/nginx" -t -c "$NGINX_HOME/conf/nginx.conf"
  "$NGINX_HOME/sbin/nginx" -s reload || "$NGINX_HOME/sbin/nginx"
else
  echo "[警告] 未找到可执行文件: $NGINX_HOME/sbin/nginx"
  echo "请手动测试并重载:"
  echo "  $NGINX_HOME/sbin/nginx -t -c $NGINX_HOME/conf/nginx.conf"
  echo "  $NGINX_HOME/sbin/nginx -s reload"
fi

echo "[完成] 已部署到: $HTML_DIR"
echo "[访问] 请使用: http://<你的主机IP>:${PORT}/"
