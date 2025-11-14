from rest_framework import serializers
from .models import Tarea, Clase, Estudio, ActividadNoAcademica
from Apps.Tareas.models import EstadoTarea
from .validators import validar_rango_horas, validar_rango_fechas


class TareaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarea
        fields = "__all__"
        read_only_fields = ["usuario"]
        validators = [validar_rango_horas, validar_rango_fechas]

    def get_estado(self, obj):
        if hasattr(obj, "estado_actual") and obj.estado_actual:
            return obj.estado_actual.estado
        return "sin_estado"


class TareaResumenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarea
        fields = ["horaInicio", "horaFin", "titulo", "usuario"]
        read_only_fields = ["usuario"]


class ClaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clase
        fields = "__all__"
        read_only_fields = ["usuario"]
        validators = [validar_rango_horas]


class ClaseResumenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clase
        fields = ["horaInicio", "horaFin", "curso", "usuario"]
        read_only_fields = ["usuario"]


class EstudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudio
        fields = "__all__"
        read_only_fields = ["usuario"]
        validators = [validar_rango_horas]


class EstudioResumenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudio
        fields = ["horaInicio", "horaFin", "titulo", "usuario"]
        read_only_fields = ["usuario"]


class ActividadNoAcademicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActividadNoAcademica
        fields = "__all__"
        read_only_fields = ["usuario"]
        validators = [validar_rango_horas]


class ActividadNoAcademicaResumenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActividadNoAcademica
        fields = ["horaInicio", "horaFin", "titulo", "usuario"]
        read_only_fields = ["usuario"]
