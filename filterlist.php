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
		jQuery('#content > div').filterlist('filter',{
			'filter' : jQuery(this).attr('href')
		});
		return false;
	});
});

// --></script>

</head>

<body>
<div id="header">
<h1> Filter list demo </h1>
</div>
<div id="container">
<div id="content">
<?php

for ( $i=0;$i<20;$i++){

	$class1 = rand(1,5);
	do {
		$class2 = rand(1,5);
	}while( $class2 == $class1 );
	$height = rand(20,100);
	echo '<div class="cat'.$class1.' cat'.$class2.'" style="height:'.$height.'px;">';
	echo 'Element with category '.$class1.' and '.$class2.'</div>';

}

?>
</div>
<div id="sidebar">
	<ul>
		<li><a title="All" href="*">Show all</a></li>
<?php
for ( $i=1;$i<=5;$i++ )
	echo '<li><a title="Category '.$i.'" href=".cat'.$i.'">Category '.$i.'</a></li>';
?>
	</ul>
</div>
</div>

</body>
