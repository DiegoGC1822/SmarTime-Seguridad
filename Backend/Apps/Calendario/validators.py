from rest_framework import serializers


def validar_rango_horas(data):
    hora_inicio = data.get("horaInicio")
    hora_fin = data.get("horaFin")

    if hora_inicio and hora_fin and hora_inicio >= hora_fin:
        raise serializers.ValidationError(
            {"error": "La hora de inicio debe ser anterior a la hora de fin."}
        )

    return data


def validar_rango_fechas(data):
    fecha_entrega = data.get("fechaEntrega")
    fecha_realizacion = data.get("fechaRealizacion")

    if fecha_entrega and fecha_realizacion and fecha_entrega < fecha_realizacion:
        raise serializers.ValidationError(
            {
                "error": "La fecha de entrega no puede ser anterior a la fecha de realización."
            }
        )
    return data
