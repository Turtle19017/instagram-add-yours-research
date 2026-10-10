Java.perform(function() {
    console.log("[*] Inspecting Template Model object (X.0KLA)...");

    Java.choose("com.instagram.ui.widget.interactive.InteractiveDrawableContainer", {
        onMatch: function(container) {
            var drawables = container.getAllDrawables();
            var d0 = drawables.get(0);
            if (!d0) return;

            var fieldA08 = d0.getClass().getDeclaredField("A08");
            fieldA08.setAccessible(true);
            var hj5 = fieldA08.get(d0);
            if (!hj5) return;

            var fieldA0L = hj5.getClass().getDeclaredField("A0L");
            fieldA0L.setAccessible(true);
            var model = fieldA0L.get(hj5);
            console.log("Model instance: " + model + " ($className: " + (model ? model.$className : "null") + ")");

            if (model) {
                var cls = model.getClass();
                console.log("Model Class: " + cls.getName());
                var fields = cls.getDeclaredFields();
                for (var i = 0; i < fields.length; i++) {
                    var f = fields[i];
                    f.setAccessible(true);
                    var v = f.get(model);
                    console.log("  " + f.getName() + " (" + f.getType().getName() + ") = " + v);
                }
            }
        },
        onComplete: function() {
            console.log("[*] Done.");
        }
    });
});
