FROM nginx:1.27-alpine

WORKDIR /var/www/html

# Fichiers statiques
COPY index.html script.js style.css ./
COPY assets/ ./assets/

# Config nginx du site (conteneur)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Santé du conteneur
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
