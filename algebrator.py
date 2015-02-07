from flask import Flask
from flask import render_template
from random import randint, choice

app = Flask(__name__)

@app.route("/")
def hello():
	a, b, c, op = create_equation()
	return render_template('index.html', a=a, b=b, c=c, op=op)

def create_equation():
	a = randint(2, 10)
	b = randint(1, 10)
	c = randint(1, 10)
	op = choice(['+', '-'])
	return a, b, c, op

if __name__ == "__main__":
    app.run(debug=True)