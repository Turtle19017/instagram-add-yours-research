Java.perform(function() {
    console.log("[*] Inspecting X.0HGi draw method and fields...");

    Java.choose("com.instagram.ui.widget.interactive.InteractiveDrawableContainer", {
        onMatch: function(container) {
            var drawables = container.getAllDrawables();
            var d0 = drawables.get(0);
            if (!d0) return;

            var fieldA0A = d0.getClass().getDeclaredField("A0A");
            fieldA0A.setAccessible(true);
            var listA0A = Java.cast(fieldA0A.get(d0), Java.use("java.util.List"));
            if (listA0A.size() > 0) {
                var hgi = listA0A.get(0);
                var hgiCls = hgi.getClass();
                
                var fields = hgiCls.getDeclaredFields();
                for (var i = 0; i < fields.length; i++) {
                    var f = fields[i];
                    f.setAccessible(true);
                    var v = f.get(hgi);
                    console.log("hgi." + f.getName() + " (" + f.getType().getName() + ") = " + v);
                }
            }
        },
        onComplete: function() {
            console.log("[*] Done.");
        }
    });
});
