(function($){
	var customSelect = $('select.custom-select');
	// FIRST, create the custom select menus from the existing select
	customSelect.each(function() {
		var that = $(this);
		var listID = that.attr('id'),
		groups = that.children('optgroup'),
			theOptions = "",
			startingOption = "",
			customSelect = "";
		//check if there are option groups 
		if(groups.length) {
			groups.each(function() {
				var curGroup = $(this);
				var	curName = curGroup.attr('label');
				//Open the option group
				theOptions += '<li class="optgroup">' + curName + '</li>';
				//get the options
				curGroup.children('option').each(function() {
					var curOpt = $(this);
					var curVal = curOpt.attr('value'),
						curHtml = curOpt.html(),
						isSelected = curOpt.attr('selected');
					if(isSelected === 'selected') {
						startingOption = curHtml;
						theOptions += '<li class="selected" data-value="' + curVal + '">' + curHtml + '</li>';
					}else {
						theOptions += '<li data-value="' + curVal + '">' + curHtml + '</li>';
					}
				});
				//Close the option group
				//theOptions += '<li class="optgroup-close"></li>';
			});
			//add options not in a group to the top of the list
			that.children('option').each(function() {
				var curOpt = $(this);
				var curVal = curOpt.attr('value'),
					curHtml = curOpt.html(),
					isSelected = curOpt.attr('selected');
				if(isSelected === 'selected') {
					startingOption = curHtml;
					theOptions = '<li class="selected" data-value="' + curVal + '">' + curHtml + '</li>' + theOptions;
				}else {
					theOptions = '<li data-value="' + curVal + '">' + curHtml + '</li>' + theOptions;
				}
			});
		} else {
			that.children('option').each(function() {
				var curOpt = $(this);
				var curVal = curOpt.attr('value'),
					curHtml = curOpt.html(),
					isSelected = curOpt.attr('selected');
				if(isSelected === 'selected') {
					startingOption = curHtml;
					theOptions += '<li class="selected" data-value="' + curVal + '">' + curHtml + '</li>';
				}else {
					theOptions += '<li data-value="' + curVal + '">' + curHtml + '</li>';
				}
			});
		}
		//build the custom select
		customSelect = '<div class="dropdown-container"><div class="dropdown-select entypo-down-open-big"><span>' + startingOption + '</span></div><ul class="dropdown-select-ul" data-role="' + listID +'">' + theOptions + '</ul></div> <!-- .custom-select-wrapper -->';
		//append it after the actual select
		$(customSelect).insertAfter(that);
	});
	
	var	selectdd = $('.dropdown-select'),
		selectul = $('.dropdown-select-ul'),
		selectli = $('.dropdown-select-ul li');
	//THEN make them work
	selectdd.on('click',function(){
		$(this).parent('.dropdown-container').toggleClass('active');
	});
	//Hide it on mouseleave
	selectul.on('mouseleave',function(){
		$(this).parent('.dropdown-container').removeClass('active');
	});
	//select the option
	selectli.on('click',function(){
		var that = $(this);
		//ensure clicking group labels does not cause change
		if(!that.hasClass('optgroup')) {
			var	parentUl = that.parent('ul'),
				thisdd = parentUl.siblings('.dropdown-select'),
				lihtml = that.html(),
				livalue = that.attr('data-value'),
				originalSelect = '#' + parentUl.attr('data-role');
			//close the dropdown
			parentUl.parent('.dropdown-container').toggleClass('active');
			//remove selected class from all list items
			that.siblings('li').removeClass('selected');
			//add .selected to clicked li
			that.addClass('selected');
			//set the value of the hidden input
			$(originalSelect).val(livalue);
			//change the dropdown text
			thisdd.children('span').html(lihtml);
		}
	});
})(jQuery);