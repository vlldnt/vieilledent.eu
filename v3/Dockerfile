# Image légère Alpine + Nginx
FROM nginx:alpine

# Copier les fichiers du site
COPY index.html /var/www/html/
COPY script.js /var/www/html/
COPY style.css /var/www/html/
COPY assets/ /var/www/html/assets/
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Créer utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nginx_app && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx_app -g nginx_app nginx_app && \
    chown -R nginx_app:nginx_app /var/www/html /var/cache/nginx /var/log/nginx /var/run/nginx

USER nginx_app

EXPOSE 80

# Santé du conteneur
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/index.html || exit 1

# Nginx en foreground
CMD ["nginx", "-g", "daemon off;"]
