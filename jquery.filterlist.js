/*
 * jQuery Filter list Plugin v0.1
 * http://www.github.com/filterlist
 *
 * Copyright (c) 2009-2010 Christoph Herbst
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Date: 2011-08-10
 */

(function( $ ){

	var container;
	var curElement;
	var margin;
	var stickToCurrentElement = false;

	var methods = {
		init : function( cur ) { 
			container = this;
			curElement = cur;
			if ( !$.isFunction(this) ){
				margin = container.offset().top;
				stickToCurrentElement = true;
			}
			return this;
		},
		filter : function(options){
			var filterOptions = {
				'duration' : 1000,
				horizontal : false,
				beforeShow : function(){},
				afterShow : function(){},
				getNewCurElement : function(filter,oldCur,shown){ 
					return (shown.index(oldCur)==-1?shown.first():oldCur); 
				}
			};

	 		if ( options )
        			$.extend( filterOptions, options );
			return filterElements.apply(this,[filterOptions]);
		}
	};

	function getExtentCorrection(toShow,horizontal){
		if ( curElement.length == 0)
			return 0;
		
		if ( toShow.index(curElement) == -1 )
			return (horizontal?curElement.offset().left:curElement.offset().top) - margin;

		var upper = curElement.prevAll(':visible').first();

		if ( upper.length > 0 )
			return (horizontal?upper.offset().left:upper.offset().top) + 
				(horizontal?upper.width():upper.height()) - margin;

		var closest = curElement.closest(':visible');
		return (horizontal?closest.offset().left:closest.offset().top) - margin;
	}

	function findElement(element,allElements,toShow,hidden,prev){
		var start = allElements.index(element) + (prev?0:1);
		if ( start < 0 || start >= allElements.length ) return $();

		var elements = allElements.slice((prev?0:start),(prev?start:allElements.length));
		var newElement = $();
		(prev?$(elements.get().reverse()):elements).each(function(){
			if ( toShow.index($(this)) == -1 &&
			     hidden.index($(this)) == -1 ){
				newElement = $(this);
				return false;
			}
		});
		return newElement;
	}

	function findPrevElement(element,allElements,toShow,hidden){
		return findElement(element,allElements,toShow,hidden,true);
	}

	function findNextElement(element,allElements,toShow,hidden){
		return findElement(element,allElements,toShow,hidden,false);
	}

	function getElementId(element,allElements){
		var element_id = element.attr('id'); 
		if ( !element_id ){
			element_id = 'element_'+allElements.index(element);
			element.attr('id',element_id);
		}
		return element_id;
	}

	// returns the group id of the given element
	function getGroupId(element,allElements,toShow,hidden){
		var upper_id = "begin"; 
		var lower_id = "end";

		// find prev element from this not in toShow/toHide
		var upper = findPrevElement(element,allElements,toShow,hidden);

		if ( upper.length > 0 )
			upper_id = getElementId(upper,allElements);

		// find next element from this not in toShow/toHide
		var lower = findNextElement(element,allElements,toShow,hidden);

		if ( lower.length > 0 )
			lower_id = getElementId(lower,allElements); 

		return upper_id+'_'+lower_id;
	}

	// gets the extent of the element from its data field if possible
	// this is done because getting the extent of a hidden element
	// takes a long time
	function getElementExtent(element,horizontal){
		var dataExtent = element.data('extent');
		var extent = (dataExtent?parseInt(dataExtent,10):(horizontal?element.width():element.height()));
		if ( !dataExtent ) element.data('extent',extent);
		return extent;
	}

	function computeNewExtents(allElements,toHide,toShow,hidden,shown,horizontal){
		var groups = {};
		// compute show/hide groups

		var refExtent = 0;
		var curIndex = allElements.index(curElement);
		var group_id;
		var oldElement;

		toHide.add(toShow).each(function(){
			// get new group id if this is not the next of the old element	
			if ( !oldElement || $(this).prev().length == 0 ||
				getElementId(oldElement,allElements) != getElementId($(this).prev(),allElements) )
				group_id = getGroupId($(this),allElements,toShow,hidden);

			var group;
			if ( group_id in groups )
				group = groups[group_id];
			else{
				group = {
					toHide : [],
					toShow : [],
					hideExtent: 0,
					showExtent : 0
				};
				groups[group_id] = group;
			}

			var extent = getElementExtent($(this),horizontal);
			if ( toShow.index($(this)) != -1 ){
				if ( stickToCurrentElement && curElement.length > 0 && allElements.index($(this)) < curIndex )
					refExtent += extent;
				group.toShow.push($(this));
				group.showExtent += extent;
			}else{
				if ( stickToCurrentElement && curElement.length > 0 && allElements.index($(this)) < curIndex )
					refExtent -= extent;
				$(this).data('newextent',extent);
				group.toHide.push($(this));
				group.hideExtent += extent;
			}
			oldElement = $(this);
		});

		if ( stickToCurrentElement ){
			refExtent += getExtentCorrection(toShow,horizontal);
			container.data('refExtent',refExtent);
		}

		for(key in groups) {
			console.log('Group:'+key);
			var group = groups[key];
			var diff = group.hideExtent - group.showExtent;
			if ( group.showExtent > group.hideExtent ){
				for (var i = 0,j = group.toShow.length; i < j; i++) {
					var element = group.toShow[i];
					var extent = getElementExtent(element,horizontal);
					element.data('extent',extent);
					var newExtent = Math.round(Math.abs(
						extent + (extent / group.showExtent)*diff));
					if ( horizontal )
						element.width(newExtent);
					else
						element.height(newExtent);
				}
			}else{
				for (var i = 0,j = group.toHide.length; i < j; i++) {
					var element = group.toHide[i];
					var extent = getElementExtent(element,horizontal);
					var newExtent = Math.round(Math.abs(
						extent - (extent / group.hideExtent)*diff));
					element.data('newextent',newExtent);
				}
			}
		}
	}

	// filter elements for according to given filter selector
	function filterElements(options){
		var allElements = this;
		var hidden,shown, toShow;

		// keep all elements matching filter
		hidden = allElements.not(options.filter);
		shown = allElements.filter(options.filter);

		var toShow = shown.not(':visible');
		var toHide = hidden.filter(':visible');
		var elementsToShow = ( allElements.length != hidden.length );

		if ( elementsToShow ){
			curElement = options.getNewCurElement(options.filter,curElement,shown);
			computeNewExtents(allElements,toHide,toShow,hidden,shown,options.horizontal);

			toHide.each(function(){
				obj = {opacity: 0 };
				ext = parseInt($(this).data('newextent'),10);
				if ( options.horizontal )
					obj.width = ext;
				else
					obj.height = ext;
				$(this).animate(obj,options.duration);
			});
			if ( stickToCurrentElement ){
				var refExtent = parseInt(container.data('refExtent'),10);
				if ( refExtent < 0 )
					container.animate({top: "-="+ refExtent},options.duration);
			}
		}else
			toHide.fadeOut(options.duration);

		toHide.promise().done(function(){

			toHide.hide();
			toHide.each(function(){
				$(this).css((options.horizontal?'width':'height'),getElementExtent($(this),options.horizontal));
			});

			options.beforeShow(elementsToShow);
			if ( !elementsToShow )
				return;

			toShow.show();

			toShow.each(function(){
				obj = {opacity: 1 };
				if ( options.horizontal )
					obj.width = getElementExtent($(this),options.horizontal);
				else
					obj.height = getElementExtent($(this),options.horizontal);
				$(this).animate(obj,options.duration,function(){
					if ( this.style && this.style.removeAttribute)
						this.style.removeAttribute("filter");
				});
			});

			if ( stickToCurrentElement ){
				var refExtent = parseInt(container.data('refExtent'),10);
				if ( refExtent > 0 )
					container.animate({top: "-="+ refExtent},options.duration);
			}

			toShow.promise().done(options.afterShow);
		});

		return curElement;
	};

	$.filterlist = $.fn.filterlist = function( method ) {
    
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.filterlist' );
		}
	};

})( jQuery );
