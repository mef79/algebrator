function generate_equation(){
	// constants, coefficient, and operator created at random
	left_const = random_in_range(1, 9);
	right_const = random_in_range(1, 9);
	coefficient = random_in_range(2, 9);
	op = random_char('+-');

	// call construct equation with values appropriate to equation layout
	if (variable_side == 'l'){
		write_equation(coefficient, left_const, 0, right_const, op, '');
	} else {
		write_equation(0, left_const, coefficient, right_const, '', op);
	}
}

function write_equation(a, b, c, d, lop, rop){
	left_expr = construct_expr('l', a, b, lop);
	right_expr = construct_expr('r', c, d, rop);

	$('#left-side').append(left_expr);
	$('#right-side').append(right_expr);
}

function construct_expr(side, coefficient, constant, op){
	side = letter_to_dir(side)

	coefficient_span = '';
	var_span = '';
	op_span = '';
	const_span = "<span id='" + side + "-const' class='number'>" + constant + "</span>"

	if (coefficient != 0){
		coefficient_span = "<span id='" + side + "-coefficient' class='number'>" + coefficient + "</span>";
		var_span = "<span id='" + side + "-var'>" + variable_letter + "</span> ";
		op_span = "<span id='" + side + "-op'>" + op + "</span> ";
	};

	return coefficient_span + var_span + op_span + const_span;
}