# vieilledent.eu - Déploiement Docker

Site statique déployé via Docker + Nginx sur VPS.

## Fichiers essentiels

- **Dockerfile** - Image légère Alpine + Nginx
- **docker-compose.yml** - Config production avec limites ressources
- **nginx.conf** - Gestion cache, compression, SPA routing
- **.dockerignore** - Fichiers exclus du build
- **DEPLOY.md** - Guide de déploiement

## Déployer en 2 commandes

```bash
docker context use vps
docker compose up -d --build
```

Voir [DEPLOY.md](DEPLOY.md) pour la configuration complète.
