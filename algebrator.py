from flask import Flask
from flask import render_template
from random import randint, choice
import string

app = Flask(__name__)

@app.route("/")
def hello():
	a, b, c, op, letter = create_equation()
	return render_template('index.html', a=a, b=b, c=c, op=op, letter=letter)

def create_equation():
	a = randint(2, 10)
	b = randint(1, 10)
	c = randint(1, 10)
	op = choice(['+', '-'])

	letters = list(string.ascii_lowercase)
	letters.remove('l') # l looks weird
	letters.remove('o') # so does o
	letter = choice(letters)

	return a, b, c, op, letter

if __name__ == "__main__":
    app.run(debug=True)