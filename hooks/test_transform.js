Java.perform(function() {
    console.log("[*] Testing X.0Hj5 position and gesture methods...");

    Java.choose("com.instagram.ui.widget.interactive.InteractiveDrawableContainer", {
        onMatch: function(container) {
            var drawables = container.getAllDrawables();
            var d0 = drawables.get(0);
            if (!d0) return;

            var fieldA08 = d0.getClass().getDeclaredField("A08");
            fieldA08.setAccessible(true);
            var Hj5Cls = Java.use("X.0Hj5");
            var hj5 = Java.cast(fieldA08.get(d0), Hj5Cls);
            if (!hj5) return;

            console.log("X.0Hj5 translation X (CzU): " + hj5.CzU());
            console.log("X.0Hj5 translation Y (CzV): " + hj5.CzV());
            console.log("X.0Hj5 scale (BWl): " + hj5.BWl());
            
            // Check Drawable #1 (Add Yours sticker) as well for comparison!
            if (drawables.size() > 1) {
                var d1 = drawables.get(1);
                console.log("\nDrawable #1: " + d1.$className);
                // Find d1's transform metadata
                var d1Fields = d1.getClass().getDeclaredFields();
                for (var i = 0; i < d1Fields.length; i++) {
                    var f = d1Fields[i];
                    f.setAccessible(true);
                    var v = f.get(d1);
                    if (v && v.$className && v.$className.indexOf("0Hj5") !== -1) {
                        console.log("Found Hj5 in d1." + f.getName() + ": CzU=" + v.CzU() + " CzV=" + v.CzV() + " scale=" + v.BWl());
                    }
                }
            }
        },
        onComplete: function() {
            console.log("[*] Done.");
        }
    });
});
