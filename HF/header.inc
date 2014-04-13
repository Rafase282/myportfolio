<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>&raquo; <?php if (isset($subtitle)) { echo $subtitle; } else {
		echo "A little about Rafael Rodriguez";}?></title>
		<meta name="description" content="This is my final Project (Still work in progress)" />
		<meta name="author" content="Rafael J. Rodriguez" />
		<meta name="viewport" content="width=device-width,initial-scale=1.0" />
		<META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE" />
  		<META HTTP-EQUIV="PRAGMA" CONTENT="NO-CACHE" />
		<link rel="stylesheet" href="../css/styles.css" />
		<script src="../javascript/menuscript.js" language="javascript" type="text/javascript"></script>
		<!--This makes HTML5 work in IE-->
		<![if lt IE 9]>
		<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]>
		<?php if ($subtitle == "Feed Back") {include("../projects/ifr.inc");}?>
	</head>
	<?php if ($subtitle == "Feed Back") {echo '<body onload="loader()">';}
	else {echo '<body>';} ?> 
				<header>
					<hgroup>
						<center>
					   		<h1 id="titulo">Rafael J. Rodriguez</h1>
					   		<h3>My small web portfolio.</h3>
					   		<img src="/img/rafase-1.jpg" alt="Rafase 282"/>
					   		<nav id="Navigation">
					   			<? if (isset($navigation)) { include("$navigation"); }?>
					   		</nav>
					   	</center>
				    </hgroup>
				</header>
				<?php if ($navigation == "navigation/home.inc") {include("sidepanel.inc");}
				else {include("../sidepanel.inc");} ?>
				<div id="Main">