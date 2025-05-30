# db-lab3-front

Este proyecto contiene el frontend del laboratorio 3 de base de datos. Además, incluye el archivo `docker-compose.yml` que levanta tanto el frontend como el backend (`db-lab3`) mediante contenedores Docker.

## 📁 Estructura esperada

Asegúrate de clonar este repositorio junto al backend (`db-lab3`) en el mismo directorio, así:

```
.
├── db-lab3-front/      # Este repositorio (frontend con docker-compose.yml)
└── db-lab3/            # Repositorio del backend
```

## 🚀 Instrucciones para levantar el sistema completo

```bash
# Clonar ambos repositorios uno al lado del otro
git clone https://github.com/vicperezch/db-lab3-front.git
git clone https://github.com/vicperezch/db-lab3.git

# Ir a la carpeta del frontend
cd db-lab3-front

# Levantar todos los servicios (frontend y backend)
docker-compose up --build
```

Una vez que los contenedores estén corriendo, abre tu navegador en:

```
http://localhost:3000
```

Para detener los servicios:

```bash
docker-compose down
```

## 📁 Contenido del proyecto

```
db-lab3-front/
├── public/
├── src/
│   ├── components/
│   ├── views/
│   └── ...
├── docker-compose.yml
├── package.json
└── README.md
```

## ✅ Notas

- Los servicios definidos en el `docker-compose.yml` incluyen el frontend (React/Vite) y el backend (Go), listos para levantarse juntos.
- Verifica que los puertos 3000 y 8080 estén disponibles antes de correr Docker.
- Puedes modificar la configuración de puertos o nombres de servicio directamente en el archivo `docker-compose.yml`.

---

Frontend del laboratorio 3 – diseñado para integrarse automáticamente con `db-lab3` mediante Docker.
