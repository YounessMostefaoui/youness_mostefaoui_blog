from .database import db
from datetime import datetime

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    reservations = db.relationship('Reservation', backref='client', lazy='dynamic')

    def serialize(self):
        return {
            "id": self.id,
            "nom": self.nom,
            "email": self.email
        }

class Chambre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    numero = db.Column(db.Integer, unique=True, nullable=False)
    type = db.Column(db.String(80), nullable=False)
    prix = db.Column(db.Integer, nullable=False)
    reservations = db.relationship('Reservation', backref='chambre', lazy='dynamic')

    def serialize(self):
        return {
            "id": self.id,
            "numero": self.numero,
            "type": self.type,
            "prix": self.prix
        }

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_client = db.Column(db.Integer, db.ForeignKey('client.id'))
    id_chambre = db.Column(db.Integer, db.ForeignKey('chambre.id'))
    date_arrivee = db.Column(db.DateTime, nullable=False)
    date_depart = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(80), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "id_client": self.id_client,
            "id_chambre": self.id_chambre,
            "date_arrivee": self.date_arrivee.isoformat(),
            "date_depart": self.date_depart.isoformat(),
            "status": self.status
        }
