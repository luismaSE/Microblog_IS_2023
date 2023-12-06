from flask import request, jsonify, Blueprint
from .. import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

auth = Blueprint('auth', __name__, url_prefix='/auth')

@auth.route('/register', methods=['POST'])
def register():
    #! Campos obligatorios
    correo = request.json['correo']
    alias = request.json['alias']
    nombre = request.json['nombre']
    password = request.json['password']
    
    #TODO API del diego para los emails.
    if len(alias) > 15:
        return "El alias no puede tener más de 15 caracteres.", 409
    
    #! Campos no obligatorios
    descripcion = request.json['descripcion']
    foto = request.json['foto']
    
    cuenta = mongo.db.users.find_one({"correo": correo})
    alias2 = mongo.db.users.find_one({"alias": alias})
    
    if cuenta == None and alias2 == None:
        if correo and password:
            hashed_password = generate_password_hash(password)
            id = mongo.db.users.insert_one(
                {
                'correo': correo,
                "alias": alias,
                "nombre": nombre, 
                'password': hashed_password,
                "descripcion": descripcion,
                "foto": foto,
                "seguidores": [],
                "seguidos": [],
                "admin": 0
                }
            )
            
            message = {
                'message': "Usuario creado"
            }
            response = jsonify(message)
            response.status_code = 201
            return response
        else:
            return "No ingresó correo o contraseña", 409
    else:
        return "Ya existe un usuario con ese email o alias.", 409


@auth.route('/login', methods=['POST'])
def login():
    correo = request.json['correo']
    password = request.json['password']
    user = mongo.db.users.find_one({"correo": correo})
    if user is None:
        return "Usuario no encontrado", 404
    
    password_hashed = user["password"]
    
    #! Contenido del JWT
    if check_password_hash(password_hashed, password):
        additional_claims = {
            "admin":user["admin"], 
            "correo": user["correo"], 
            "alias": user["alias"],
            "descripcion": user["descripcion"],
            "foto": user["foto"],
            }
        access_token = create_access_token(identity=correo,additional_claims=additional_claims)
        return jsonify(access_token=access_token), 200
    else:
        return "Contraseña incorrecta", 401

@auth.errorhandler(404)
def not_found(error=None):
    message = {
        'message': 'Resource Not Found ' + request.url,
        'status': 404
    }
    response = jsonify(message)
    response.status_code = 404
    return response
