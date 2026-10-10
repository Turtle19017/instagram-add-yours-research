Java.perform(function() {
    console.log("[*] Unlocking template interaction flags in memory...");

    Java.choose("com.instagram.ui.widget.interactive.InteractiveDrawableContainer", {
        onMatch: function(container) {
            var fieldA17 = container.getClass().getDeclaredField("A17");
            fieldA17.setAccessible(true);
            var list = Java.cast(fieldA17.get(container), Java.use("java.util.List"));
            if (list.size() > 0) {
                var hj0 = Java.cast(list.get(0), Java.use("X.0Hj5"));
                var RectF = Java.use("android.graphics.RectF");
                var Rect = Java.use("android.graphics.Rect");
                
                var cls = hj0.getClass();
                
                function setField(name, val) {
                    var f = cls.getDeclaredField(name);
                    f.setAccessible(true);
                    f.set(hj0, val);
                }

                setField("A0U", Java.use("java.lang.Boolean").valueOf(true));
                setField("A0g", Java.use("java.lang.Boolean").valueOf(true));
                setField("A0h", Java.use("java.lang.Boolean").valueOf(true));
                setField("A08", Java.use("java.lang.Integer").valueOf(57)); // Enable touch flags
                setField("A07", Java.use("java.lang.Integer").valueOf(6));
                
                // Give it a valid touch hit-rect so touch events detect it!
                setField("A0w", RectF.$new(0.0, 0.0, 504.0, 896.0));
                setField("A0v", Rect.$new(0, 0, 504, 896));
                
                console.log("[+] Successfully updated D0 (Template) interaction flags to MATCH D1!");
                console.log("    A0U=true, A0g=true, A0h=true, A08=57, A07=6, A0w=[0,0,504,896]");

                // Invalidate
                container.postInvalidate();
            }
        },
        onComplete: function() {
            console.log("[*] Done unlock script.");
        }
    });
});
