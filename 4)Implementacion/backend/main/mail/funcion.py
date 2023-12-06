from .. import mailsender
from flask import current_app
from flask_mail import Message
from smtplib import SMTPException

def sendMail(to, subject, json_content):
    msg = Message(subject, sender=current_app.config['FLASKY_MAIL_SENDER'], recipients=[to])
    try:
        alias = json_content["alias"]

        tema_0 = list(json_content["temas"])[0]
        tema_1 = list(json_content["temas"])[1]
        tema_2 = list(json_content["temas"])[2]

        msg.body = f"Hola {alias} ! \nHay nuevos temas del momento:\n 1º {tema_0} \n 2º {tema_1}\n 3° {tema_2} \n¡Saludos! Microblog Team"

        response = mailsender.send(msg)
        
    except SMTPException as e:
        return "Entrega de correo fallida", 400
    return True
