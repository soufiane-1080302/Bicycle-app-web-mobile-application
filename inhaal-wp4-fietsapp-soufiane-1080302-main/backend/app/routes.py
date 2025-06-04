from flask import Blueprint, jsonify, request
from . import db
from .models import Weather
import datetime

main = Blueprint('main', __name__)


@main.route('/api/weather/<int:id>', methods=['GET', 'PUT'])
def get_or_update_weather(id):
    weerbericht = Weather.query.get_or_404(id)

    if request.method == 'GET':
        try:
            okay_to_bike = []
            for i in range(3):
                day = {
                    "date": (datetime.date.today() + datetime.timedelta(days=i)).isoformat(),
                    "bike_okay": (
                        float(weerbericht.windsnelheid) <= 3.0 and
                        float(weerbericht.regenkans) <= 25.0 and
                        float(weerbericht.min_temp) >= 5 and
                        float(weerbericht.max_temp) <= 30
                    )
                }
                okay_to_bike.append(day)

            response_data = {
                'id': weerbericht.id,
                'created_date': weerbericht.created_date.strftime('%Y-%m-%d %H:%M:%S'),
                'locatie': weerbericht.locatie,
                'tijdstip': weerbericht.tijdstip,
                'windsnelheid': weerbericht.windsnelheid,
                'regenkans': weerbericht.regenkans,
                'min_temp': weerbericht.min_temp,
                'max_temp': weerbericht.max_temp,
                'kans_sneeuw': weerbericht.kans_sneeuw,
                'okay_to_bike': okay_to_bike,
            }
            return jsonify(response_data), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    if request.method == 'PUT':
        data = request.get_json()
        weerbericht.locatie = data['locatie']
        weerbericht.tijdstip = data['tijdstip']
        weerbericht.windsnelheid = data['windsnelheid']
        weerbericht.regenkans = data['regenkans']
        weerbericht.min_temp = data['min_temp']
        weerbericht.max_temp = data['max_temp']
        weerbericht.kans_sneeuw = data['kans_sneeuw']

        try:
            db.session.commit()
            return jsonify({'message': 'Settings updated successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500


@main.route('/api/weather/', methods=['GET', 'POST', 'OPTIONS'])
def save_weather():
    if request.method == 'OPTIONS':
        return '', 200

    if request.method == 'GET':
        try:
            all_weather = Weather.query.all()
            result = [
                {
                    'id': w.id,
                    'created_date': w.created_date.strftime('%Y-%m-%d %H:%M:%S'),
                    'locatie': w.locatie,
                    'tijdstip': w.tijdstip,
                    'windsnelheid': w.windsnelheid,
                    'regenkans': w.regenkans,
                    'min_temp': w.min_temp,
                    'max_temp': w.max_temp,
                    'kans_sneeuw': w.kans_sneeuw,
                }
                for w in all_weather
            ]
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    if request.method == 'POST':
        data = request.get_json()

        existing_weather = Weather.query.filter_by(
            locatie=data['locatie'],
            tijdstip=data['tijdstip'],
            windsnelheid=data['windsnelheid'],
            regenkans=data['regenkans'],
            min_temp=data['min_temp'],
            max_temp=data['max_temp'],
            kans_sneeuw=data['kans_sneeuw']
        ).first()

        if existing_weather:
            return jsonify({'message': 'Settings already exist'}), 400

        new_weather = Weather(
            created_date=datetime.datetime.now(),
            locatie=data['locatie'],
            tijdstip=data['tijdstip'],
            windsnelheid=data['windsnelheid'],
            regenkans=data['regenkans'],
            min_temp=data['min_temp'],
            max_temp=data['max_temp'],
            kans_sneeuw=data['kans_sneeuw']
        )
        db.session.add(new_weather)
        db.session.commit()

        return jsonify({'message': 'Settings saved successfully', 'id': new_weather.id}), 201


@main.route('/api/weather/<int:id>', methods=['DELETE'])
def delete_weather(id):
    weerbericht = Weather.query.get_or_404(id)
    try:
        db.session.delete(weerbericht)
        db.session.commit()
        return jsonify({'message': f'Weather data with ID {id} deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
