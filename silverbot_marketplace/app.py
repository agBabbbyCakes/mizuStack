from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/setup-agent', methods=['POST'])
def setup_agent():
    if request.is_json:
        data = request.get_json()
        # Here you would typically process the agent setup data
        return jsonify({
            'status': 'success',
            'message': 'Agent setup completed successfully'
        }), 200
    return jsonify({
        'status': 'error',
        'message': 'Invalid request format'
    }), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001) 