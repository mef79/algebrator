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

	left = left.replace(/\s/g, "") 
	right = right.replace(/\s/g, "")

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

}

// functions to change appearances of html elements

function highlight_vars(){
	$('.variable').attr("style", "background:cyan")
}

function unhighlight_vars(){
	$('.variable').attr("style", "background:white")
}

function highlight_button(selector){
	console.log('Button highlighted, selector: ' + selector)
	$(selector).addClass('highlighted-button')

	// do highlighting here or add CSS rules for highlighted buton
}

function unhighlight_button(){
	highlighted_button = $('.highlighted-button')
	console.log('Button to unhighlight identified, selector: #' + highlighted_button.attr('id'))
	highlighted_button.removeClass('highlighted-button')
}