from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

# Load the model and vectorizer
model = joblib.load('spam_model.pkl')
vectorizer = joblib.load('tfidf_vectorizer.pkl')

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Flask backend is running"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    message = data.get('message')

    if not message:
        return jsonify({'error': 'No message provided'}), 400

    # Transform message and predict
    message_vector = vectorizer.transform([message])
    prediction = model.predict(message_vector)[0]
    label = 'Spam' if prediction == 1 else 'Not Spam'

    return jsonify({'prediction': label})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
   
