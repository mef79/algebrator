
// assign key down functions
$(document).keydown(function(e){
	//alert(e.keyCode) // never know when you'll need a key code

	if (buttons_enabled) { // operator press actions
		if (e.keyCode == 13 && simplify_enabled == true){
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
		if (48 <= e.keyCode && e.keyCode <= 57){
			current_n = e.keyCode - 48
			execute()
		}
	}

	if (e.keyCode == 27){ //esc key
		cancel()
	}

	if (e.keyCode == 82){
		reset()
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
	$('#cancel-button').attr('src', 'static/img/Cancel.png')
	$('#cancel-button').attr('onclick', 'cancel()')
}

function disable_cancel_button(){
	$('#cancel-button').attr('onclick', '');
	$('#cancel-button').attr('src', 'static/img/Cancel_gray.png')
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
	disable_cancel_button();
}

function execute(){
	$('#msg').empty()
	if (current_op == '/' && current_n == '0'){
		$('#msg').append('<p>Dividing by zero is bad for your health.</p>')
		cancel()
		return
	}

	// surround with parentheses for * or /
	if (current_op == '*' || current_op == '/'){
		$('.side').prepend('(').append(')')
	}

	$('.side').append(" " + current_op + " <span class='number'>" + current_n + "</span> ")
	cancel()
}

function simplify(){
	console.log('simplify called');
	left = $('#left-side').text() // get left side, strip tags from it
	right = $('#right-side').text() // get right side, strip tags from it

	left = remove_whitespace(left)
	right = remove_whitespace(right)

	// replace letters with i, hack to use mathjs library for simplification
	left = left.replace(variable_letter, 'i')
	right = right.replace(variable_letter, 'i')

	l = math.eval(left)
	r = math.eval(right)

	$('.side').empty() // empty both sides

	if (variable_side == 'l'){
		if (l.re < 0){
			switch_current_op();
			l.re = Math.abs(l.re);
		}
		left_expr = construct_expr('l', l.im, l.re, op)
		right_expr = construct_expr('r', 0, r, '')
	} else {
		if (r.re < 0){
			switch_current_op();
			r.re = Math.abs(r.re);
		}
		left_expr = construct_expr('l', 0, l, '')
		right_expr = construct_expr('r', r.im, r.re, op)
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

	console.log('hi mom')
	if (op == '+' && constant.indexOf('-') > -1){
		console.log('hi mom')
		op.text('-');
		constant.remove('-')
	}

	disable_simplify_button()
	disable_cancel_button()
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
	disable_simplify_button()
	solved = true
}

function reset(){
	$('#left-side').empty()
	$('#right-side').empty()

	generate_equation();

	$('#msg').empty()
	reset_buttons()
	disable_simplify_button();
	simplify_enabled = false;
	solved = false;
}

function switch_current_op(){
	if (current_op == '+'){
		current_op = '-';
	} else {
		current_op = '+'
	}
}

function disable_buttons(){
	buttons_enabled = false
	$('.op-button').attr('onclick', "")
	disable_simplify_button()

	// gray out op buttons
	$('#op-buttons').children().each(function(){
		src = 'static/img/' + $(this).attr('name') + '/gray.png';
		$(this).attr('src', src);
	});
}

function disable_simplify_button(){
	simplify_enabled = false;
	$('#simplify-button').attr('src', 'static/img/Simplify_gray.png');
	$('#simplify-button').attr('onclick', '');
}

function enable_simplify_button(){
	simplify_enabled = true;
	$('#simplify-button').attr('onclick', 'simplify()')
	$('#simplify-button').attr('src', 'static/img/Simplify.png')
}

function reset_buttons(){
	buttons_enabled = true
	enable_simplify_button();
	$('.op-button').attr('onclick', 'click_op(this)')

	// un gray-out buttons
	$('#op-buttons').children().each(function(){
		src = 'static/img/' + $(this).attr('name') + '/default.png';
		$(this).attr('src', src)
	});
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