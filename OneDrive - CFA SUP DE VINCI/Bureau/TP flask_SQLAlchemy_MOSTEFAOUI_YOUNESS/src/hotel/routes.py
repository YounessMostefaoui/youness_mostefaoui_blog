from flask import Blueprint, render_template
from flask import Blueprint, jsonify, request
from datetime import datetime
from .models import Client, Chambre, Reservation
from .database import db

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/chambres', methods=['GET'])
def toutes_les_chambres():
    # Récupérer toutes les chambres de la base de données
    toutes_les_chambres = Chambre.query.all()

    # Serializer les chambres en format JSON
    chambres_json = [chambre.serialize() for chambre in toutes_les_chambres]

    return jsonify(chambres_json)

@main.route('/chambres/disponibles', methods=['GET'])
def chambres_disponibles():
    date_arrivee = request.args.get('date_arrivee', type=datetime)
    date_depart = request.args.get('date_depart', type=datetime)

    chambres_dispo = Chambre.query.filter(
        ~Chambre.reservation.any(
            (Reservation.date_arrivee < date_depart) & (Reservation.date_depart > date_arrivee)
        )
    ).all()

    return jsonify([chambre.serialize() for chambre in chambres_dispo])

@main.route('/reservations', methods=['POST'])
def creer_reservation():
    id_client = request.json.get('id_client')
    date_arrivee = request.json.get('date_arrivee', type=datetime)
    date_depart = request.json.get('date_depart', type=datetime)

    # Vérifier la disponibilité de la chambre
    chambre_disponible = Chambre.query.filter(
        ~Chambre.reservation.any(
            (Reservation.date_arrivee < date_depart) & (Reservation.date_depart > date_arrivee)
        )
    ).first()

    if chambre_disponible:
        nouvelle_reservation = Reservation(
            id_client=id_client,
            id_chambre=chambre_disponible.id,
            date_arrivee=date_arrivee,
            date_depart=date_depart,
            status="confirmée"
        )
        db.session.add(nouvelle_reservation)
        db.session.commit()
        return jsonify({"success": True, "message": "Réservation créée avec succès."}), 200
    else:
        return jsonify({"success": False, "message": "La chambre demandée n'est pas disponible pour ces dates."}), 400

@main.route('/reservations/<int:id>', methods=['DELETE'])
def annuler_reservation(id):
    # Recherche de la réservation à annuler
    reservation = Reservation.query.get(id)

    # Vérifier si la réservation existe
    if not reservation:
        return jsonify({"success": False, "message": "La réservation n'existe pas."}), 404

    # Supprimer la réservation de la base de données
    db.session.delete(reservation)
    db.session.commit()

    return jsonify({"success": True, "message": "La réservation a été annulée avec succès."}), 200

@main.route('/chambres', methods=['POST'])
def ajouter_chambre():
    # Extraire les données du corps de la requête
    numero = request.json.get('numero')
    type_chambre = request.json.get('type')
    prix = request.json.get('prix')

    # Vérifier si tous les champs requis sont présents
    if not numero or not type_chambre or not prix:
        return jsonify({"success": False, "message": "Tous les champs (numero, type, prix) sont obligatoires."}), 400

    # Créer une nouvelle chambre avec les données fournies
    nouvelle_chambre = Chambre(numero=numero, type=type_chambre, prix=prix)

    # Ajouter la nouvelle chambre à la base de données
    db.session.add(nouvelle_chambre)
    db.session.commit()

    return jsonify({"success": True, "message": "La chambre a ete ajoutee avec succes."}), 201

@main.route('/chambres/<int:id>', methods=['PUT'])
def modifier_chambre(id):
    # Recherche de la chambre à modifier
    chambre = Chambre.query.get(id)

    # Vérifier si la chambre existe
    if not chambre:
        return jsonify({"success": False, "message": "La chambre n'existe pas."}), 404

    # Extraire les données du corps de la requête
    numero = request.json.get('numero')
    type_chambre = request.json.get('type')
    prix = request.json.get('prix')

    # Mettre à jour les champs de la chambre avec les nouvelles données
    if numero:
        chambre.numero = numero
    if type_chambre:
        chambre.type = type_chambre
    if prix:
        chambre.prix = prix

    # Enregistrer les modifications dans la base de données
    db.session.commit()

    return jsonify({"success": True, "message": "La chambre a ete modifiée avec succes."}), 200

@main.route('/chambres/<int:id>', methods=['DELETE'])
def supprimer_chambre(id):
    # Recherche de la chambre à supprimer
    chambre = Chambre.query.get(id)

    # Vérifier si la chambre existe
    if not chambre:
        return jsonify({"success": False, "message": "La chambre n'existe pas."}), 404

    # Supprimer la chambre de la base de données
    db.session.delete(chambre)
    db.session.commit()

    return jsonify({"success": True, "message": "La chambre a ete supprimee avec succes."}), 200
