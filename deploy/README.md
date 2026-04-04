# Deploy Guide

部署到阿里云 CentOS 服务器的完整指南。

## 目录结构

```
deploy/
├── docker-compose.yml    # 容器编排配置
├── backend.Dockerfile    # 后端构建文件
├── frontend.Dockerfile   # 前端构建文件
├── nginx.conf            # Nginx 配置
├── .env.example          # 环境变量模板
└── README.md             # 本文件
```

## 服务器准备

### 1. 安装 Docker

```bash
# 更新系统
sudo yum update -y

# 安装 Docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
# 或使用国内镜像源
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo


sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
docker compose version
```

### 2. 安装 Git

```bash
sudo yum install -y git
```

### 3. 配置阿里云安全组

在阿里云控制台开放以下端口：
- **80** - HTTP
- **443** - HTTPS（如需）
- **22** - SSH

## 部署步骤     

### 1. 克隆代码

```bash
git clone <your-repo-url> /opt/blog
cd /opt/blog
```

### 2. 配置环境变量

```bash
cd deploy
cp .env.example .env
# 编辑 .env 文件，修改密码和域名
vim .env
```

### 3. 构建并启动

```bash
docker compose up -d --build
```

### 4. 查看状态

```bash
# 查看容器状态
docker compose ps

# 查看日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f backend
```

### 5. 验证部署

```bash
# 健康检查
curl http://localhost/health

# API 测试
curl http://localhost/api/v1/articles

# 浏览器访问
http://<你的服务器公网IP>
```

## 常用命令

```bash
# 停止服务
docker compose down

# 重启服务
docker compose restart

# 重新构建
docker compose up -d --build

# 查看资源使用
docker stats

# 进入容器
docker compose exec backend sh
docker compose exec db mysql -u blog_user -p
```

## 更新部署

```bash
cd /opt/blog
git pull
cd deploy
docker compose up -d --build
```

## HTTPS 配置（可选）

如果有域名，建议配置 HTTPS：

```bash
# 安装 Certbot
sudo yum install -y certbot

# 获取证书（先停止 nginx）
docker compose down frontend
sudo certbot certonly --standalone -d your-domain.com

# 证书文件位置
# /etc/letsencrypt/live/your-domain.com/fullchain.pem
# /etc/letsencrypt/live/your-domain.com/privkey.pem
```

然后修改 `docker-compose.yml` 挂载证书并配置 HTTPS。

## 故障排查

### 后端无法连接数据库

```bash
# 检查数据库是否就绪
docker compose exec db mysql -u root -p -e "SELECT 1"

# 查看后端日志
docker compose logs backend
```

### 前端页面空白

```bash
# 检查 nginx 配置
docker compose exec frontend cat /etc/nginx/conf.d/default.conf

# 检查静态文件
docker compose exec frontend ls /usr/share/nginx/html
```

### 内存不足

2核2G 服务器运行此项目约占用 500-600MB 内存。如果内存不足：

1. 使用 `mysql:5.7` 而非 `mysql:8.0`（已配置）
2. 已配置 `innodb-buffer-pool-size=256M`
3. 添加 swap 空间

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```
