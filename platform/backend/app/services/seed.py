"""
Seed inicial de fuentes RSS por país.
Ejecutar: python -m app.services.seed
"""
import asyncio
from app.database import AsyncSessionLocal, engine, Base
from app.models.source import Source, SourceType

SOURCES = [
    # Argentina
    {"country": "AR", "name": "Infobae", "rss_url": "https://www.infobae.com/feeds/rss/", "type": SourceType.hegemonic},
    {"country": "AR", "name": "El Destape", "rss_url": "https://www.eldestapeweb.com/rss/", "type": SourceType.alternative},
    {"country": "AR", "name": "El Cohete a la Luna", "rss_url": "https://www.elcohetealaluna.com/feed/", "type": SourceType.analysis},
    # Brasil
    {"country": "BR", "name": "Agência Brasil", "rss_url": "https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml", "type": SourceType.hegemonic},
    {"country": "BR", "name": "The Intercept Brasil", "rss_url": "https://theintercept.com/brasil/feed/?lang=pt", "type": SourceType.alternative},
    {"country": "BR", "name": "Folha de S.Paulo", "rss_url": "https://feeds.folha.uol.com.br/poder/rss091.xml", "type": SourceType.hegemonic},
    # Chile
    {"country": "CL", "name": "El Mostrador", "rss_url": "https://www.elmostrador.cl/feed/", "type": SourceType.alternative},
    {"country": "CL", "name": "CIPER Chile", "rss_url": "https://www.ciperchile.cl/feed/", "type": SourceType.analysis},
    {"country": "CL", "name": "La Tercera", "rss_url": "https://www.latercera.com/feed/", "type": SourceType.hegemonic},
    # Colombia
    {"country": "CO", "name": "El Espectador", "rss_url": "https://www.elespectador.com/arc/outboundfeeds/rss/?outputType=xml", "type": SourceType.hegemonic},
    {"country": "CO", "name": "La Silla Vacía", "rss_url": "https://lasillavacia.com/feed/", "type": SourceType.analysis},
    {"country": "CO", "name": "Semana", "rss_url": "https://www.semana.com/rss/", "type": SourceType.hegemonic},
    # Bolivia
    {"country": "BO", "name": "Los Tiempos", "rss_url": "https://www.lostiempos.com/rss.xml", "type": SourceType.hegemonic},
    {"country": "BO", "name": "El Deber", "rss_url": "https://eldeber.com.bo/rss", "type": SourceType.hegemonic},
    # Perú
    {"country": "PE", "name": "La República", "rss_url": "https://larepublica.pe/rss/", "type": SourceType.hegemonic},
    {"country": "PE", "name": "OjoPúblico", "rss_url": "https://ojo-publico.com/feed", "type": SourceType.analysis},
    # Uruguay
    {"country": "UY", "name": "La Diaria", "rss_url": "https://ladiaria.com.uy/rss/", "type": SourceType.alternative},
    {"country": "UY", "name": "El País Uruguay", "rss_url": "https://www.elpais.com.uy/rss/", "type": SourceType.hegemonic},
    # Paraguay
    {"country": "PY", "name": "ABC Color", "rss_url": "https://www.abc.com.py/rss/", "type": SourceType.hegemonic},
    # Ecuador
    {"country": "EC", "name": "El Universo", "rss_url": "https://www.eluniverso.com/rss/", "type": SourceType.hegemonic},
    {"country": "EC", "name": "GK", "rss_url": "https://gk.city/feed/", "type": SourceType.analysis},
    # Venezuela
    {"country": "VE", "name": "Tal Cual", "rss_url": "https://talcualdigital.com/feed/", "type": SourceType.alternative},
    {"country": "VE", "name": "Efecto Cocuyo", "rss_url": "https://efectococuyo.com/feed/", "type": SourceType.alternative},
]


async def run_seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        for s in SOURCES:
            source = Source(**s)
            db.add(source)
        await db.commit()
        print(f"Seeded {len(SOURCES)} sources.")


if __name__ == "__main__":
    asyncio.run(run_seed())
