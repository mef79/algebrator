function operation(clicked){
	op = $(clicked).attr("op")
	id = $(clicked).attr("id")

	add_functions_to_vars(op) 	// add onclick functions to variables
	highlight_vars() 			// highlight all variables
	highlight_button('#' + id)	// highlight appropriate button
	add_cancel_button(op)		// add cancel button for appropriate operator
	disable_buttons()
}

function add_functions_to_vars(op){
	if (op == '+' || op == '-'){
		// the non-paretheses operations
		$('.variable').attr('onclick', "add_sub('" + op + "', this)")
	} else {
		// operations that get parentheses
		$('.variable').attr('onclick', "mult_div('" + op + "', this)")
	}
}

function add_cancel_button(op){
	id = get_id_from_op(op)

	$('#buttons').append('<button id="cancel-button" class="btn btn-lg btn-danger" onclick="cancel(\''+id+'\')">Cancel</button>')
}

function add_solve_again_button(){
	$('#msg').append('<button id="again-button" class="btn btn-lg btn-info" onclick="reset()">Solve Again</button>')
}

function cancel(elem){
	$('.variable').attr("onclick", "")
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
	$('.side').append(" " + op + " <span class='variable'>" + v + "</span> ")

	cancel(get_id_from_op(op))
}

function mult_div(op, clicked){
	v = $(clicked).text()

	// surround both sides with parentheses
	$('.side').prepend('(').append(')')

	// insert operator followed by the number after the parentheses
	$('.side').append(" " + op + ' <span class="variable">' + v + '</span> ')

	cancel(get_id_from_op(op))

}

function simplify(){
	left = $('#left-side').text() // get left side, strip tags from it
	right = $('#right-side').text() // get right side, strip tags from it

	left = remove_whitespace(left)
	right = remove_whitespace(right)

	left = left.replace('x', 'i')

	l = math.eval(left)
	r = math.eval(right)

	$('.side').empty()

	left_const = l.re

	if (left_const < 0){
		op = '- '
		left_const = Math.abs(left_const)
	} else {
		op = '+ '
	}

	$('#left-side').append('<span class="variable" id="x-coefficient">' + l.im + '</span>x <span id="op">' + op + ' </span><span class="variable" id="left-const">' + left_const + '</span>')

	$('#right-side').append('<span class="variable">' + r + '</span>')

	clean()

}

function clean(){
	x_coefficient = $('#x-coefficient')
	if (x_coefficient.text() == '1' || x_coefficient.text() == '-1'){
		t = x_coefficient.text()
		x_coefficient.text(t.replace('1', ''))
	}

	left_const = $('#left-const')
	if (left_const.text() == '0'){
		$('#op').remove()
		left_const.text('')
	}

	check_complete()
}

function check_complete(){
	left_side = remove_whitespace($('#left-side').text())
	if (left_side == 'x'){
		end_round()
	}
}

function end_round(){
	$('#msg').append("You've solved for x!")
	add_solve_again_button()
	disable_buttons()
}

function reset(){
	$('#left-side').empty()
	$('#right-side').empty()

	x_coefficient = Math.floor((Math.random() * 9) + 2);
	left_const = Math.floor((Math.random() * 10) + 1);
	right_const = Math.floor((Math.random() * 10) + 1);
	ops = ['+', '-']
	op = ops[Math.floor(Math.random()*2)]

	x_coefficient_span = '<span class="variable" id="x-coefficient">' + x_coefficient + '</span>'
	left_const_span = '<span class="variable" id="left-const">' + left_const + '</span>'
	right_const_span = '<span class="variable">' + right_const + '</span>'

	$('#left-side').append(x_coefficient_span + 'x ' + op + ' ' + left_const_span)
	$('#right-side').append(right_const_span)

	$('#msg').empty()
	reenable_buttons()
}

function disable_buttons(){
	$('.op-button').attr('onclick', "")
	grayout_buttons()
}

function reenable_buttons(){
	$('.op-button').attr('onclick', 'operation(this)')
	un_grayout_buttons()
}

function remove_whitespace(e){
	return e.replace(/\s/g, "") 
}

// functions to change appearances of html elements

function highlight_vars(){
	$('.variable').attr("style", "background:cyan")
}

function unhighlight_vars(){
	$('.variable').attr("style", "background:white")
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
}

function un_grayout_buttons(){
	// return the buttons to their original appearance
}