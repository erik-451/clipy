# Clipy

Mini editor colaborativo en tiempo real (WebSockets + Node.js).

Incluye:
- Login con contraseña
- Pestañas persistentes
- Renombrar pestañas
- Dark / Light mode
- Guardado automático
- Docker ready


## Ejecutar

Desde la carpeta del proyecto:

```bash
docker build -t clipy .
mkdir data

docker run \
-p 8000:3000 \
-e PASSWORD=pass123 \
-v $(pwd)/data:/data \
--name clipy \
clipy
````

Abrir:

```
http://localhost:8000
```

---

## Importante

Usa siempre:

```
-v $(pwd)/data:/data
```

Nunca montes sobre `/app`.
