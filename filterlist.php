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
	jQuery.filterlist();
//	jQuery('#content').filterlist(jQuery('#content > div:first'));
	jQuery('li > a').click(function(){
		options = {'filter' : jQuery(this).attr('href')	};
		jQuery('#vertical > div').filterlist('filter',options);
		options.horizontal = true;
		jQuery('#horizontal > div').filterlist('filter',options);
		return false;
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
			<h2> Vertical filter list</h1>
			<div id="vertical">
				<?php print_elements(); ?>
			</div><!-- #vertical -->
		</div><!-- #vertical-demo -->
		<div id="horizontal-demo">
			<h2> Horizontal filter list</h1>
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
</div><!-- #sidebar -->

</body>
