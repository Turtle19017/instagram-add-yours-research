Java.perform(function() {
    console.log("[*] Inspecting Drawable #0 (X.0Ilf) in detail...");

    Java.choose("com.instagram.ui.widget.interactive.InteractiveDrawableContainer", {
        onMatch: function(container) {
            var drawables = container.getAllDrawables();
            var d0 = drawables.get(0);
            if (!d0) return;

            console.log("d0: " + d0);
            try {
                var innerD = d0.A04();
                console.log("d0.A04() returned: " + innerD + " (class: " + (innerD ? innerD.$className : "null") + ")");
                if (innerD) {
                    var innerBounds = innerD.getBounds();
                    console.log("innerD bounds: " + (innerBounds ? innerBounds.toString() : "null"));
                    console.log("innerD intrinsic: w=" + innerD.getIntrinsicWidth() + " h=" + innerD.getIntrinsicHeight());
                }
            } catch(e) {
                console.log("Error calling d0.A04(): " + e);
            }

            // Inspect A0A list
            try {
                var fieldA0A = d0.getClass().getDeclaredField("A0A");
                fieldA0A.setAccessible(true);
                var listA0A = Java.cast(fieldA0A.get(d0), Java.use("java.util.List"));
                console.log("listA0A size: " + listA0A.size());
                for (var i = 0; i < listA0A.size(); i++) {
                    var item = listA0A.get(i);
                    console.log("  item #" + i + ": " + item + " ($className: " + item.$className + ")");
                    // inspect item fields
                    var itemFields = item.getClass().getDeclaredFields();
                    for (var j = 0; j < itemFields.length; j++) {
                        var ifield = itemFields[j];
                        ifield.setAccessible(true);
                        var ival = ifield.get(item);
                        console.log("    " + ifield.getName() + " (" + ifield.getType().getName() + ") = " + ival);
                    }
                }
            } catch(e) {
                console.log("Error inspecting A0A: " + e);
            }

            // Inspect A02, A03, A08
            var checkFields = ["A02", "A03", "A04", "A08"];
            for (var k = 0; k < checkFields.length; k++) {
                var fn = checkFields[k];
                try {
                    var f = d0.getClass().getDeclaredField(fn);
                    f.setAccessible(true);
                    var val = f.get(d0);
                    console.log("d0." + fn + " = " + val + " ($className: " + (val ? val.$className : "null") + ")");
                    if (val) {
                        var vfields = val.getClass().getDeclaredFields();
                        for (var vf = 0; vf < vfields.length; vf++) {
                            var vfield = vfields[vf];
                            vfield.setAccessible(true);
                            var vval = vfield.get(val);
                            var s = "" + vval;
                            if (s.length > 100) s = s.substring(0, 100) + "...";
                            console.log("    " + vfield.getName() + " (" + vfield.getType().getName() + ") = " + s);
                        }
                    }
                } catch(e) {
                    console.log("Error inspecting " + fn + ": " + e);
                }
            }
        },
        onComplete: function() {
            console.log("[*] Completed inspection of d0.");
        }
    });
});
