function random_in_range(low, high){
	return Math.floor(Math.random() * (high - low + 1)) + low;
}

function random_char(str){
	i = random_in_range(0, str.length-1)
	return str[i]
}

function letter_to_dir(e){
	if (e == "l"){
		return "left"
	} else {
		return "right"
	}
}

function remove_whitespace(e){
	return e.replace(/\s/g, "") 
}