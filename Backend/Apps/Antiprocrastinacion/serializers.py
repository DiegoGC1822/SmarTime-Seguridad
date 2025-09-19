from rest_framework import serializers
from .models import BlockedSite


class BlockedSiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockedSite
        fields = ["id", "url"]
