### Requisitos previos

- Tener instalado **Python 3.9+**
- Tener instalado **pip** (administrador de paquetes de Python)

### Activar modo virtual

```bash
python -m venv venv
source venv/bin/activate   # En Linux / Mac
venv\Scripts\activate      # En Windows
```

### Instalar dependencias

```bash
pip install -r requirements.txt
```

### Migrar la base SQLite

```bash
python manage.py migrate
```

### Levantar servidor

```bash
python manage.py runserver
```
