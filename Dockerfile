FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install base packages
RUN apt update && apt install -y \
    openjdk-17-jdk \
    maven \
    mysql-server \
    supervisor \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18 (Vite requirement)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt install -y nodejs

WORKDIR /app

# ---------- BACKEND ----------
COPY FestOrg /app/FestOrg
WORKDIR /app/FestOrg
RUN mvn clean package -DskipTests

# ---------- FRONTEND ----------
WORKDIR /app
COPY project /app/project
WORKDIR /app/project
RUN npm install
RUN npm run build

# ---------- MYSQL INIT ----------
RUN service mysql start && \
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS fest_org_db;" && \
    service mysql stop

# ---------- SUPERVISOR ----------
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 3000 3048 3306

CMD ["/usr/bin/supervisord", "-n"]
