Java.perform(function() {
    console.log("[*] EXPERIMENT B: Testing Gesture Unlock on Drawable #0...");

    Java.choose("com.instagram.ui.widget.interactive.InteractiveDrawableContainer", {
        onMatch: function(container) {
            // Find container that has drawables
            var fieldA17 = container.getClass().getDeclaredField("A17");
            fieldA17.setAccessible(true);
            var list = Java.cast(fieldA17.get(container), Java.use("java.util.List"));
            if (list.size() === 0) return;

            var hj0 = Java.cast(list.get(0), Java.use("X.0Hj5"));
            var cls = hj0.getClass();

            // Set flags to enable gestures
            function setField(name, val) {
                var f = cls.getDeclaredField(name);
                f.setAccessible(true);
                f.set(hj0, val);
            }

            console.log("[+] Original A08: " + cls.getDeclaredField("A08").get(hj0));
            console.log("[+] Original A07: " + cls.getDeclaredField("A07").get(hj0));
            console.log("[+] Original A0U: " + cls.getDeclaredField("A0U").get(hj0));

            // Set interactive booleans
            setField("A0U", Java.use("java.lang.Boolean").valueOf(true)); // isSelectable / isInteractive
            setField("A0g", Java.use("java.lang.Boolean").valueOf(true));
            setField("A0h", Java.use("java.lang.Boolean").valueOf(true));
            setField("A08", Java.use("java.lang.Integer").valueOf(57)); // Gesture bitmask (drag | scale | rotate | select)
            setField("A07", Java.use("java.lang.Integer").valueOf(6));

            // Calculate View-local hitbox for nameplate:
            // Bounding box in bitmap (720x1280) is (124, 346, 597, 535)
            // Scaling factor s = 504 / 720 = 0.7
            // View local bounds: [86.8, 242.2, 417.9, 374.5]
            // Note: Since hj0 was displaced in Experiment A, let's also support full canvas or current position
            var RectF = Java.use("android.graphics.RectF");
            var Rect = Java.use("android.graphics.Rect");
            
            // Set hitbox covering the nameplate area
            var hitRect = RectF.$new(0.0, 0.0, 504.0, 896.0); // Full container coverage ensures touch registration
            setField("A0w", hitRect);
            setField("A0v", Rect.$new(0, 0, 504, 896));

            console.log("[+] Applied gesture flags: A08=57, A07=6, A0U=true, A0g=true, A0h=true");
            console.log("[+] Applied hitbox: " + hitRect);

            // Invalidate container
            container.postInvalidate();
        },
        onComplete: function() {
            console.log("[*] Gesture unlock hook completed.");
        }
    });
});
