var variable_letter;

$( document ).ready(function() {
    variable_letter = $('#variable').text()
});

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
	$('#msg').append('<button id="again-button" class="btn btn-lg btn-info" onclick="reset()">Solve Again</button>')
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

	left = left.replace(variable_letter, 'i')

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

	$('#left-side').append('<span class="number" id="coefficient">' + l.im + '</span>' + variable_letter + ' <span id="op">' + op + ' </span><span class="number" id="left-const">' + left_const + '</span>')

	$('#right-side').append('<span class="number">' + r + '</span>')

	clean()

}

function clean(){
	coefficient = $('#coefficient')
	if (coefficient.text() == '1' || coefficient.text() == '-1'){
		t = coefficient.text()
		coefficient.text(t.replace('1', ''))
	}

	left_const = $('#left-const')
	if (left_const.text() == '0'){
		$('#op').remove()
		left_const.text('')
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