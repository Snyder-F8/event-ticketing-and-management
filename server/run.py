from app import create_app

# Create the app using the factory pattern
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)