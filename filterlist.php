<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Filter list Demo page</title>
<link rel="stylesheet" type="text/css" media="all" href="http://localhost/filterlist/style.css" />
<script type='text/javascript' src='http://localhost/filterlist/jquery-1.6.1.min.js'></script>
<script type='text/javascript' src='http://localhost/filterlist/jquery.filterlist.js'></script>
<script type='text/javascript'><!--

jQuery(document).ready(function(){
	var moveContainer = false;
	var curVertical;
	var curHorizontal;
	var origTop = jQuery('#vertical').css('top');
	var origLeft = jQuery('#horizontal').css('left');
	jQuery('li > a').click(function(){
		options = {'filter' : jQuery(this).attr('href')	};
		if ( moveContainer ){
			curVertical.removeClass('current');
			options.container = jQuery('#vertical');
			options.curElement = curVertical;
		}
		curVertical = jQuery('#vertical > div').filterlist(options);
		if ( moveContainer )
			curVertical.addClass('current');

		if ( moveContainer ){
			curHorizontal.removeClass('current');
			options.container = jQuery('#horizontal');
			options.curElement = curHorizontal;
		}
		options.horizontal = true;
		curHorizontal = jQuery('#horizontal > div').filterlist(options);
		if ( moveContainer )
			curHorizontal.addClass('current');
		return false;
	});
	jQuery('#moveContainer').click(function(){ 
		if ( moveContainer ){
			jQuery('#vertical').css('overflow-y','auto');
			jQuery('#horizontal').css('overflow-x','auto');
			curVertical.add(curHorizontal).removeClass('current');
			jQuery('#vertical').css('top',origTop);
			jQuery('#horizontal').css('left',origLeft);
			moveContainer= false;
		}else{
			jQuery('#vertical > div').filterlist({'filter':'*'});
			jQuery('#horizontal > div').filterlist({'filter':'*','horizontal':true});
			curVertical = jQuery(jQuery('#vertical > div').get(2));
			curHorizontal = jQuery(jQuery('#horizontal > div').get(5));
			jQuery('#vertical').scrollTop(0);
			jQuery('#horizontal').scrollLeft(0);
			jQuery('#vertical').css('overflow-y','hidden');
			jQuery('#horizontal').css('overflow-x','hidden');
			curVertical.add(curHorizontal).addClass('current');
			moveContainer= true;
		}
	});
});

// --></script>

<?php
function print_elements($style = 'height'){
	for ( $i=0;$i<30;$i++){

		$class1 = rand(1,5);
		do {
			$class2 = rand(1,5);
		}while( $class2 == $class1 );
		$num = rand(20,100);
		echo '<div class="cat'.$class1.' cat'.$class2.'" style="'.$style.':'.$num.'px;">';
		echo 'Element with category '.$class1.' and '.$class2.'</div>';

	}
}
?>
</head>

<body>
<div id="header">
	<h1> Filter list demo </h1>
</div> <!-- #header -->

<div id="container">
	<div id="content">
		<div id="vertical-demo">
			<div class="title"><h2>Vertical filter list</h1></div>
			<div id="vertical">
				<?php print_elements(); ?>
			</div><!-- #vertical -->
		</div><!-- #vertical-demo -->
		<div id="horizontal-demo">
			<div class="title"><h2>Horizontal filter list</h1></div>
			<div id="horizontal">
				<?php print_elements('width'); ?>
			</div><!-- #horizontal -->
		</div><!-- #horizontal-demo -->
	</div><!-- #content -->
</div><!-- #container -->

<div id="sidebar">
	<ul>
		<li><a title="All" href="*">Show all</a></li>
<?php
for ( $i=1;$i<=5;$i++ )
	echo '<li><a title="Category '.$i.'" href=".cat'.$i.'">Category '.$i.'</a></li>';
?>
	</ul>
<input id="moveContainer" type="checkbox" value="moveContainer"> Track current element
</div><!-- #sidebar -->

</body>
