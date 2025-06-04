from . import db

class Weather(db.Model):
       __tablename__ = 'weerbericht'

       id = db.Column(db.Integer, primary_key=True, nullable=False)
       created_date = db.Column(db.DateTime, nullable=False)
       locatie = db.Column(db.String(120), nullable=False)
       tijdstip = db.Column(db.String(120), nullable=False)
       windsnelheid = db.Column(db.String(120), nullable=False)
       regenkans = db.Column(db.String(120), nullable=False)
       min_temp = db.Column(db.String(120), nullable=False)
       max_temp = db.Column(db.String(120), nullable=False)
       kans_sneeuw = db.Column(db.String(120), nullable=False)