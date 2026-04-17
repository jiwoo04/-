# Ubuntu Server Deploy

## 1. Install Docker

```bash
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo tee /etc/apt/keyrings/docker.asc > /dev/null
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## 2. Build And Run

From the project directory on the server:

```bash
docker compose up -d --build
```

The app will be served on port `80`.

## 3. Useful Commands

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## 4. If Port 80 Is Already Used

Edit `docker-compose.yml` and change:

```yaml
ports:
  - "8080:80"
```

Then run:

```bash
docker compose up -d --build
```
