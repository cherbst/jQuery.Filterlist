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


	var methods = {
		filter : function(options){
			var settings = {
				'duration' : 1000,
				horizontal : false,
				container : null,
				stickToCurrentElement : false,
				curElement : null,
				beforeShow : function(){},
				afterShow : function(){},
				getNewCurElement : function(filter,oldCur,shown){ 
					return (shown.index(oldCur)==-1?shown.first():oldCur); 
				}
			};

	 		if ( options )
        			$.extend( settings, options );
			if ( settings.container ){
				if ( !settings.curElement ){
					settings.curElement = settings.container.data('curElement');
					if ( !settings.curElement )
						settings.curElement = this.first(':visible');
				}
				settings.stickToCurrentElement = true;
				settings.margin = ( settings.horizontal?settings.curElement.offset().left:
							settings.curElement.offset().top);
			}
			settings.curElement = filterElements.apply(this,[settings]);
			if ( settings.container )
				settings.container.data('curElement',settings.curElement);

			return settings.curElement;
		}
	};

	function getExtentCorrection(toShow,options){
		if ( options.curElement.length == 0)
			return 0;
		
		if ( toShow.index(options.curElement) == -1 )
			return (options.horizontal?options.curElement.offset().left:options.curElement.offset().top) - options.margin;

		var upper = options.curElement.prevAll(':visible').first();

		if ( upper.length > 0 )
			return (options.horizontal?upper.offset().left:upper.offset().top) + 
				(options.horizontal?upper.width():upper.height()) - options.margin;

		var closest = options.curElement.closest(':visible');
		return (options.horizontal?closest.offset().left:closest.offset().top) - options.margin;
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

	function getRefExtent(allElements,toHide,toShow,options){
		var curIndex = allElements.index(options.curElement);
		var refExtent = 0;

		toHide.each(function(){
			extent = getElementExtent($(this),options.horizontal);
			if ( options.stickToCurrentElement && 
				options.curElement.length > 0 && allElements.index($(this)) < curIndex )
				refExtent -= extent;
		});

		toShow.each(function(){
			extent = getElementExtent($(this),options.horizontal);
			if ( options.stickToCurrentElement && 
				options.curElement.length > 0 && allElements.index($(this)) < curIndex )
				refExtent += extent;
		});

		return refExtent;
	}

	// filter elements for according to given filter selector
	function filterElements(options){
		var allElements = this;
		var hidden,shown, toShow;
		var refExtent = 0;

		// keep all elements matching filter
		hidden = allElements.not(options.filter);
		shown = allElements.filter(options.filter);

		var toShow = shown.not(':visible');
		var toHide = hidden.filter(':visible');
		var elementsToShow = ( allElements.length != hidden.length );

		if ( elementsToShow ){
			options.curElement = options.getNewCurElement(options.filter,options.curElement,shown);
			refExtent = getRefExtent(allElements,toHide,toShow,options);

			toHide.each(function(){
				obj = {opacity: 0 };
				extent = getElementExtent($(this),options.horizontal);
				$(this).data('extent',extent);
				if ( options.horizontal )
					obj.width = 0;
				else
					obj.height = 0;
				$(this).animate(obj,options.duration);
			});
		}else
			toHide.fadeOut(options.duration);

		toHide.promise().done(function(){
			toHide.hide();
		});
		
		options.beforeShow(elementsToShow);
		if ( !elementsToShow )
			return;

		toShow.show();

		toShow.each(function(){
			obj = {opacity: 1 };
			extent = getElementExtent($(this),options.horizontal);
			if ( options.horizontal )
				obj.width = extent;
			else
				obj.height = extent;
			$(this).animate(obj,options.duration,function(){
				if ( this.style && this.style.removeAttribute)
					this.style.removeAttribute("filter");
			});
		});

		if ( options.stickToCurrentElement ){
			refExtent += getExtentCorrection(toShow,options);
			console.log('refext:'+refExtent);
			if ( options.horizontal )
				options.container.animate({left: "-="+ refExtent},options.duration);
			else
				options.container.animate({top: "-="+ refExtent},options.duration);
		}

		toShow.promise().done(options.afterShow);

		return options.curElement;
	};

	$.fn.filterlist = function( method ) {
    
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.filter.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.filterlist' );
		}
	};

})( jQuery );
