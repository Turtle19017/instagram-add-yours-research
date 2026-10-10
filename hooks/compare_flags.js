Java.perform(function() {
    console.log("[*] Comparing X.0Hj5 flags between Drawable #0 and Drawable #1...");

    Java.choose("com.instagram.ui.widget.interactive.InteractiveDrawableContainer", {
        onMatch: function(container) {
            // Find all Hj5 instances inside container
            var containerCls = container.getClass();
            var fields = containerCls.getDeclaredFields();
            
            // Container usually has a list or map of Hj5 controllers
            for (var i = 0; i < fields.length; i++) {
                var f = fields[i];
                f.setAccessible(true);
                var v = f.get(container);
                if (v && v.$className && (v.$className.indexOf("List") !== -1 || v.$className.indexOf("ArrayList") !== -1)) {
                    var list = Java.cast(v, Java.use("java.util.List"));
                    if (list.size() === 2) {
                        var first = list.get(0);
                        if (first && first.$className && first.$className.indexOf("0Hj5") !== -1) {
                            console.log("[+] Found Hj5 list in container." + f.getName());
                            var hj0 = Java.cast(list.get(0), Java.use("X.0Hj5"));
                            var hj1 = Java.cast(list.get(1), Java.use("X.0Hj5"));
                            
                            var hjCls = hj0.getClass();
                            var hFields = hjCls.getDeclaredFields();
                            console.log("\nFIELD_NAME | D0 (Template) | D1 (Movable Add Yours)");
                            console.log("-------------------------------------------------");
                            for (var j = 0; j < hFields.length; j++) {
                                var hf = hFields[j];
                                hf.setAccessible(true);
                                var v0 = hf.get(hj0);
                                var v1 = hf.get(hj1);
                                if ("" + v0 !== "" + v1) {
                                    console.log(hf.getName() + " (" + hf.getType().getName() + ") | " + v0 + " | " + v1);
                                }
                            }
                        }
                    }
                }
            }
        },
        onComplete: function() {
            console.log("[*] Done comparison.");
        }
    });
});
