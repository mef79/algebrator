function operation(clicked){
	op = $(clicked).attr("op")
	id = $(clicked).attr("id")

	add_functions_to_vars(op) 	// add onclick functions to variables
	highlight_vars() 			// highlight all variables
	highlight_button('#' + id)	// highlight appropriate button
	add_cancel_button(op)		// add cancel button for appropriate operator
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

function cancel(elem){
	$('.variable').attr("onclick", "")
	unhighlight_vars()
	unhighlight_button()
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
	disable_buttons()
	grayout_buttons()
}

function disable_buttons(){
	$('#buttons').attr('onclick', "")
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

	// do highlighting here or add CSS rules for highlighted buton
}

function unhighlight_button(){
	highlighted_button = $('.highlighted-button')
	highlighted_button.removeClass('highlighted-button')
}

function grayout_buttons(){
	// give the buttons the appearance of being disabled
}