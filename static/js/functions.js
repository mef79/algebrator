
// assign key down functions
$(document).keydown(function(e){
	//alert(e.keyCode) // never know when you'll need a key code

	if (buttons_enabled) { // operator press actions
		if (e.keyCode == 13){
		    simplify()
		}
		if (e.keyCode == 187){
			$add_button.click()
		}
		if (e.keyCode == 189){
			$sub_button.click()
		}
		if (e.keyCode == 56){
			$mult_button.click()
		}
		if (e.keyCode == 191){
			$divide_button.click()
		} 
	} else if (!solved) { // number press actions
		if (49 <= e.keyCode && e.keyCode <= 57){
			current_n = e.keyCode - 48
			execute()
		}
	}

	if (e.keyCode == 27){ //esc key
		cancel()
	}

	if (solved && !buttons_enabled){ // r = reset
		console.log('solved')
		if (e.keyCode == 82){
			reset()
		}
	}
});

// function called when an operator button is clicked
function click_op(clicked){
	$current_button = $(clicked)
	current_op = $current_button.attr('op')
	id = $current_button.attr("id")

	disable_buttons()
	define_number_clicks() 		// add onclick functions to numbers
	highlight_vars() 			// highlight all numbers
	highlight_current_button()	// highlight appropriate button
	enable_cancel_button()		// add cancel button for appropriate operator
}

function define_number_clicks(){
	$('.number').attr('onclick', 'click_n(this)')
}

function click_n(n){
	current_n = $(n).text()
	execute()
}

function enable_cancel_button(op){
	$('#cancel-button').prop('disabled', false)
	$('#cancel-button').attr('onclick', 'cancel()')
}

function add_solve_again_button(){
	$('#msg').append("<img id='again-button' src='static/img/AnotherBtn.png' onclick='reset()'>")
}

function cancel(){
	$('.number').attr("onclick", "")
	unhighlight_vars()
	reset_buttons()
	$('#cancel-button').prop('disabled', true)
	$('#cancel-button').attr('onclick', '')
}

function execute(){
	// surround with parentheses for * or /
	if (current_op == '*' || current_op == '/'){
		$('.side').prepend('(').append(')')
	}

	$('.side').append(" " + current_op + " <span class='number'>" + current_n + "</span> ")
	cancel()
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
		left_expr = construct_expr('l', l.im, l.re, op)
		right_expr = construct_expr('r', 0, r, '')
	} else {
		right_expr = construct_expr('r', r.im, r.re, op)
		left_expr = construct_expr('l', 0, l, '')
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
	$('#msg').append("<p>You've solved for " + variable_letter + "!</p>")
	add_solve_again_button()
	disable_buttons()
	$('#simplify-button').attr('src', 'static/img/Simplify_gray.png')
	solved = true
}

function reset(){
	$('#left-side').empty()
	$('#right-side').empty()

	generate_equation();

	$('#msg').empty()
	reset_buttons()
	$('#simplify-button').attr('src', 'static/img/Simplify.png')
	solved = false
}

function disable_buttons(){
	buttons_enabled = false
	$('.op-button').attr('onclick', "")
	$('#simplify-button').attr('onclick', "")
	grayout_buttons()
}

function reset_buttons(){
	buttons_enabled = true
	$('.op-button').attr('onclick', 'click_op(this)')
	$('#simplify-button').attr('onclick', 'simplify()')
	un_grayout_buttons()
}

function highlight_vars(){
	$('.number').attr("style", "background:cyan")
}

function unhighlight_vars(){
	$('.number').attr("style", "background:white")
}

function highlight_current_button(){
	src = 'static/img/' + $current_button.attr('name') + '/highlight.png'
	$current_button.attr('src', src)
}

function grayout_buttons(){
	$('#op-buttons').children().each(function(){
		src = 'static/img/' + $(this).attr('name') + '/gray.png';
		$(this).attr('src', src);
	});
}

function un_grayout_buttons(){
	$('#op-buttons').children().each(function(){
		src = 'static/img/' + $(this).attr('name') + '/default.png';
		$(this).attr('src', src)
	});
}