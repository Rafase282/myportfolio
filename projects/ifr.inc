		<script type="text/javascript">
		var iframe;
		function loader()
		{
			iframe = document.getElementById("content");
			iframe.contentDocument.designMode = "on";
		}
		function showSource()
		{
			var content = iframe.contentDocument.body.innerHTML;
			content.replace(/</g, '&lt;');
			content.replace(/>/g, '&gt;');
			alert(content);
		}
		function createLink()
		{
			var url = prompt("Enter URL:", "http://");
			if (url) iframe.contentDocument.execCommand ("createlink", false, url);
		}
		
		</script>
