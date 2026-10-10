Java.perform(function() {
    console.log("[*] EXPERIMENT D: Testing Runtime Bitmap Substitution...");

    Java.choose("com.instagram.ui.widget.interactive.InteractiveDrawableContainer", {
        onMatch: function(container) {
            var fieldA17 = container.getClass().getDeclaredField("A17");
            fieldA17.setAccessible(true);
            var list = Java.cast(fieldA17.get(container), Java.use("java.util.List"));
            if (list.size() === 0) return;

            var d0 = container.getAllDrawables().get(0);
            if (!d0) return;

            // Access X.0HGi map containing the bitmap
            var fieldA0A = d0.getClass().getDeclaredField("A0A");
            fieldA0A.setAccessible(true);
            var listA0A = Java.cast(fieldA0A.get(d0), Java.use("java.util.List"));
            if (listA0A.size() === 0) return;

            var hgi = listA0A.get(0);
            var fieldA0L = hgi.getClass().getDeclaredField("A0L");
            fieldA0L.setAccessible(true);
            var map = Java.cast(fieldA0L.get(hgi), Java.use("java.util.Map"));

            var IntegerCls = Java.use("java.lang.Integer");
            var key0 = IntegerCls.valueOf(0);
            var currentBmp = map.get(key0);
            console.log("[+] Current live template bitmap: " + currentBmp);

            // Decode substituted bitmap from local storage if available
            var subPath = "/data/data/com.instagram.android/cache/repositioned_template_overlay.png";
            var File = Java.use("java.io.File");
            if (File.$new(subPath).exists()) {
                var BitmapFactory = Java.use("android.graphics.BitmapFactory");
                var newBmp = BitmapFactory.decodeFile(subPath);
                if (newBmp) {
                    map.put(key0, newBmp);
                    console.log("[+] Substituted live bitmap with: " + subPath + " (" + newBmp.getWidth() + "x" + newBmp.getHeight() + ")");
                    container.postInvalidate();
                }
            } else {
                console.log("[*] Substituted file not placed at " + subPath + ", hook ready.");
            }
        },
        onComplete: function() {
            console.log("[*] Bitmap substitution hook finished.");
        }
    });
});
