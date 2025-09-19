# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import BlockedSite
from .serializers import BlockedSiteSerializer
from django.db import IntegrityError


class AntiprocrastinacionAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BlockedSiteSerializer

    def get(self, request):
        queryset = BlockedSite.objects.filter(usuario=request.user)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        url = request.data.get("url")
        if not url:
            return Response({"error": "No se proporcionó ninguna URL"}, status=400)
        try:
            queryset = BlockedSite.objects.create(usuario=request.user, url=url)
            serializer = BlockedSiteSerializer(queryset)
            return Response(serializer.data, status=201)
        except IntegrityError:
            return Response(
                {"error": "La URL ya está en la lista de bloqueadas"}, status=400
            )
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def delete(self, request, antipro_id):
        try:
            blocked_site = BlockedSite.objects.get(id=antipro_id, usuario=request.user)
            blocked_site.delete()
            return Response({"message": "URL eliminada con éxito"}, status=200)
        except BlockedSite.DoesNotExist:
            return Response({"error": "No existe este ID en tu lista"}, status=404)
