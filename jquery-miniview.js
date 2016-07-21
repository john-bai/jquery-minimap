(function( $ ) {
	$.fn.miniview = function( children ) {
		var x, y, l, t, w, h;
		var $parent = this;
		var $window = $( window );
		var $miniview = $( "#miniview" );
		var miniviewWidth = $miniview.width();
		var miniviewHeight = $miniview.height();
		var $viewport = $( "<div></div>" ).addClass( "port" );
		$miniview.append( $viewport );
		synchronize();

		$window.on( "resize", synchronize );
		$parent.on( "scroll", synchronize );
		$parent.on( "drag", init );
		$miniview.on( "mousedown touchstart", down );

		function down( e ) {
			var moveEvent, upEvent;
			var pos = $miniview.position();

			x = Math.round( pos.left + l + w / 2 );
			y = Math.round( pos.top + t + h / 2 );
			move( e );

			if ( e.type === "touchstart" ) {
				moveEvent = "touchmove.miniviewDown";
				upEvent = "touchend";
			} else {
				moveEvent = "mousemove.miniviewDown";
				upEvent = "mouseup";
			}
			$window.on( moveEvent, move );
			$window.one( upEvent, up );
		}

		function move( e ) {
			e.preventDefault();

			if ( e.type.match( /touch/ ) ) {
				if ( e.touches.length > 1 ) {
					return;
				}
				var event = e.touches[ 0 ];
			} else {
				var event = e;
			}

			var dx = event.clientX - x;
			var dy = event.clientY - y;
			if ( l + dx < 0 ) {
				dx = -l;
			}
			if ( t + dy < 0 ) {
				dy = -t;
			}
			if ( l + w + dx > miniviewWidth ) {
				dx = miniviewWidth - l - w;
			}
			if ( t + h + dy > miniviewHeight ) {
				dy = miniviewHeight - t - h;
			}

			x += dx;
			y += dy;

			l += dx;
			t += dy;

			var coefX = miniviewWidth / $parent[ 0 ].scrollWidth;
			var coefY = miniviewHeight / $parent[ 0 ].scrollHeight;
			var left = l / coefX;
			var top = t / coefY;

			$parent[ 0 ].scrollLeft = Math.round( left );
			$parent[ 0 ].scrollTop = Math.round( top );

			redraw();
		}

		function up() {
			$window.off( ".miniviewDown" );
		}

		function synchronize() {
			var dims = [ $parent.width(), $parent.height() ];
			var scroll = [ $parent.scrollLeft(), $parent.scrollTop() ];
			var scaleX = miniviewWidth / $parent[ 0 ].scrollWidth;
			var scaleY = miniviewHeight / $parent[ 0 ].scrollHeight;

			var lW = dims[ 0 ] * scaleX;
			var lH = dims[ 1 ] * scaleY;
			var lX = scroll[ 0 ] * scaleX;
			var lY = scroll[ 1 ] * scaleY;

			w = Math.round( lW );
			h = Math.round( lH );
			l = Math.round( lX );
			t = Math.round( lY );
			//set the mini viewport dimesions
			redraw();
		}

		function redraw() {
			$viewport.css( {
				width : w,
				height : h,
				left : l,
				top : t
			} );
		}

		function init() {
			$miniview.find( ".mini" ).remove();
			//creating mini version of the supplied children
			children.each( function() {
				var $child = $( this );
				var mini = $( "<div></div>" ).addClass( "mini" );
				$miniview.append( mini );
				var ratioX = miniviewWidth / $parent[ 0 ].scrollWidth;
				var ratioY = miniviewHeight / $parent[ 0 ].scrollHeight;

				var wM = $child.width() * ratioX;
				var hM = $child.height() * ratioY;
				var xM = ($child.position().left + $parent.scrollLeft()) * ratioX;
				var yM = ($child.position().top + $parent.scrollTop()) * ratioY;

				mini.css( {
					width : Math.round( wM ),
					height : Math.round( hM ),
					left : Math.round( xM ),
					top : Math.round( yM )
				} );
			} );
		}

		init();

		return this;
	}
})( jQuery );
