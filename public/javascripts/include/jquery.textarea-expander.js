$.fn.TextAreaExpander = function(minHeight, maxHeight) {
    $(this).attr('data-expander', 'true');
	var hCheck = !($.browser.msie || $.browser.opera);
	function ResizeTextarea(e) {
		e = e.target || e;
		var vlen = e.value.length, ewidth = e.offsetWidth;
		if (vlen != e.valLength || ewidth != e.boxWidth) {
			if (hCheck && (vlen < e.valLength || ewidth != e.boxWidth)) e.style.height = "0px";
			var h = Math.max(e.expandMin, Math.min(e.scrollHeight, e.expandMax));
			e.style.overflow = (e.scrollHeight > h ? "auto" : "hidden");
			e.style.height = h + "px";
			e.valLength = vlen;
			e.boxWidth = ewidth;
		}
		return true;
	};

	this.each(function() {
		if (this.nodeName.toLowerCase() != "textarea") return;
		this.expandMin = minHeight || 0;
		this.expandMax = maxHeight || 99999;
		ResizeTextarea(this);
		if (!this.Initialized) {
			this.Initialized = true;
			$(this).css("padding-top", 0).css("padding-bottom", 0);
			$(this).bind("keyup", ResizeTextarea).bind("focus", ResizeTextarea);
		}
	});
	return this;
};