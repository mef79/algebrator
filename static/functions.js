var variable_letter;
var variable_side;

function generate_equation(a, b, c, d, lop, rop, letter){
	variable_letter = letter
	if (a == 0){
		variable_side = 'r'
	} else {
		variable_side = 'l'
	}

	left_expr = construct_expr("left", a, b, lop)
	right_expr = construct_expr("right", c, d, rop)

	$('#left-side').append(left_expr)
	$('#right-side').append(right_expr)
}

function construct_expr(side, coefficient, constant, op){
	if (coefficient != 0){
		coefficient_span = "<span id='" + side + "-coefficient' class='number'>" + coefficient + "</span>"
		var_span = "<span id='" + side + "-var'>" + variable_letter + "</span> "
		op_span = "<span id='" + side + "-op'>" + op + "</span> "
	} else {
		coefficient_span = ''
		var_span = ''
		op_span = ''
	}
	const_span = "<span id='" + side + "-const' class='number'>" + constant + "</span>"

	return coefficient_span + var_span + op_span + const_span

}

function random_n_in_range(low, high){
	return 
}

function random_letter(){

}

function operation(clicked){
	op = $(clicked).attr("op")
	id = $(clicked).attr("id")

	add_functions_to_vars(op) 	// add onclick functions to numbers
	highlight_vars() 			// highlight all numbers
	highlight_button('#' + id)	// highlight appropriate button
	add_cancel_button(op)		// add cancel button for appropriate operator
	disable_buttons()
}

function add_functions_to_vars(op){
	if (op == '+' || op == '-'){
		// the non-paretheses operations
		$('.number').attr('onclick', "add_sub('" + op + "', this)")
	} else {
		// operations that get parentheses
		$('.number').attr('onclick', "mult_div('" + op + "', this)")
	}
}

function add_cancel_button(op){
	id = get_id_from_op(op)

	$('#buttons').append('<button id="cancel-button" class="btn btn-lg btn-danger" onclick="cancel(\''+id+'\')">Cancel</button>')
}

function add_solve_again_button(){
	// $('#msg').append('<button id="again-button" class="btn btn-lg btn-info" onclick="reset()">Solve Again</button>')
	$('#msg').append("<img id='again-button' src='static/AnotherBtn.png' onclick='reset()'>")
}

function cancel(elem){
	$('.number').attr("onclick", "")
	unhighlight_vars()
	unhighlight_button()
	reenable_buttons()
	$('#cancel-button').remove()
}

function get_id_from_op(op){
	if (op == '+'){
		return "#add"
	}
	if (op == '-'){
		return "#sub"
	}
	if (op == '*'){
		return "#mult"
	}
	if (op == '/'){
		return "#divide"
	}
}

function add_sub(op, clicked){
	v = $(clicked).text()

	// insert operator followed by the number
	$('.side').append(" " + op + " <span class='number'>" + v + "</span> ")

	cancel(get_id_from_op(op))
}

function mult_div(op, clicked){
	v = $(clicked).text()

	// surround both sides with parentheses
	$('.side').prepend('(').append(')')

	// insert operator followed by the number after the parentheses
	$('.side').append(" " + op + ' <span class="number">' + v + '</span> ')

	cancel(get_id_from_op(op))

}

function simplify(){
	left = $('#left-side').text() // get left side, strip tags from it
	right = $('#right-side').text() // get right side, strip tags from it

	left = remove_whitespace(left)
	right = remove_whitespace(right)

	// replace letters with i, hack to use mathjs library for simplification
	left = left.replace(variable_letter, 'i')
	right = right.replace(variable_letter, 'i')

	l = math.eval(left)
	r = math.eval(right)

	$('.side').empty()

	if (typeof(l) == 'number'){
		constant = l
	} else {
		constant = r
	}

	if (constant < 0){
		op = '- '
		constant = Math.abs(constant)
	} else {
		op = '+ '
	}

	if (variable_side == 'l'){
		left_expr = construct_expr("left", l.im, l.re, op)
		right_expr = construct_expr("right", 0, 0, '')
	} else {
		right_expr = construct_expr("right", r.im, r.re, op)
		left_expr = construct_expr("left", 0, 0, '')
	}

	$('#left-side').append(left_expr)
	$('#right-side').append(right_expr)

	clean()

}

function clean(){
	if (variable_side == 'l'){
		coefficient = $('#left-coefficient')
		constant = $('#left-const')
		op = $('#left-op')
	} else {
		coefficient = $('#right-coefficient')
		constant = $('#right-const')
		op = $('#right-op')
	}
	
	if (coefficient.text() == '1' || coefficient.text() == '-1'){
		t = coefficient.text()
		coefficient.text(t.replace('1', ''))
	}

	if (constant.text() == '0'){
		op.remove()
		constant.text('')
	}

	check_complete()
}

function is_letter_by_itself(expr){
	return expr.length == 1 && expr.match(/[a-z]/i);
}

function check_complete(){
	left_side = remove_whitespace($('#left-side').text())
	right_side = remove_whitespace($('#right-side').text())
	if (is_letter_by_itself(left_side) || is_letter_by_itself(right_side)) {
		end_round()
	}
}

function end_round(){
	$('#msg').append("You've solved for " + variable_letter + "!")
	add_solve_again_button()
	disable_buttons()
}

function reset(){
	$('#left-side').empty()
	$('#right-side').empty()

	coefficient = Math.floor((Math.random() * 9) + 2);
	left_const = Math.floor((Math.random() * 10) + 1);
	right_const = Math.floor((Math.random() * 10) + 1);
	ops = ['+', '-']
	op = ops[Math.floor(Math.random()*2)]

	coefficient_span = '<span class="number" id="coefficient">' + coefficient + '</span>'
	left_const_span = '<span class="number" id="left-const">' + left_const + '</span>'
	right_const_span = '<span class="number">' + right_const + '</span>'

	$('#left-side').append(coefficient_span + variable_letter + ' ' + op + ' ' + left_const_span)
	$('#right-side').append(right_const_span)

	$('#msg').empty()
	reenable_buttons()
}

function disable_buttons(){
	$('.op-button').attr('onclick', "")
	$('#simplify-button').attr('onclick', "")
	grayout_buttons()
}

function reenable_buttons(){
	$('.op-button').attr('onclick', 'operation(this)')
	$('#simplify-button').attr('onclick', 'simplify()')
	un_grayout_buttons()
}

function remove_whitespace(e){
	return e.replace(/\s/g, "") 
}

// functions to change appearances of html elements

function highlight_vars(){
	$('.number').attr("style", "background:cyan")
}

function unhighlight_vars(){
	$('.number').attr("style", "background:white")
}

function highlight_button(selector){
	$(selector).addClass('highlighted-button')

	op = $(selector).attr('op') // get the 'op' attribute of the appropriate button

	/* Change the image based on the operator

	if (op == '+'){
		$(selector).attr('src', 'static/[filename of new plus image]')
	} else if (op == '-'){
		...
	}....... 

	*/
}

function unhighlight_button(){
	highlighted_button = $('.highlighted-button')
	highlighted_button.removeClass('highlighted-button')
	op = highlighted_button.attr('op')

	if (op == '+'){
		highlighted_button.attr('src', 'static/Plus3.jpg')
	} else if (op == '-'){
		highlighted_button.attr('src', 'static/Minus3.jpg')
	} else if (op == '*'){
		highlighted_button.attr('src', 'static/Times3.jpg')
	} else {
		highlighted_button.attr('src', 'static/Div3.jpg')
	}
}

function grayout_buttons(){
	// give the buttons the appearance of being disabled
	$('[op="+"]').attr('src', 'static/Plus_gray.png')
	$('[op="-"]').attr('src', 'static/Minus_gray.png')
	$('[op="*"]').attr('src', 'static/Times_gray.png')
	$('[op="/"]').attr('src', 'static/Div_gray.png')
}

function un_grayout_buttons(){
	// return the buttons to their original appearance
	$('[op="+"]').attr('src', 'static/Plus3.png')
	$('[op="-"]').attr('src', 'static/Minus3.png')
	$('[op="*"]').attr('src', 'static/Times3.png')
	$('[op="/"]').attr('src', 'static/Div3.png')
}