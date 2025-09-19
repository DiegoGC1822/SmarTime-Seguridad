from django.contrib.auth import get_user_model
from django.db import models


class BlockedSite(models.Model):
    usuario = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="blocked_sites"
    )
    url = models.CharField(max_length=255)

    class Meta:
        unique_together = ("usuario", "url")

    def __str__(self):
        return f"{self.usuario.username} bloquea {self.url}"
