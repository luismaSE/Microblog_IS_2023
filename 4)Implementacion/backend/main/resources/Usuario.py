from flask_restful import Resource
from flask import Response, jsonify
from .. import mongo
from bson import json_util
from flask_jwt_extended import jwt_required, get_jwt
from main.auth.decorators import admin_required

class Usuario(Resource):

    #! Perfil de usuario
    def get(self, alias):
        user = mongo.db.users.find_one({'alias': alias}, {'alias': 1, 'nombre': 1, 'descripcion': 1, 'foto': 1, 'seguidos': 1, 'seguidores': 1})
        response = json_util.dumps(user)
        return Response(response, mimetype="application/json")

    #! Seguir o dejar de seguir
    @jwt_required()
    def put(self, alias):
        
        seguido = mongo.db.users.find_one({"alias": alias})
        if seguido is None:
            return "Usuario inexistente", 409

        claims = get_jwt()
        mi_alias = claims["alias"]
        mi_usuario = mongo.db.users.find_one({"alias": mi_alias}) 
        
        if mi_alias == alias:
            return "No te podes autoseguir.", 409

        if mi_alias in seguido["seguidores"]:
            mongo.db.users.update_one({"alias": alias},{'$pull': {'seguidores': mi_alias}})
            mongo.db.users.update_one({"alias": mi_alias},{'$pull': {'seguidos': alias}})
            return "Dejaste seguir a '{}'".format(alias), 200

        mongo.db.users.update_one({"alias": alias},{'$push': {'seguidores': mi_alias}})
        mongo.db.users.update_one({"alias": mi_alias}, {'$push': {'seguidos': alias}})

        return "Comenzaste a seguir a '{}'".format(alias), 200

class Usuarios(Resource):
    
    #! Obtener todos los usuarios
    @admin_required
    def get(self):
        users = mongo.db.users.find()
        response = json_util.dumps(users)
        return Response(response, mimetype="application/json")


class UsuariosEncontrados(Resource):

    #! Lista de usuarios encontrados
    def get(self, alias): 
        user = mongo.db.users.find({'alias': {'$regex': alias, '$options': 'i'}}, {"alias":1, "_id": 0})
        response = json_util.dumps(user)
        return Response(response, mimetype="application/json")