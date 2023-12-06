from flask_restful import Resource
from flask import request, jsonify, Response
from .. import mongo
from bson import json_util
from flask_jwt_extended import jwt_required, get_jwt
from main.auth.decorators import admin_required
from datetime import datetime
import re
from main.mail.funcion import sendMail
from pymongo import DESCENDING


class Mensajes(Resource):
    
    #! Publicar mensaje
    @jwt_required()
    def post(self):

        texto = request.json['texto']

        if len(texto) > 140:
            return "El texto no puede tener mas de 140 caracteres.", 409 

        hashtags = list(set(re.findall(r'#(\w+)', texto)))
        menciones = list(set(re.findall(r'@(\w+)', texto)))
        
        claims = get_jwt()
        autor = claims["alias"]
        fecha = datetime.now()

        #Buscar si la mencion existe
        for mencion in menciones:
            alias2 = mongo.db.users.find_one({"alias": mencion})

            if alias2 is None:
                return "No existe el alias '{}'".format(mencion), 409

        id = mongo.db.messages.insert_one(
                {
                'texto': texto,
                "hashtags": hashtags,
                "menciones": menciones, 
                'autor': autor,
                "fecha": fecha,
                }
            )
        response = jsonify(
                {
                '_id': str(id),
                'texto': texto,
                "hashtags": hashtags,
                "menciones": menciones, 
                'autor': autor,
                "fecha": fecha,
                }
            )
        response.status_code = 201

        return response

    #! Ver tablon de anuncios
    @jwt_required()
    def get(self):

        claims = get_jwt()
        alias = claims["alias"]

        datos = mongo.db.users.find_one({"alias":alias})

        seguidos = datos["seguidos"]

        seguidos.append(alias)

        mensajes = mongo.db.messages.find({"autor": {"$in": seguidos}}).sort("fecha", -1)

        response = json_util.dumps(mensajes)
        
        return Response(response, mimetype="application/json")


class Mensaje(Resource):
    #! Borrar mensaje
    @jwt_required()
    def delete(self, _id):
        claims = get_jwt()
        autor = claims["alias"]

        from bson import ObjectId
        object_id = ObjectId(_id)
    
        autor_mensaje = mongo.db.messages.find_one({"_id":object_id, "autor":autor})
        
        if autor_mensaje is None:
            return "No podes borrar mensaje ajenos.", 403

        mongo.db.messages.delete_one({'_id': object_id})

        return "Mensaje eliminado", 200
    
    #! Editado mensaje
    @jwt_required()
    def put(self, _id):
        claims = get_jwt()
        autor = claims["alias"]
        texto = request.json['texto'] + " (Editado)"
        fecha = datetime.now()

        if len(texto) > 140:
            return "El texto no puede tener mas de 140 caracteres.", 400

        hashtags = list(set(re.findall(r'#(\w+)', texto)))
        menciones = list(set(re.findall(r'@(\w+)', texto)))
    
        for mencion in menciones:
            alias2 = mongo.db.users.find_one({"alias": mencion})

            if alias2 is None:
                return "No existe el alias '{}'".format(mencion), 404

        from bson import ObjectId
        object_id = ObjectId(_id)
        
        autor_mensaje = mongo.db.messages.find_one({"_id":object_id, "autor":autor})
        if autor_mensaje is None:
            return "No podes editar mensaje ajenos.", 403
        
        mongo.db.messages.update_one(
            {'_id': object_id}, 
            {'$set': 
                {
                    'texto': texto,
                    "hashtags": hashtags,
                    "menciones": menciones, 
                    'autor': autor,
                    "fecha": fecha
                }
            }
        )

        return "Mensaje modificado.", 200

class MensajesAutor(Resource):
    #! Para ver muro de usuario
    def get(self, autor):
        mensajes = mongo.db.messages.find({'autor': autor, }).sort("fecha", -1)
        response = json_util.dumps(mensajes)
        if response == "null":
            return "No existe mensajes con el autor '{}'".format(autor), 404
        return Response(response, mimetype="application/json")

class Dias(Resource):
    @staticmethod
    def get():
        try:
            with open('dias.txt', 'r') as file:
                dias = int(file.read())
            return dias, 200
        except FileNotFoundError:
            dias = 7
            with open('dias.txt', 'w') as file:
                file.write(str(dias))
            return dias, 201

    @admin_required
    def put(self):
        dias = request.json['dias']
        try:
            with open('dias.txt', 'w') as file:
                file.write(str(dias))
                return "Cantidad de dias modificado.", 200
        except FileNotFoundError:
                return "No se pudo modificar.", 409

class HashtagTendencia(Resource):
    
    @staticmethod
    #! Mensajes de hashtag en tendencia.
    def get():

        dias = Dias.get()
        
        from datetime import datetime, timedelta
        hoy = datetime.now()

        desde = hoy - timedelta(days=dias[0])

        pipeline = [
            {"$match": {"fecha": {"$gte": desde, "$lte": hoy}}},
            {"$unwind": "$hashtags"},
            {"$group": {"_id": "$hashtags", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        
        result = list(mongo.db.messages.aggregate(pipeline))

        sorted_data = sorted(result, key=lambda x: (-x["count"], x["_id"]))

        finales = sorted_data[:3]

        lista = []
        for hashtag in finales:
            etiqueta = {}
            
            etiqueta["etiqueta"] = [hashtag['_id'],hashtag['count']]
            lista.append(etiqueta)
        
        return lista, 200
        

    #! Enviar email de tendencias.
    @admin_required
    def post(self):
        usuarios = mongo.db.users.find({}, {'correo': 1, 'alias': 1, 'nombre': 1})

        temas = self.get()[0]

        temas =[item["etiqueta"][0] for item in temas]

        for usuario in usuarios:
            email = usuario['correo']
            alias = usuario['alias']
            nombre = usuario['nombre']
            
            json_content = {
                'alias': alias,
                'nombre': nombre,
                'temas': temas
            }
    
            sendMail(to=email, subject="Nuevos temas del momento", json_content=json_content)

        return "Emails enviados", 200

class MensajesTendencia(Resource):
    
    @staticmethod
    #! Mensajes de hashtag en tendencia.
    def get():

        dias = Dias.get()
        
        from datetime import datetime, timedelta
        hoy = datetime.now()

        desde = hoy - timedelta(days=dias[0])


        get = HashtagTendencia.get()[0]
        tendencias = []

        for x in get:
            tendencias.append(x["etiqueta"][0])
       
        result_mensajes = mensajes_con_tendencias = mongo.db.messages.find({"hashtags": {"$in": tendencias}}).sort("fecha", -1)
    
        response = json_util.dumps(result_mensajes)
        
        return Response(response, mimetype="application/json")


