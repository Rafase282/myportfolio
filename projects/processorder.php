<?php 
$subtitle = "Custom order your Paella";
$navigation = "../navigation/projects.inc";
include("../HF/header.inc"); ?>
				<h1>The Paella ordering system</h1>
				
				<?php
				if ($_POST) {
					$firstname = $_POST["firstname"];
					$lastname = $_POST["lastname"];
					$email = $_POST["email"];
					$phone = $_POST["phone"];
					$seafood = $_POST["seafood"];
					$size1 = $_POST["size1"];
					$size = $_POST["size"];
					$comment = $_POST["comments"];
				        $space = '&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp';
					}
				?>
				
				<p>
				Thanks <strong><?php print($firstname); print(" "); print($lastname); ?></strong>,
				a copy of this invoice has been sent to <strong><?php print($email); print(" "); ?></strong>
				We will call you at <strong><?php print($phone); print(" "); ?></strong>
				</p>
				
				<p>
				You have ordered:
				<br>
				</p>
				
				<p>
				Main sea food type: <strong><?php print($seafood); print(" "); ?></strong><br>
				Order size: <strong><?php print($size1); print(" "); ?></strong><br>
				Piece size: <strong><?php print($size); print(" "); ?></strong><br>
				Extra items: <br>
				<strong>
				<?php 
				foreach ($_POST["extras"] as $extras) 
				        { 
				            print( "$space"); print($extras);
				            echo '<br/>';
				        } 
				?></strong>
				</p>
				<p>
				Comments: <strong><?php print($comment); print(" "); ?></strong>
				</p>
			<?php include("../HF/footer.inc"); ?>
</html>