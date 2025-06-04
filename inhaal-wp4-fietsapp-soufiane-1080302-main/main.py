from backend.app import create_app, db

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    # Bind Flask aan 0.0.0.0 om verbindingen van andere apparaten toe te staan
    app.run(host='0.0.0.0', port=5000, debug=True)