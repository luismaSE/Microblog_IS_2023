from flask_restful import Resource
from flask import request, Response
from .. import mongo
from bson import json_util
from flask_jwt_extended import jwt_required, get_jwt
from datetime import datetime

class MensajePrivado(Resource):

    #! Enviar mensaje privado    
    @jwt_required()
    def post(self):
        claims = get_jwt()
        emisor = claims["alias"]
        texto = request.json['texto']
        destinatario = request.json['destinatario']
        fecha = datetime.now().strftime("%H:%M %d-%m-%Y")
        
        if mongo.db.users.find_one({"alias":destinatario}) is None:
            return "Destinatario no existente.", 404
        
        if destinatario == emisor:
            return "No te podes autoenviar mensajes.", 409
            
        mongo.db.privatemessage.insert_one(
            {
                "emisor": emisor,
                "destinatario": destinatario,
                "texto": texto,
                "fecha": fecha,
            }
        )
        
        return "Mensaje enviado de {} a {}.".format(emisor, destinatario), 201

class Contactos(Resource):
    #! Buscar los contactos
    @jwt_required()
    def get(self):
        
        claims = get_jwt()
        alias = claims["alias"]

        mensajes_recibidos = list(mongo.db.privatemessage.find(
            {"destinatario": alias},
            {"_id": 0, "emisor": 1}
        ).sort([("emisor", 1), ("fecha", 1)]))
        
        mensajes_enviados = list(mongo.db.privatemessage.find(
            {"emisor": alias},
            {"_id": 0, "destinatario": 1}
        ).sort([("emisor", 1), ("fecha", 1)]))
        
        lista = mensajes_recibidos + mensajes_enviados

        nombres = [d.get("emisor") or d.get("destinatario") for d in lista]

        #TODO agregar fotos

        nombres = list(set(nombres))

        return {"contactos":nombres}, 200


class MensajesPrivadosContacto(Resource):
    #! Ver los mensajes de un contacto en orden de fecha.
    @jwt_required()
    def get(self, contacto):
        from pymongo import ASCENDING

        claims = get_jwt()
        alias = claims["alias"]

        
        pipeline = [
    {
        "$match": {
            "$or": [{"destinatario": alias, "emisor": contacto}, {"emisor": alias, "destinatario": contacto}]
        }
    },
    {
        "$project": {
            "_id": 1,
            "emisor": 1,
            "destinatario": 1,
            "texto": 1,
            "fecha": {
                "$dateFromString": {
                    "dateString": "$fecha",
                    "format": "%H:%M %d-%m-%Y"
                }
            }
        }
    },
    {
        "$sort": {"fecha": ASCENDING}
    }
]
        mensajes_unificados = list(mongo.db.privatemessage.aggregate(pipeline))

        response = json_util.dumps(mensajes_unificados)
        return Response(response, mimetype="application/json")