from flask import Flask
from flask import render_template
from random import randint, choice
import string

app = Flask(__name__)

@app.route("/")
def hello():
	a, b, c, d, lop, rop, letter = create_equation()
	return render_template('index.html', a=a, b=b, c=c, d=d, lop=lop, rop=rop, letter=letter)

def create_equation():
	variable_sides = ['left', 'right']
	variable_side = choice(variable_sides)

	a = randint(2, 9)
	b = randint(1, 9)
	c = randint(2, 9)
	d = randint(1, 9)

	lop = choice(['+', '-'])
	rop = choice(['+', '-'])

	if variable_side == 'left':
		c = 0
		rop = ''

	if variable_side == 'right':
		a = 0
		lop = ''

	letters = list(string.ascii_lowercase)
	letters.remove('l') # l looks weird
	letters.remove('o') # so does o
	letter = choice(letters)

	return a, b, c, d, lop, rop, letter

if __name__ == "__main__":
    app.run(debug=True)