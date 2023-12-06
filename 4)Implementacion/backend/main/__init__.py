from flask import Flask
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo
from flask_restful import Api
from dotenv import load_dotenv
from flask_mail import Mail
from flask_cors import CORS
import os


api = Api()

mongo = PyMongo()

jwt = JWTManager()

mailsender = Mail()

def create_app():
    
    app = Flask(__name__)
    CORS(app)
    load_dotenv()

    app.secret_key = os.getenv('SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES"))
    app.config['MONGO_URI'] = os.getenv('DATABASE_CLIENT')
    
    mongo.init_app(app)
    jwt.init_app(app)
    

    #! Para que siempre exista un admin
    admin = mongo.db.users.find_one({"admin": 1})    
    if admin == None:
        from werkzeug.security import generate_password_hash
        mongo.db.users.insert_one(
            {
            'correo': "admin@gmail.com",
            "alias": "admin",
            "nombre": "El Admin", 
            'password': generate_password_hash("123"),
            "descripcion": "Soy el Admin",
            "foto": "",
            "seguidores": [],
            "seguidos": [],
            "admin": 1
            }
        )
    

    import main.resources as resources

    api.add_resource(resources.UsuarioResource, '/usuario/<alias>')     #Get, put
    api.add_resource(resources.UsuariosResource, "/usuarios")   #Get
    api.add_resource(resources.UsuariosEncontradosResource, "/usuariosencontrados/<alias>")     #Get
    
    api.add_resource(resources.MensajesResource, "/mensajes")    #Post
    api.add_resource(resources.MensajeResource, "/mensaje/<_id>")    #Delete
    api.add_resource(resources.MensajesAutorResource, "/mensajes/<autor>")  #Get
    api.add_resource(resources.DiasResource, "/dias")
    api.add_resource(resources.HashtagTendenciaResource, "/hashtagtendencia")
    api.add_resource(resources.MensajesTendenciaResource, "/mensajestendencia")


    api.add_resource(resources.MensajePrivadoResource, "/mensajeprivado")   #Post
    api.add_resource(resources.MensajesPrivadosContactoResource, "/mensajesprivadoscontacto/<contacto>") #Get
    api.add_resource(resources.ContactosResource, "/contactos")   #Get

    app.config['MAIL_HOSTNAME'] = os.getenv('MAIL_HOSTNAME')
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
    app.config['MAIL_PORT'] = os.getenv('MAIL_PORT')
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS')
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['FLASKY_MAIL_SENDER'] = os.getenv('FLASKY_MAIL_SENDER')

    api.init_app(app)

    jwt.init_app(app)

    mailsender.init_app(app)

    from main.auth import routes
    app.register_blueprint(routes.auth)

    return app