"""Read-only verification of seeded catalog data through Django's API views."""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django

django.setup()

from django.db import connection
from django.test import Client


def verify():
    client = Client(HTTP_HOST="localhost")
    categories = client.get("/api/v1/catalog/categories/")
    assert categories.status_code == 200, categories.status_code
    assert len(categories.json()) == 4, "Expected four demo categories"

    products = client.get("/api/v1/catalog/products/")
    assert products.status_code == 200, products.status_code
    payload = products.json()
    assert payload["pagination"]["count"] == 4, "Expected four demo products"
    assert all(item["min_sale_price_vnd"] > 0 and item["primary_image"] for item in payload["data"])

    detail = client.get("/api/v1/catalog/products/trau-ba-la-xe/")
    assert detail.status_code == 200, detail.status_code
    assert detail.json()["variants"][0]["rental_rates"], "Missing rental prices"

    for item in payload["data"]:
        response = client.get(item["primary_image"])
        try:
            assert response.status_code == 200, (item["slug"], response.status_code)
        finally:
            response.close()

    print("API verified: 4 categories, 4 priced products, rental rates and 4 readable images.")


if __name__ == "__main__":
    try:
        verify()
    finally:
        connection.close()
